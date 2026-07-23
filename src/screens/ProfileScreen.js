import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronDown, Menu, Plus } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import BottomTabBar from "../components/BottomTabBar";
import EditModeBadge from "../components/EditModeBadge";
import ProfileEditorSheet from "../components/ProfileEditorSheet";
import GridIcon from "../components/icons/GridIcon";
import RepostIcon from "../components/RepostIcon";
import ViewCountIcon from "../components/icons/ViewCountIcon";
import ClipIcon from "../components/icons/ClipIcon";
import PinnedIcon from "../components/icons/PinnedIcon";
import SpinnerArc from "../components/SpinnerArc";
import { useReelData } from "../context/ReelDataContext";
import { useProfileData } from "../context/ProfileDataContext";
import { formatCount } from "../constants/profileData";
import { fetchInstagramProfile, fetchInstagramReels } from "../services/apifyService";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GAP = 3;
const CELL_SIZE = SCREEN_WIDTH / 3;
const GRID_BATCH_ROWS = 8;
const GRID_BATCH_SIZE = GRID_BATCH_ROWS * 3;
const FLOATING_CHROME_TRIGGER = 118;
const FLOATING_TABS_OFFSET = 18;

function formatCompactCountWholeLocal(value) {
  const normalized =
    typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, "")) || 0;
  const n = Math.max(0, normalized);
  if (n >= 1_000_000) return `${Math.floor(n / 1_000_000)}m`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}k`;
  return `${n}`;
}

const HIGHLIGHTS = [
  { id: "h1", imageUri: "https://picsum.photos/seed/hl1/200", label: "Success" },
  { id: "h2", imageUri: "https://picsum.photos/seed/hl2/200", label: "muscle edit" },
  { id: "h3", imageUri: "https://picsum.photos/seed/hl3/200", label: "pushup" },
];

const PROFILE_HOME_ICON_ASSET = require("../../assets/icons/home.png");
const PROFILE_REPOSTS_ICON_ASSET = require("../../assets/icons/reposts.png");
const PROFILE_TAGGED_ICON_ASSET = require("../../assets/icons/tagged.png");

const ImageTabIcon = ({ source, color }) => (
  <Image source={source} style={[styles.imageTabIcon, { tintColor: color }]} resizeMode="contain" />
);

const ReelTabIcon = ({ color, active }) => (
  active ? (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill={color} role="img" aria-label="Reels">
      <Path d="M22.942 7.464c-.062-1.36-.306-2.143-.511-2.671a5.366 5.366 0 0 0-1.272-1.952 5.364 5.364 0 0 0-1.951-1.27c-.53-.207-1.312-.45-2.673-.513-1.2-.054-1.557-.066-4.535-.066s-3.336.012-4.536.066c-1.36.062-2.143.306-2.672.511-.769.3-1.371.692-1.951 1.272s-.973 1.182-1.27 1.951c-.207.53-.45 1.312-.513 2.673C1.004 8.665.992 9.022.992 12s.012 3.336.066 4.536c.062 1.36.306 2.143.511 2.671.298.77.69 1.373 1.272 1.952.58.581 1.182.974 1.951 1.27.53.207 1.311.45 2.673.513 1.199.054 1.557.066 4.535.066s3.336-.012 4.536-.066c1.36-.062 2.143-.306 2.671-.511a5.368 5.368 0 0 0 1.953-1.273c.58-.58.972-1.181 1.27-1.95.206-.53.45-1.312.512-2.673.054-1.2.066-1.557.066-4.535s-.012-3.336-.066-4.536Zm-7.085 6.055-5.25 3c-1.167.667-2.619-.175-2.619-1.519V9c0-1.344 1.452-2.186 2.619-1.52l5.25 3c1.175.672 1.175 2.368 0 3.04Z" />
    </Svg>
  ) : (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" role="img" aria-label="Reels">
      <Path
        d="M22.942 7.464c-.062-1.36-.306-2.143-.511-2.671a5.366 5.366 0 0 0-1.272-1.952 5.364 5.364 0 0 0-1.951-1.27c-.53-.207-1.312-.45-2.673-.513-1.2-.054-1.557-.066-4.535-.066s-3.336.012-4.536.066c-1.36.062-2.143.306-2.672.511-.769.3-1.371.692-1.951 1.272s-.973 1.182-1.27 1.951c-.207.53-.45 1.312-.513 2.673C1.004 8.665.992 9.022.992 12s.012 3.336.066 4.536c.062 1.36.306 2.143.511 2.671.298.77.69 1.373 1.272 1.952.58.581 1.182.974 1.951 1.27.53.207 1.311.45 2.673.513 1.199.054 1.557.066 4.535.066s3.336-.012 4.536-.066c1.36-.062 2.143-.306 2.671-.511a5.368 5.368 0 0 0 1.953-1.273c.58-.58.972-1.181 1.27-1.95.206-.53.45-1.312.512-2.673.054-1.2.066-1.557.066-4.535s-.012-3.336-.066-4.536Zm-7.085 6.055-5.25 3c-1.167.667-2.619-.175-2.619-1.519V9c0-1.344 1.452-2.186 2.619-1.52l5.25 3c1.175.672 1.175 2.368 0 3.04Z"
        stroke={color}
        strokeWidth="1.5"
      />
    </Svg>
  )
);

const RepostTabIcon = ({ color }) => (
  <Svg viewBox="600 350 850 1100" width={26} height={26}>
    <Path
      fill={color}
      stroke={color}
      strokeWidth="10"
      d="M 1372.15 740.263 C 1398.91 738.991 1416.32 757.558 1416.25 783.786 C 1416.11 840.606 1416.17 897.441 1416.25 954.261 C 1416.29 979.648 1416.96 1002.56 1410.81 1027.57 C 1402.44 1061.85 1384.93 1093.22 1360.15 1118.35 C 1333.17 1145.68 1298.94 1164.7 1261.49 1173.18 C 1234.63 1179.28 1182.72 1177.49 1153.43 1177.5 L 993.047 1177.64 L 1034.41 1218.57 C 1049.45 1233.46 1070.18 1249.36 1070.34 1272.23 C 1070.43 1282.85 1066.31 1293.07 1058.87 1300.64 C 1050.94 1308.73 1040.04 1313.21 1028.72 1313.02 C 1003.67 1312.77 983.479 1285.21 966.795 1268.33 L 883.465 1184.05 C 869.978 1170.49 853.443 1158.31 852.727 1138.15 C 852.138 1126.54 855.73 1114.96 863.844 1106.43 C 901.148 1067.23 939.601 1029.16 977.277 990.322 C 987.647 979.631 998.546 967.6 1010.64 958.889 C 1015.05 955.708 1024.01 954.26 1029.43 953.961 C 1040.62 953.346 1051.51 957.121 1059.69 964.849 C 1067.39 972.145 1071.82 982.238 1071.98 992.844 C 1072.14 1000.77 1070.17 1008.59 1066.27 1015.49 C 1061.85 1023.22 1041.42 1042.92 1034.31 1050.16 L 989.861 1095.9 L 1151.06 1095.93 C 1201.74 1095.95 1252.39 1104.16 1293.38 1068.7 C 1342.88 1025.87 1334.66 974.059 1334.6 915.694 L 1334.6 814.317 C 1334.39 780.857 1328.84 747.469 1372.15 740.263 z"
    />
    <Path
      fill={color}
      stroke={color}
      strokeWidth="10"
      d="M 1092.16 419.402 C 1117.39 420.292 1130.23 438.611 1146.83 455.407 L 1191.16 500.191 L 1237.24 546.186 C 1254.23 563.141 1274.73 578.008 1271.49 604.328 C 1268.91 625.239 1250.54 638.59 1236.38 652.792 L 1185.08 704.288 L 1141.12 748.393 C 1127 762.553 1116.73 777.502 1095.51 778.771 C 1084.2 779.52 1073.09 775.557 1064.81 767.824 C 1057.17 760.503 1052.83 750.408 1052.76 739.834 C 1052.37 716.387 1073.52 700.12 1088.72 684.672 L 1133.53 639.005 C 1082.16 638.132 1029.36 639.41 977.825 638.933 C 957.826 638.748 900.683 637.635 883.606 640.797 C 864.769 644.401 847.115 652.603 832.213 664.676 C 806.582 685.212 792.777 712.837 789.175 745.133 C 786.741 808.365 791.318 885.134 788.291 948.117 C 786.267 990.241 707.698 1002.92 707.421 935.284 L 707.603 820.195 C 707.565 796.406 706.324 756.092 708.658 733.174 C 713.609 688.038 733.939 645.981 766.235 614.063 C 791.615 588.884 823.406 571.136 858.158 562.744 C 891.122 554.749 949.662 557.526 986.21 557.551 L 1132.21 557.356 L 1083.85 509.05 C 1071.54 496.729 1054.87 483.916 1053.2 465.471 C 1050.81 439.143 1066.17 421.889 1092.16 419.402 z"
    />
  </Svg>
);

const TagIcon = ({ color }) => (
  <Svg viewBox="550 550 950 850" width={26} height={26}>
    <Path
      fill={color}
      stroke={color}
      strokeWidth="10"
      d="M 1022.6 598.429 C 1070.43 595.68 1097.55 624.438 1129.55 653.757 C 1147.13 669.987 1164.82 686.102 1182.62 702.101 C 1204.4 702.638 1234.3 702.484 1256.07 702.078 C 1305.29 701.16 1342.3 704.648 1379.49 741.498 C 1413.72 775.417 1421.55 810.531 1421.68 856.987 L 1421.66 1101.65 L 1421.64 1171.96 C 1421.62 1197.35 1422.75 1226.07 1416.74 1250.9 C 1406.03 1295.15 1362.17 1339.51 1317.1 1348.24 C 1285.83 1354.29 1241.26 1351.71 1208.41 1351.7 L 1027.99 1351.7 L 841 1351.67 C 815.57 1351.67 756.381 1353.49 734.571 1348.61 C 710.752 1343.18 688.835 1331.43 671.119 1314.61 C 642.846 1287.31 628.057 1251.74 628.028 1212.64 C 627.966 1128.9 628.067 1045.11 628.008 961.367 L 627.966 883.427 C 627.959 859.492 626.592 832.061 631.787 809.027 C 642.913 759.699 684.398 717.11 733.89 705.916 C 755.131 701.111 776.59 702.03 798.155 702.071 L 867.054 702.057 L 917.809 655.472 C 954.123 622.158 970.194 601.762 1022.6 598.429 z"
    />
    <Path
      fill="#FFFFFF"
      d="M 1015.15 643.279 C 1055.02 640.276 1068.11 657.448 1095.91 682.851 L 1141.32 724.636 C 1165.96 747.316 1162.2 746.727 1195.29 746.591 L 1254.93 746.369 C 1267.76 746.337 1287.08 745.949 1299.35 747.962 C 1309.48 749.633 1319.26 753.001 1328.26 757.925 C 1389.4 791.469 1377.72 859.697 1377.67 918.617 L 1377.65 1057.59 L 1377.68 1163.34 C 1377.69 1180.64 1378.53 1207.48 1377.05 1223.97 C 1375.91 1236.69 1372.1 1249.03 1365.86 1260.17 C 1351.68 1285.28 1330.82 1298.67 1303.67 1306.04 C 1287.2 1211.96 1202.76 1138.68 1114.5 1111.65 C 1088.69 1103.74 1063.68 1099.94 1036.91 1098.43 C 912.707 1089.71 767.396 1178.02 745.47 1305.77 C 732.035 1302.23 724.329 1299.54 712.692 1291.9 C 664.998 1260.62 672.007 1210.83 672.018 1162.17 L 672.086 1025.46 L 672.014 897.784 C 671.997 880.297 671.026 845.439 673.003 829.085 C 674.728 813.987 680.218 799.563 688.969 787.139 C 717.653 745.875 752.668 746.31 796.446 746.331 L 855.803 746.435 C 889.805 746.726 883.441 747.038 908.222 724.225 L 955.521 680.695 C 975.756 662.108 986.96 648.24 1015.15 643.279 z"
    />
    <Path
      fill={color}
      stroke={color}
      strokeWidth="8"
      d="M 1016.05 790.179 C 1097.79 785.649 1167.72 848.231 1172.27 929.97 C 1176.82 1011.71 1114.25 1081.66 1032.51 1086.22 C 950.75 1090.78 880.775 1028.19 876.228 946.434 C 871.681 864.673 934.284 794.71 1016.05 790.179 z"
    />
    <Path
      fill="#FFFFFF"
      d="M 1011.03 834.948 C 1068.21 827.65 1120.44 868.219 1127.5 925.43 C 1134.57 982.642 1093.79 1034.7 1036.55 1041.54 C 979.64 1048.34 927.941 1007.84 920.912 950.954 C 913.884 894.068 954.173 842.205 1011.03 834.948 z"
    />
    <Path
      fill="#FFFFFF"
      d="M 1009.04 1142.42 C 1111.09 1132.54 1235.24 1203.67 1259.92 1306.99 C 1188.07 1307.92 1114.49 1307.15 1042.51 1307.16 L 789.078 1306.99 C 800.711 1251.94 845.165 1205.33 892.377 1177.66 C 929.007 1156.19 967.101 1145.73 1009.04 1142.42 z"
    />
  </Svg>
);

const ThreadsIcon = ({ size = 16 }) => (
  <Svg viewBox="0 0 1056 1196" width={size} height={size * 1.13}>
    <Path
      fill="#000000"
      d="M 523.524 112.449 C 601.347 109.455 689.934 125.603 759.94 159.763 C 851.582 204.481 916.782 278.826 955.825 372.385 C 964.819 393.939 970.141 413.492 977.593 435.117 C 970.267 436.4 956.138 440.671 948.289 442.828 L 889.764 459.237 L 889.576 458.202 C 887.502 447.301 880.75 428.675 876.594 417.849 C 852.682 355.558 815.02 301.297 759.133 263.209 C 670.693 202.934 548.756 192.23 445.693 210.824 C 363.477 225.656 289.878 267.467 242.445 337.98 C 165.957 451.685 157.471 620.927 180.837 751.86 C 197.131 843.16 240.05 933.733 319.051 986.813 C 407.717 1046.39 527.562 1055.09 630.588 1037.02 C 699.951 1024.86 771.801 983.747 811.497 924.704 C 839.15 884.114 849.404 834.144 839.97 785.945 C 829.795 735.159 801.967 706.613 760.618 679.108 C 759.487 684.068 758.452 689.795 757.592 694.807 C 742.219 784.385 693.715 860.885 602.051 886.147 C 501.369 913.895 369.358 879.743 338.063 768.535 C 326.025 725.755 333.111 681.458 354.928 643.314 C 368.945 620.515 387.988 601.221 410.603 586.908 C 472.037 547.205 549.618 543.742 620.705 548.191 C 634.875 549.078 656.965 551.088 670.631 554.022 C 666.276 517.326 647.023 477.225 613.703 458.533 C 557.429 426.964 455.732 436.695 421.412 497.261 C 396.766 481.951 369.727 462.883 345.411 446.537 C 350.407 441.242 355.941 433.512 360.723 427.576 C 434.968 335.42 597.332 325.206 687.002 399.395 C 741.481 444.469 758.806 512.112 764.432 580.523 C 797.306 593.644 829.973 614.266 855.608 638.177 C 963.576 738.88 956.182 907.262 857.514 1011.61 C 774.318 1099.59 674.559 1131.98 555.991 1135.31 C 433.799 1138.74 313.033 1110.78 222.149 1025 C 119.92 929.028 82.6203 782.181 79.1566 646.518 C 76.6744 501.785 104.684 346.573 207.392 237.757 C 292.179 147.926 403.487 116.251 523.524 112.449 z"
    />
    <Path
      fill="#FFFFFF"
      d="M 564.509 637.433 C 602.525 635.779 636.213 639.911 673.365 646.439 C 663.033 736.594 635.387 803.436 533.287 805.031 C 486.307 805.487 425.118 783.898 422.665 728.765 C 421.916 710.03 428.696 691.776 441.495 678.073 C 471.805 645.003 522.468 639.114 564.509 637.433 z"
    />
  </Svg>
);

const TrendArrowIcon = ({ size = 10, color = "#2EAD4E" }) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <Path
      d="M2 12L12 2M12 2H7.5M12 2V6.5"
      stroke={color}
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function sanitizeDisplayName(value) {
  return String(value || "")
    .replace(/^[\s•·●\.\-]+/, "")
    .trim();
}

const PULL_TRIGGER_DISTANCE = 48;
const PULL_BANNER_HEIGHT = 70;

export default function ProfileScreen() {
  const { state: reelState, dispatch: reelDispatch } = useReelData();
  const { state: profileState, dispatch: profileDispatch } = useProfileData();
  const profile = profileState.profile;
  const selectedPostData = reelState.selectedPostData;
  const highlightsVisible = profile.highlightsVisible ?? profile.showHighlights ?? true;
  const threadsRowVisible = profile.threadsRowVisible ?? profile.showThreadsRow ?? true;
  const dashboardVisible = profile.dashboardVisible ?? true;
  const noteVisible = profile.noteVisible ?? true;
  const noteTooltipText = (profile.noteText || "Just curious...").trim();
  const visibleHighlights = Array.isArray(profile.highlightItems)
    ? profile.highlightItems
    : HIGHLIGHTS;
  const insets = useSafeAreaInsets();
  const [activeContentTab, setActiveContentTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [visibleGridCount, setVisibleGridCount] = useState(GRID_BATCH_SIZE);
  const [showFloatingTabs, setShowFloatingTabs] = useState(false);
  const [showFloatingHeader, setShowFloatingHeader] = useState(false);
  const [tabsAnchorY, setTabsAnchorY] = useState(420);
  const scrollOffsetY = useRef(0);
  const lastScrollY = useRef(0);
  const upwardRevealDistance = useRef(0);
  const pullDistanceRef = useRef(0);
  const touchStartY = useRef(0);
  const effectiveProfileReels = useMemo(() => {
    const reels = Array.isArray(profile.reels) ? profile.reels : [];
    if (!selectedPostData) {
      return reels;
    }

    const selectedId = selectedPostData.id || selectedPostData.shortCode || selectedPostData.thumbnailUri;
    return reels.map((post) => {
      const matches =
        post.id === selectedId ||
        post.shortCode === selectedPostData.shortCode ||
        post.thumbnailUri === selectedPostData.thumbnailUri;

      if (!matches) {
        return post;
      }

      return {
        ...post,
        ...selectedPostData,
        thumbnailUri: selectedPostData.thumbnailUri || post.thumbnailUri,
        videoUrl: selectedPostData.videoUrl ?? post.videoUrl ?? null,
        viewCount: selectedPostData.viewCount ?? selectedPostData.views ?? post.viewCount,
        likesCount: selectedPostData.likesCount ?? selectedPostData.likes ?? post.likesCount,
        commentsCount: selectedPostData.commentsCount ?? selectedPostData.comments ?? post.commentsCount,
        caption: selectedPostData.caption || post.caption,
        timestamp: selectedPostData.timestamp || post.timestamp,
        username: selectedPostData.username || post.username,
        displayName: selectedPostData.displayName || post.displayName,
      };
    });
  }, [profile.reels, selectedPostData]);

  const renderableProfileReels = useMemo(
    () => effectiveProfileReels.map((post, originalIndex) => ({ ...post, originalIndex })),
    [effectiveProfileReels]
  );

  const visibleProfileReels = useMemo(
    () => renderableProfileReels.slice(0, Math.min(visibleGridCount, renderableProfileReels.length)),
    [renderableProfileReels, visibleGridCount]
  );

  useEffect(() => {
    setVisibleGridCount(GRID_BATCH_SIZE);
  }, [renderableProfileReels.length]);

  const loadMoreGridRows = () => {
    if (activeContentTab !== 0) {
      return;
    }

    setVisibleGridCount((current) => {
      if (current >= renderableProfileReels.length) {
        return current;
      }
      return Math.min(current + GRID_BATCH_SIZE, renderableProfileReels.length);
    });
  };

  const handleRefresh = async () => {
    if (refreshing) {
      return;
    }

    const username = (profile.username || profileState.lastLoadedUsername || "")
      .trim()
      .replace(/^@/, "");
    if (!username) {
      return;
    }

    setRefreshing(true);
    try {
      const profileRaw = await fetchInstagramProfile(username);
      const extractedHighlights = Array.isArray(profileRaw.highlights) ? profileRaw.highlights : [];
      const extractedCategoryText = (profileRaw.categoryText || "").trim();
      const extractedThreadsLabel = (profileRaw.threadsLabel || "").trim();
      const extractedNoteText = (profileRaw.noteText || "").trim();
      let reels = await fetchInstagramReels(username);
      if (!reels.length) {
        reels = Array.isArray(profileRaw.latestPosts) ? profileRaw.latestPosts : [];
      }
      const dashboardViews = reels.reduce(
        (sum, item) => sum + (Number(item?.viewCount ?? item?.views ?? 0) || 0),
        0
      );

      profileDispatch({
        type: "MERGE_PROFILE",
        updates: {
          username,
          displayName: profileRaw.fullName || username,
          bio: profileRaw.biography || "",
          profilePicUri: profileRaw.profilePicUrl || profile.profilePicUri,
          followersCount: profileRaw.followersCount || 0,
          followingCount: profileRaw.followsCount || 0,
          postsCount: profileRaw.postsCount || 0,
          dashboardViews: dashboardViews || profile.dashboardViews || 0,
          externalUrl: profileRaw.externalUrl || "",
          isVerified: profileRaw.verified || false,
          reels,
          highlightItems: extractedHighlights,
          highlightsVisible: extractedHighlights.length > 0,
          categoryText: extractedCategoryText || profile.categoryText || "",
          noteVisible: Boolean(extractedCategoryText || extractedNoteText || profile.noteVisible),
          noteText: extractedNoteText || profile.noteText || "",
          threadsLabel: extractedThreadsLabel,
          threadsRowVisible: Boolean(extractedThreadsLabel),
        },
      });
      profileDispatch({ type: "SET_LAST_LOADED_USERNAME", value: username });
    } catch (error) {
      console.log("[ProfileScreen] refresh failed", error);
    } finally {
      setRefreshing(false);
      pullDistanceRef.current = 0;
      setPullDistance(0);
    }
  };

  const refreshHandlerRef = useRef(handleRefresh);
  refreshHandlerRef.current = handleRefresh;

  const profileHeaderBar = (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerLeftBtn} activeOpacity={0.7}>
        <Plus size={29} color="#111111" strokeWidth={1.5} />
      </TouchableOpacity>

      <View style={styles.headerCenterContainer} pointerEvents="none">
        <View style={styles.headerCenterRow}>
          <Text style={styles.headerUsername}>{profile.username}</Text>
          <ChevronDown size={17} color="#111111" strokeWidth={2.5} />
          <View style={styles.headerRedDot} />
        </View>
      </View>

      <View style={styles.headerRightGroup}>
        <TouchableOpacity style={styles.headerThreadsBtn} activeOpacity={0.7}>
          <ThreadsIcon size={22} />
          <View style={styles.headerThreadsDot} />
        </TouchableOpacity>

        {profileState.isEditing ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => profileDispatch({ type: "SET_EDITING", value: false })}
          >
            <Text style={styles.doneBtn}>Done</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.headerRightBtn}
            activeOpacity={0.7}
            onPress={() => profileDispatch({ type: "SET_EDITING", value: true })}
          >
            <Menu size={26} color="#111111" strokeWidth={1.75} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const profileTabsBar = (
    <View style={styles.tabsContainer}>
      {[
        { id: 0, component: ({ color, active }) => <GridIcon active={active} color={color} /> },
        { id: 1, component: ({ color, active }) => <ReelTabIcon color={color} active={active} /> },
        {
          id: 2,
          component: ({ color }) => <RepostIcon size={26} color={color} />,
        },
        { id: 3, component: ({ color }) => <ImageTabIcon source={PROFILE_TAGGED_ICON_ASSET} color={color} /> },
      ].map((tab) => {
        const isActive = activeContentTab === tab.id;
        const color = isActive ? "#111111" : "#8E8E8E";
        return (
          <TouchableOpacity key={tab.id} style={styles.tabBtn} activeOpacity={0.7} onPress={() => setActiveContentTab(tab.id)}>
            {tab.component({ color, active: isActive })}
            {isActive ? <View style={styles.activeTabIndicator} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const profileListHeader = (
    <View>
      <View style={styles.chromeShell}>
        {profileHeaderBar}
      </View>
      <View style={styles.profileTop}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrap}>
            {noteVisible && noteTooltipText ? (
              <View style={styles.noteTooltip}>
                <Text style={styles.noteTooltipText} numberOfLines={2}>
                  {noteTooltipText}
                </Text>
                <View style={styles.noteTooltipTail} />
                <View style={styles.noteTooltipMiniDot} />
              </View>
            ) : null}
            <Image source={{ uri: profile.profilePicUri }} style={styles.avatarImage} resizeMode="cover" />
            <View style={styles.addStoryBadge}>
              <Text style={styles.addStoryBadgeText}>+</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.displayName}>{sanitizeDisplayName(profile.displayName)}</Text>
          <View style={styles.statsRow}>
            {[
              { count: profile.postsCount, label: "posts" },
              { count: profile.followersCount, label: "followers" },
              { count: profile.followingCount, label: "following" },
            ].map(({ count, label }) => (
              <TouchableOpacity key={label} style={styles.statCol} activeOpacity={0.7}>
                <Text style={styles.statCount}>{formatCount(count)}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {profile.categoryText ? (
        <Text style={styles.avatarCategoryText} numberOfLines={1}>
          {profile.categoryText}
        </Text>
      ) : null}

      <View style={styles.bioSection}>
        <Text style={styles.bioText}>{profile.bio}</Text>
      </View>

      {threadsRowVisible ? (
        <View style={styles.threadsLinkRow}>
          <TouchableOpacity style={styles.threadsLink} activeOpacity={0.7}>
            <ThreadsIcon size={14} />
            <Text style={styles.threadsLinkText}>{profile.threadsLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addLink} activeOpacity={0.7}>
            <Text style={styles.addLinkText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {dashboardVisible ? (
        <TouchableOpacity
          style={styles.professionalDashboard}
          activeOpacity={0.7}
          onPress={() => reelDispatch({ type: "SET_SCREEN", value: "professionalDashboard" })}
        >
          <Text style={styles.dashboardTitle}>Professional dashboard</Text>
          <View style={styles.dashboardSubtitleRow}>
            <TrendArrowIcon />
            <Text style={styles.dashboardSubtitle}>
              {formatCount(profile.dashboardViews)} views in the last 30 days.
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={styles.actionButtonsRow}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>Edit profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>Share profile</Text>
        </TouchableOpacity>
      </View>

      {highlightsVisible ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightsContainer}>
          <TouchableOpacity style={styles.highlightItem} activeOpacity={0.7}>
            <View style={styles.newHighlightCircle}>
              <Plus size={28} color="#111111" strokeWidth={1.75} />
            </View>
            <Text style={styles.highlightLabel}>New</Text>
          </TouchableOpacity>

          {visibleHighlights.length
            ? visibleHighlights.map((hl) => (
                <TouchableOpacity key={hl.id} style={styles.highlightItem} activeOpacity={0.7}>
                  <View style={styles.highlightOuterCircle}>
                    <View style={styles.highlightCircle}>
                      <Image
                        source={{ uri: hl.coverUrl || hl.imageUri }}
                        style={styles.highlightImage}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                  <Text style={styles.highlightLabel} numberOfLines={1}>
                    {hl.title || hl.label}
                  </Text>
                </TouchableOpacity>
              ))
            : null}
        </ScrollView>
      ) : null}

      <View
        onLayout={(event) => {
          const nextY = event.nativeEvent.layout.y;
          if (Number.isFinite(nextY) && nextY > 0) {
            setTabsAnchorY(nextY);
          }
        }}
      >
        {profileTabsBar}
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.scrollArea}>
        <FlatList
          style={[styles.scrollWrap, profileState.isEditing && styles.editingBorder]}
          contentContainerStyle={styles.content}
          data={activeContentTab === 0 ? visibleProfileReels : []}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => String(item.id || item.shortCode || item.thumbnailUri || index)}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.postCell}
              activeOpacity={0.9}
              onPress={() => {
                reelDispatch({ type: "SET_SELECTED_POST_INDEX", index: item.originalIndex ?? index });
                reelDispatch({ type: "SET_SELECTED_POST_URI", uri: item.thumbnailUri });
                reelDispatch({ type: "SET_SCREEN", value: "posts" });
              }}
            >
              <Image source={{ uri: item.thumbnailUri }} style={styles.postThumbnail} resizeMode="cover" />
              {item.isPinned || item.pinned ? (
                <View style={styles.videoIndicator}>
                  <PinnedIcon size={20} color="#FFFFFF" />
                </View>
              ) : item.videoUrl !== null ? (
                <View style={styles.videoIndicator}>
                  <ClipIcon size={20} color="#FFFFFF" />
                </View>
              ) : null}
              {item.videoUrl !== null ? (
                <View style={styles.videoViewsBadge}>
                  <ViewCountIcon size={16} color="#FFFFFF" />
                  <Text style={styles.videoViewsText}>{formatCompactCountWholeLocal(item.viewCount)}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          )}
          ListHeaderComponent={profileListHeader}
          ListFooterComponent={
            activeContentTab === 0 && visibleProfileReels.length < renderableProfileReels.length ? (
              <View style={styles.gridLoaderRow}>
                <SpinnerArc
                  size={50}
                  strokeWidth={1}
                  duration={950}
                  segmentColors={["#F4F4F4", "#E5E5E5", "#D0D0D0", "#B9B9B9", "#A0A0A0", "#878787", "#6D6D6D", "#575757", "#404040"]}
                />
              </View>
            ) : (
              <View style={styles.listFooterSpacer} />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#F1F4F8"
              colors={["#F1F4F8"]}
              progressBackgroundColor="#F1F4F8"
              progressViewOffset={0}
              size="large"
            />
          }
          onScroll={(event) => {
            const y = event.nativeEvent.contentOffset.y;
            const directionDelta = y - lastScrollY.current;
            lastScrollY.current = y;
            scrollOffsetY.current = y;

            if (y <= FLOATING_CHROME_TRIGGER) {
              upwardRevealDistance.current = 0;
              setShowFloatingTabs(false);
              setShowFloatingHeader(false);
            } else if (directionDelta > 1) {
              upwardRevealDistance.current = 0;
              setShowFloatingTabs(false);
              setShowFloatingHeader(false);
            } else if (directionDelta < -1) {
              upwardRevealDistance.current += Math.abs(directionDelta);
              setShowFloatingTabs(y + FLOATING_TABS_OFFSET < tabsAnchorY);
              setShowFloatingHeader(upwardRevealDistance.current >= 22);
            }

            const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
            const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
            if (distanceFromBottom < 220) {
              loadMoreGridRows();
            }
          }}
          scrollEventThrottle={16}
          onTouchStart={(event) => {
            touchStartY.current = event.nativeEvent.pageY;
          }}
          onTouchMove={(event) => {
            if (scrollOffsetY.current > 1 || refreshing) {
              return;
            }

            const distance = Math.min(
              Math.max((event.nativeEvent.pageY - touchStartY.current) * 0.55, 0),
              PULL_BANNER_HEIGHT
            );
            pullDistanceRef.current = distance;
            setPullDistance(distance);
          }}
          onTouchEnd={() => {
            if (pullDistanceRef.current >= PULL_TRIGGER_DISTANCE) {
              pullDistanceRef.current = PULL_BANNER_HEIGHT;
              setPullDistance(PULL_BANNER_HEIGHT);
              refreshHandlerRef.current();
            } else if (!refreshing) {
              pullDistanceRef.current = 0;
              setPullDistance(0);
            }
          }}
          onTouchCancel={() => {
            pullDistanceRef.current = 0;
            setPullDistance(0);
          }}
          onEndReached={loadMoreGridRows}
          onEndReachedThreshold={0.35}
          initialNumToRender={GRID_BATCH_SIZE}
          maxToRenderPerBatch={GRID_BATCH_SIZE}
          windowSize={7}
        />

        {showFloatingTabs ? (
          <View style={styles.floatingTabsShell} pointerEvents="box-none">
            {showFloatingHeader ? profileHeaderBar : null}
            {profileTabsBar}
          </View>
        ) : null}

        {pullDistance > 0 || refreshing ? (
          <View
            pointerEvents="none"
            style={[styles.refreshBanner, { height: refreshing ? PULL_BANNER_HEIGHT : pullDistance }]}
          >
            <SpinnerArc size={36} color="#C7CBD1" strokeWidth={1.35} />
          </View>
        ) : null}
      </View>

      <ProfileEditorSheet />

      {profileState.isEditing ? (
        <View style={[styles.editBadgeWrap, { bottom: 64 + insets.bottom }]}>
          <EditModeBadge />
        </View>
      ) : null}

      <BottomTabBar activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 70,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    position: "relative",
    zIndex: 10,
  },
  headerLeftBtn: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    padding: 4,
    marginLeft: -11,
  },
  headerCenterContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  headerCenterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerUsername: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    color: "#111111",
  },
  headerRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3040",
  },
  headerRightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 2,
  },
  headerThreadsBtn: {
    position: "relative",
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  headerThreadsDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF3040",
  },
  headerRightBtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  doneBtn: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#0095F6",
    paddingHorizontal: 8,
  },
  scrollWrap: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
    position: "relative",
  },
  editingBorder: {
    borderTopWidth: 2,
    borderTopColor: "#DD2A7B",
  },
  chromeShell: {
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingBottom: 104,
    backgroundColor: "#FFFFFF",
  },
  floatingChrome: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    backgroundColor: "#FFFFFF",
  },
  floatingTabsShell: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    backgroundColor: "#FFFFFF",
  },
  refreshBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#F1F4F8",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  profileTop: {
    paddingHorizontal: 16,
    marginTop: 28,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  avatarContainer: {
    width: 78,
    height: 92,
    position: "relative",
    alignItems: "center",
    overflow: "visible",
  },
  avatarWrap: {
    position: "absolute",
    left: 0,
    top: 12,
    width: 72,
    height: 72,
  },
  noteTooltip: {
    position: "absolute",
    top: -30,
    left: -2,
    zIndex: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 78,
    maxWidth: 88,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  noteTooltipText: {
    fontSize: 9.5,
    lineHeight: 11.5,
    color: "#6F7682",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  noteTooltipTail: {
    position: "absolute",
    left: 15,
    bottom: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  noteTooltipMiniDot: {
    position: "absolute",
    left: 23,
    bottom: -10,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#FFFFFF",
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "#DBDBDB",
  },
  avatarCategoryText: {
    marginTop: 0,
    marginLeft: 13,
    width: "auto",
    textAlign: "left",
    paddingLeft: 0,
    color: "#8E8E8E",
    fontSize: 12.5,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  addStoryBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#111111",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  addStoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 17,
    includeFontPadding: false,
  },
  statsContainer: {
    flex: 1,
    paddingTop: 0,
    paddingRight: 16,
  },
  displayName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111111",
    marginBottom: 4,
    fontFamily: "Inter_500Medium",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCol: {
    alignItems: "flex-start",
  },
  statCount: {
    fontSize: 17.5,
    fontWeight: "500",
    color: "#111111",
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
  },
  statLabel: {
    fontSize: 14.5,
    fontWeight: "400",
    color: "#111111",
    marginTop: -2,
    fontFamily: "Inter_400Regular",
  },
  bioSection: {
    paddingHorizontal: 14,
    marginTop: 0,
  },
  bioText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#111111",
    lineHeight: 20,
  },
  threadsLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  threadsLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 28,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  threadsLinkText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#111111",
  },
  addLink: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  addLinkText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#737373",
  },
  professionalDashboard: {
    marginHorizontal: 14,
    marginTop: 8,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dashboardSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 1,
  },
  dashboardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111111",
  },
  dashboardSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#7A7A7A",
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 36,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111111",
    fontFamily: "Inter_500Medium",
  },
  highlightsContainer: {
    paddingHorizontal: 14,
    gap: 14,
    paddingTop: 12,
    paddingBottom: 4,
  },
  highlightItem: {
    alignItems: "center",
    width: 76,
  },
  newHighlightCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: "#111111",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  highlightOuterCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: "#e8eaee",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  highlightCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
  },
  highlightImage: {
    width: "100%",
    height: "100%",
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111111",
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    maxWidth: 72,
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 3,
    marginBottom: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: "#DBDBDB",
  },
  tabBtn: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 2,
    backgroundColor: "#111111",
  },
  postGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: GAP,
  },
  gridLoaderRow: {
    width: "100%",
    minHeight: 112,
    paddingTop: 22,
    paddingBottom: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  listFooterSpacer: {
    height: 96,
  },
  postCell: {
    width: CELL_SIZE,
    height: CELL_SIZE * 1.38,
    position: "relative",
    margin: 0,
  },
  postThumbnail: {
    width: "100%",
    height: "100%",
  },
  videoIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
  },
  videoIndicatorIcon: {
    width: 15,
    height: 15,
  },
  videoViewsBadge: {
    position: "absolute",
    left: 7,
    bottom: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    zIndex: 2,
  },
  videoViewsIcon: {
    width: 13,
    height: 13,
  },
  imageTabIcon: {
    width: 22,
    height: 22,
  },
  videoViewsText: {
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "600",
    lineHeight: 12,
    includeFontPadding: false,
  },
  editBadgeWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
  },
});
