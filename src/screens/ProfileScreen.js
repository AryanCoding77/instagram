import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { PanGestureHandler, NativeViewGestureHandler, State } from "react-native-gesture-handler";
import SpinnerArc from "../components/SpinnerArc";
import {
  Plus,
  Lock,
  ChevronDown,
  Menu,
  Repeat2,
  Contact,
} from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import BottomTabBar from "../components/BottomTabBar";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GAP = 3;
const CELL_SIZE = (SCREEN_WIDTH - GAP * 2) / 3;
const CELL_HEIGHT = CELL_SIZE * 1.15;

const HIGHLIGHTS = [
  { id: "h1", imageUri: "https://picsum.photos/seed/hl1/200", label: "Success" },
  { id: "h2", imageUri: "https://picsum.photos/seed/hl2/200", label: "muscle edit" },
  { id: "h3", imageUri: "https://picsum.photos/seed/hl3/200", label: "pushup" },
];

const POSTS = [
  {
    id: "1",
    thumbnailUri: "https://picsum.photos/seed/ironman/400",
    isVideo: true,
  },
  {
    id: "2",
    thumbnailUri: "https://picsum.photos/seed/workout1/400",
    isVideo: true,
  },
  {
    id: "3",
    thumbnailUri: "https://picsum.photos/seed/fitness/400",
    isVideo: true,
  },
  {
    id: "4",
    thumbnailUri: "https://picsum.photos/seed/gym1/400",
    isVideo: true,
  },
  {
    id: "5",
    thumbnailUri: "https://picsum.photos/seed/exercise/400",
    isVideo: true,
  },
  {
    id: "6",
    thumbnailUri: "https://picsum.photos/seed/training/400",
    isVideo: true,
  },
  {
    id: "7",
    thumbnailUri: "https://picsum.photos/seed/muscle/400",
    isVideo: true,
  },
  {
    id: "8",
    thumbnailUri: "https://picsum.photos/seed/strength/400",
    isVideo: true,
  },
  {
    id: "9",
    thumbnailUri: "https://picsum.photos/seed/power/400",
    isVideo: true,
  },
  {
    id: "10",
    thumbnailUri: "https://picsum.photos/seed/athlete/400",
    isVideo: true,
  },
  {
    id: "11",
    thumbnailUri: "https://picsum.photos/seed/sport/400",
    isVideo: true,
  },
  {
    id: "12",
    thumbnailUri: "https://picsum.photos/seed/pushup/400",
    isVideo: true,
  },
];

const GridIcon = ({ color }) => (
  <Svg viewBox="500 500 1050 1050" width={26} height={26}>
    <Path
      fill={color}
      stroke={color}
      strokeWidth="8"
      d="M 1259.79 872.274 C 1311.13 871.131 1363.39 872.641 1414.18 871.996 C 1449.24 871.55 1467.41 876.844 1467.08 915.55 C 1466.91 936.305 1467.16 958.184 1467.17 978.905 L 1467.17 1037.58 C 1467.16 1066.22 1473.45 1097 1437.98 1105.19 C 1431.78 1105.59 1425.57 1105.6 1419.38 1105.59 C 1367.74 1105.49 1315.19 1106.22 1263.67 1105.31 C 1248.64 1105.05 1231.98 1094.66 1230.62 1079.98 C 1228.6 1058.26 1229.53 1030.19 1229.5 1008.44 L 1229.45 942.601 C 1229.46 913.834 1222.72 878.858 1259.79 872.274 z"
    />
    <Path
      fill={color}
      stroke={color}
      strokeWidth="8"
      d="M 1257.78 549.23 C 1290.84 547.097 1324.87 548.762 1358.06 548.761 C 1383.56 548.76 1413.14 546.934 1437.96 549.296 C 1441.69 549.651 1445.3 550.794 1448.65 552.453 C 1456.08 556.129 1462.97 563.705 1465.41 571.691 C 1468.48 581.782 1468.03 729.395 1466.8 748.134 C 1466.43 753.788 1465.79 759.096 1463.05 764.155 C 1457.69 774.05 1448.97 778.838 1438.53 781.68 C 1381.47 784.205 1321.32 780.653 1264.03 781.731 C 1251.12 781.975 1232.34 772.328 1230.92 758.2 C 1227.79 727.022 1230.47 694.013 1229.55 662.553 C 1229.18 634.005 1229.16 608.153 1229.92 579.935 C 1230.77 562.45 1242.07 553.446 1257.78 549.23 z"
    />
    <Path
      fill={color}
      stroke={color}
      strokeWidth="8"
      d="M 936.629 872.282 C 970.337 871.285 1004.25 872.019 1037.98 872.016 C 1061.27 872.015 1085.36 870.757 1108.58 872.301 C 1114.2 872.674 1121.59 873.49 1126.64 875.947 C 1134.23 879.64 1141.01 889.124 1143.13 897.175 C 1145.77 907.255 1145.29 1055.45 1143.8 1073.13 C 1143.29 1079.2 1142.57 1084.49 1139.28 1089.77 C 1133.6 1098.89 1124.74 1103.19 1114.56 1105.32 C 1080.06 1106.55 1045.16 1105.65 1010.62 1105.67 C 987.744 1105.68 963.638 1107.23 940.912 1105.32 C 935.483 1104.86 928.605 1103.71 923.739 1101.26 C 917.125 1097.92 910.715 1089.53 908.643 1082.45 C 905.599 1072.05 905.991 922.764 907.49 903.97 C 907.946 898.245 908.792 893.433 911.821 888.445 C 917.503 879.09 926.326 874.731 936.629 872.282 z"
    />
    <Path
      fill={color}
      d="M 1258.85 1196.22 C 1316.05 1194.18 1375.07 1196.79 1432.41 1196.2 C 1446.09 1196.06 1464.64 1206.45 1465.87 1220.96 C 1468.16 1247.99 1467.17 1276.86 1467.17 1304.2 L 1467.14 1362.72 C 1467.11 1391.9 1473.01 1421.56 1436.25 1428.8 C 1383.93 1429.85 1331.27 1428.51 1278.92 1429.02 C 1267.74 1429.13 1254.27 1429.12 1244.17 1423.55 C 1238.3 1420.32 1231.9 1410.26 1230.63 1403.49 C 1228.67 1376.08 1229.47 1347.8 1229.45 1320.22 L 1229.44 1259.68 C 1229.46 1232.2 1224.17 1203.05 1258.85 1196.22 z"
    />
    <Path
      fill={color}
      d="M 615.732 872.301 C 650.057 871.12 684.704 872.037 719.062 872.018 C 741.587 872.005 765.581 870.411 787.938 872.483 C 793.999 873.045 800.903 874.258 806.242 877.226 C 812.601 880.76 818.488 888.727 820.471 895.666 C 823.593 906.59 823.244 1054.49 821.682 1073.2 C 821.185 1079.14 820.323 1084.35 817.138 1089.5 C 811.455 1098.69 802.72 1103.08 792.491 1105.35 C 777.861 1106.08 762.198 1105.59 747.482 1105.67 C 710.276 1105.86 673.027 1105.56 635.819 1105.65 C 624.524 1105.68 610.191 1106.03 600.091 1100.26 C 593.369 1096.41 586.987 1085.98 585.778 1078.36 C 584.308 1056.05 584.971 1033.14 584.959 1010.69 L 584.953 942.751 C 584.967 912.303 577.782 880.15 615.732 872.301 z"
    />
    <Path
      fill={color}
      d="M 934.574 549.218 C 941.037 548.745 948.096 548.776 954.606 548.799 C 1006.62 548.951 1058.69 548.318 1110.7 549.161 C 1128.81 549.455 1144.02 562.119 1144.15 580.854 C 1144.52 635.971 1144.49 691.16 1144.14 746.277 C 1144.02 766.023 1135 775.651 1116.72 781.637 C 1094.57 783.565 1055.82 781.783 1033.09 782.029 C 1016.65 782.207 939.41 784.094 928.111 779.455 C 919.439 775.851 912.6 768.884 909.159 760.146 C 906.588 753.648 907.037 740.779 907.067 733.236 C 907.264 683.18 906.618 632.619 907.327 582.61 C 907.608 562.79 918.738 554.33 934.574 549.218 z"
    />
    <Path
      fill={color}
      d="M 613.91 549.136 C 646.804 547.418 680.451 548.747 713.426 548.75 C 737.937 548.752 763.696 547.073 788.035 549.125 C 793.95 549.624 802.285 551.073 807.353 554.186 C 814.243 558.418 819.03 566.863 820.935 574.513 C 823.66 585.461 823.096 733.091 821.542 750.665 C 821.044 756.308 820.292 760.782 817.271 765.711 C 811.791 774.653 803.432 779.06 793.611 781.652 C 779.807 782.55 764.22 782.04 750.188 782.016 C 706.51 781.506 662.601 782.997 618.955 781.702 C 586.158 778.634 584.754 757.516 584.988 731.077 C 585.434 680.639 584.079 630.472 585.498 580.096 C 585.99 562.644 597.91 553.026 613.91 549.136 z"
    />
    <Path
      fill={color}
      d="M 936.879 1196.2 C 963.068 1194.31 999.565 1196.61 1027.23 1195.86 C 1054.9 1195.92 1082.59 1195.57 1110.25 1196.26 C 1123.71 1196.6 1141.7 1206.1 1142.98 1220.5 C 1145.36 1247.29 1144.29 1276 1144.31 1303.08 L 1144.32 1361.58 C 1144.29 1391.11 1150.72 1420.62 1114.29 1428.84 C 1082.3 1430.1 1046.65 1428.3 1014.23 1429.02 C 990.068 1428.32 965.423 1430.17 941.337 1428.73 C 905.667 1426.59 907.053 1400.45 907.037 1375.02 L 907.017 1327.56 L 907.036 1264.14 C 907.059 1235.43 900.618 1203.33 936.879 1196.2 z"
    />
    <Path
      fill={color}
      d="M 613.618 1196.28 C 631.727 1195.11 652.516 1195.92 670.891 1195.88 C 710.773 1196.6 751.343 1194.63 791.133 1196.29 C 820.038 1197.5 822.447 1224.23 822.137 1245.68 C 821.407 1296.16 823.174 1346.37 821.623 1396.78 C 821.07 1414.76 809.986 1424.15 793.69 1428.62 C 759.996 1429.97 723.976 1428.5 689.967 1429.03 C 666.625 1428.34 642.899 1430.06 619.6 1428.73 C 582.162 1426.59 584.993 1398.4 584.972 1372.04 L 584.945 1321.69 L 584.956 1262.28 C 584.974 1234.7 579.13 1203.9 613.618 1196.28 z"
    />
  </Svg>
);

const ReelsIcon = ({ color }) => (
  <View
    style={{
      width: 22,
      height: 22,
      borderRadius: 5,
      borderWidth: 1.5,
      borderColor: color,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        width: 0,
        height: 0,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderLeftWidth: 7,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderLeftColor: color,
        marginLeft: 2,
      }}
    />
  </View>
);

const ReelTabIcon = ({ color }) => (
  <Svg viewBox="400 350 1250 1250" width={26} height={26}>
    <Path
      fill={color}
      stroke={color}
      strokeWidth="20"
      d="M 751.04 438.405 C 774.093 435.758 809.656 437.671 833.474 437.702 L 983.499 437.72 L 1187.84 437.752 C 1232.07 437.71 1294.39 435.121 1336.62 443.488 C 1383.12 452.818 1426.5 473.756 1462.72 504.353 C 1520.91 552.619 1557.26 622.239 1563.61 697.57 C 1566.1 727.989 1564.84 773.162 1564.86 804.407 L 1564.83 994.698 L 1564.82 1177.55 C 1564.82 1215.76 1566.86 1267.52 1559.95 1304.07 C 1550.92 1351.8 1529.49 1396.32 1497.81 1433.15 C 1444.62 1495.31 1376.72 1526.49 1296.02 1532.85 C 1256.87 1533.83 1214.56 1533 1175.1 1533 L 942.951 1532.99 L 821.465 1533.02 C 784.208 1533.03 745.882 1534.7 709.329 1527.39 C 664.689 1518.1 622.934 1498.23 587.581 1469.44 C 531.136 1423.67 491.105 1353.8 484.787 1281.32 C 482.242 1252.12 483.553 1205.19 483.527 1175.09 L 483.559 978.911 L 483.506 797.591 C 483.496 758.517 481.424 706.75 488.477 669.604 C 497.332 622.473 518.161 578.411 548.963 541.655 C 602.071 478.06 669.049 445.496 751.04 438.405 z"
    />
    <Path
      fill="#FFFFFF"
      d="M 759.68 508.449 C 799.312 507.295 842.218 508.163 882.22 508.169 L 1109.38 508.186 L 1229.46 508.172 C 1257.91 508.18 1291.74 506.775 1319.2 511.693 C 1355.59 518.052 1389.67 533.896 1417.98 557.629 C 1462.33 594.2 1490.2 646.994 1495.38 704.241 C 1498.09 735.36 1496.7 784.613 1496.69 816.97 L 1496.66 1017.29 L 1496.68 1177.87 C 1496.7 1210.54 1498.47 1259.71 1492.75 1290.15 C 1485.53 1326.66 1469.05 1360.7 1444.9 1389.02 C 1403.17 1438.26 1352.32 1459.75 1289.25 1464.78 C 1247.31 1465.72 1203.39 1465.09 1161.34 1465.09 L 934.248 1465.06 L 819.98 1465.09 C 790.28 1465.1 755.045 1466.52 726.505 1461.03 C 689.177 1453.95 654.422 1437.01 625.838 1411.98 C 581.916 1373.76 555.278 1319.43 551.956 1261.3 C 549.833 1228.36 551.282 1183.77 551.298 1149.68 L 551.345 944.227 L 551.296 794.335 C 551.262 762.283 549.647 715.806 555.373 685.606 C 562.846 646.377 580.799 609.903 607.326 580.053 C 647.834 534.555 699.467 512.015 759.68 508.449 z"
    />
    <Path
      fill={color}
      stroke={color}
      strokeWidth="8"
      d="M 887.192 708.417 C 926.337 705.956 956.43 731.108 987.887 750.964 L 1089.21 814.938 L 1194.47 880.585 C 1213.05 892.162 1232.28 903.835 1250.47 916.002 C 1260.23 922.532 1265.19 928.048 1271.69 937.72 C 1286.53 960.13 1291.71 987.578 1286.06 1013.86 C 1280.51 1040.44 1264.57 1059.76 1242.03 1073.79 C 1226.36 1083.55 1210.7 1093.98 1195.16 1103.99 L 1087.04 1174.16 L 989.587 1237.26 C 963.666 1254.13 934.113 1277.7 903.031 1281.3 C 877.571 1284.32 851.969 1276.93 832.039 1260.8 C 789.334 1226.42 797.451 1174.31 797.466 1125.45 L 797.475 990.403 L 797.462 862.112 C 797.465 839.225 795.968 810.697 799.082 788.383 C 805.596 741.707 841.145 712.796 887.192 708.417 z"
    />
    <Path
      fill="#FFFFFF"
      d="M 884.949 777.173 C 892.606 776.031 900.093 776.545 906.854 780.645 C 924.039 791.066 941.042 801.787 958.077 812.452 L 1057.74 874.806 L 1154.54 935.27 C 1172.35 946.39 1190.31 957.392 1207.85 968.906 C 1221.24 976.557 1224.93 1001.39 1212.63 1011.48 C 1199.86 1021.96 1181.83 1032.37 1167.68 1041.4 L 1084.42 1094.98 L 965.151 1171.89 C 945.343 1184.69 925.182 1198.12 905.019 1210.35 C 899.042 1213.98 890.912 1215.02 884.14 1212.69 C 876.797 1210.14 870.862 1204.63 867.781 1197.49 C 864.588 1190.19 865.854 1130.04 865.856 1119.01 L 865.836 987.103 L 865.792 865.667 C 865.786 844.146 865.642 822.417 866.005 800.898 C 866.062 797.567 866.475 795.35 867.824 792.364 C 871.7 783.778 876.761 780.634 884.949 777.173 z"
    />
  </Svg>
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

const PersonPlusIcon = ({ color = "#111111", size = 18 }) => (
  <Svg viewBox="0 0 1044 1028" width={size} height={size * 0.985}>
    <Path
      fill={color}
      d="M 320.564 592.423 C 327.11 591.792 337.999 591.823 344.696 591.761 L 500.901 591.73 C 544.916 591.73 609.061 588.756 650.011 599.124 C 690.794 609.499 728.092 630.514 758.095 660.023 C 803.266 704.511 829.03 765.046 829.775 828.442 C 829.785 858.583 817.707 887.469 796.245 908.632 C 760.167 944.724 724.926 941.818 678.538 941.777 L 607.5 941.706 L 320.485 941.714 L 243.055 941.721 C 227.774 941.74 202.846 942.416 188.608 939.926 C 168.579 936.23 149.909 927.228 134.545 913.857 C 112.098 894.633 98.3367 867.181 96.3651 837.694 C 92.438 780.715 116.48 716.437 154.059 674.003 C 198.341 624 254.316 596.83 320.564 592.423 z"
      transform="translate(1044,0) scale(-1,1)"
    />
    <Path
      fill={color}
      d="M 457.55 122.938 C 565.689 120.118 655.62 205.535 658.366 313.676 C 661.112 421.818 575.632 511.69 467.489 514.361 C 359.452 517.031 269.686 431.652 266.942 323.616 C 264.199 215.58 349.516 125.756 457.55 122.938 z"
      transform="translate(1044,0) scale(-1,1)"
    />
    <Path
      fill={color}
      d="M 842.211 336.194 C 842.564 336.174 842.917 336.156 843.271 336.14 C 878.594 334.63 872.49 374.644 872.42 398.138 C 872.233 420.017 872.259 441.898 872.496 463.776 L 938.226 463.628 C 949.125 463.612 960.749 464.082 971.53 463.929 C 994.883 463.596 1010.18 489.018 992.152 506.925 C 988.595 510.507 984.065 512.966 979.123 513.997 C 970.676 515.729 948.145 515.105 938.556 515.069 L 872.274 514.973 C 871.824 535.872 875.478 612.95 869.731 626.653 C 866.179 635.122 859.402 639.295 851.209 642.607 C 850.286 642.666 849.363 642.709 848.439 642.737 C 841.187 642.923 834.176 640.125 829.045 634.997 C 817.849 624.017 820.943 596.041 820.983 580.797 C 821.11 558.884 821.111 536.971 820.985 515.058 C 787.84 514.616 754.729 515.588 721.497 514.843 C 706.705 514.512 694.279 505.249 693.179 489.666 C 692.414 478.826 703.072 466.682 713.836 465.019 C 727.611 462.89 742.188 463.629 756.269 463.657 C 777.854 463.784 799.439 463.76 821.024 463.587 C 821.177 444.081 818.288 363.157 823.807 351.134 C 827.512 343.061 834.241 339.269 842.211 336.194 z"
      transform="translate(1044,0) scale(-1,1)"
    />
  </Svg>
);

const PostReelIcon = ({ size = 20 }) => (
  <Svg viewBox="0 0 2048 1023" width={size} height={size * 0.5}>
    <Path
      fill="#FFFFFF"
      d="M 946.157 270.448 L 946.801 270.419 C 973.08 269.318 1005.17 268.553 1031.82 269.677 C 1099.21 272.517 1192.76 261.651 1246.6 308.903 C 1278.19 336.63 1286.67 381.714 1287.77 421.289 C 1288.69 454.113 1288.46 487.206 1288.5 520.057 C 1286.92 564.331 1292.37 612.949 1280.14 656.095 C 1256.21 740.553 1176.08 745.314 1105.04 747.886 C 1066.29 748.26 1027.55 748.374 988.801 748.23 C 928.72 748.134 847.207 752.838 800.435 709.594 C 768.524 680.09 761.727 638.024 760.497 596.566 C 759.594 566.159 760.382 535.043 760.104 504.556 C 762.02 442.58 750.248 363.751 795.938 314.372 C 832.933 274.39 895.82 272.326 946.157 270.448 z M 1068.15 562.872 C 1081.47 555.19 1095.57 546.776 1108.87 539.275 C 1160.45 510.202 1129.88 495.997 1096.63 476.45 L 1050.5 448.975 C 1028.71 436.048 999.963 417.24 978.812 405.813 C 975.858 404.221 972.688 403.071 969.401 402.399 C 966.047 401.722 961.088 401.862 957.626 402.279 C 952.19 405.097 948.888 407.633 946.907 413.6 C 944.238 421.639 945.093 583.031 945.869 601.535 C 946.001 604.663 946.036 607.546 947.56 610.378 C 949.925 614.776 954.776 618.343 959.576 619.622 C 962.975 620.528 966.343 620.203 969.633 619.056 C 986.358 613.222 1002.43 601.412 1017.6 592.365 C 1032.79 583.311 1048.38 574.888 1063.5 565.73 C 1065.05 564.787 1066.6 563.834 1068.15 562.872 z"
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

const SPINNER_HEIGHT = 72;
const PULL_THRESHOLD = 60;

export default function ProfileScreen() {
  const [activeContentTab, setActiveContentTab] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 60;

  // Pull-to-refresh Animated values (using standard React Native Animated)
  const scrollY = useRef(0);
  const pullDistance = useRef(new Animated.Value(0)).current;
  const isRefreshing = useRef(false);

  // Refs for gesture handler cooperation
  const panRef = useRef(null);
  const scrollRef = useRef(null);

  // Toggle spinner visibility based on pull distance updates
  useEffect(() => {
    const listenerId = pullDistance.addListener(({ value }) => {
      const shouldShow = value > PULL_THRESHOLD * 0.5;
      setShowSpinner(shouldShow);
    });
    return () => {
      pullDistance.removeListener(listenerId);
    };
  }, [pullDistance]);

  const handleScroll = (event) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
  };

  const onGestureEvent = (event) => {
    const { translationY } = event.nativeEvent;
    if (scrollY.current <= 0 && translationY > 0 && !isRefreshing.current) {
      const pull = Math.min(translationY * 0.5, SPINNER_HEIGHT);
      pullDistance.setValue(pull);
    }
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      if (pullDistance._value >= PULL_THRESHOLD && !isRefreshing.current) {
        isRefreshing.current = true;
        Animated.spring(pullDistance, {
          toValue: SPINNER_HEIGHT,
          tension: 120,
          friction: 15,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          Animated.spring(pullDistance, {
            toValue: 0,
            tension: 150,
            friction: 18,
            useNativeDriver: true,
          }).start(() => {
            isRefreshing.current = false;
          });
        }, 2000);
      } else {
        Animated.spring(pullDistance, {
          toValue: 0,
          tension: 200,
          friction: 20,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  // Spinner slides in from above
  const spinnerTranslateY = pullDistance.interpolate({
    inputRange: [0, SPINNER_HEIGHT],
    outputRange: [-SPINNER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  const spinnerOpacity = pullDistance.interpolate({
    inputRange: [0, PULL_THRESHOLD * 0.5, PULL_THRESHOLD],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const spinnerAnimStyle = {
    transform: [{ translateY: spinnerTranslateY }],
    opacity: spinnerOpacity,
  };

  // Content shifts down as spinner enters
  const contentAnimStyle = {
    transform: [{ translateY: pullDistance }],
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      {/* Profile Header - FIXED */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeftBtn} activeOpacity={0.7}>
          <Plus size={32} color="#111111" strokeWidth={1.5} />
        </TouchableOpacity>

        <View style={styles.headerCenterContainer} pointerEvents="none">
          <View style={styles.headerCenterRow}>
            <Lock size={17} color="#111111" strokeWidth={2} />
            <Text style={styles.headerUsername}>aryan_9544_</Text>
            <ChevronDown size={17} color="#111111" strokeWidth={2.5} />
            <View style={styles.headerRedDot} />
          </View>
        </View>

        <View style={styles.headerRightGroup}>
          <TouchableOpacity style={{ position: 'relative' }} activeOpacity={0.7}>
            <View style={{
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Svg viewBox="0 0 1056 1196" width={26} height={29}>
                <Path
                  fill="#111111"
                  d="M 523.524 112.449 C 601.347 109.455 689.934 125.603 759.94 159.763 C 851.582 204.481 916.782 278.826 955.825 372.385 C 964.819 393.939 970.141 413.492 977.593 435.117 C 970.267 436.4 956.138 440.671 948.289 442.828 L 889.764 459.237 L 889.576 458.202 C 887.502 447.301 880.75 428.675 876.594 417.849 C 852.682 355.558 815.02 301.297 759.133 263.209 C 670.693 202.934 548.756 192.23 445.693 210.824 C 363.477 225.656 289.878 267.467 242.445 337.98 C 165.957 451.685 157.471 620.927 180.837 751.86 C 197.131 843.16 240.05 933.733 319.051 986.813 C 407.717 1046.39 527.562 1055.09 630.588 1037.02 C 699.951 1024.86 771.801 983.747 811.497 924.704 C 839.15 884.114 849.404 834.144 839.97 785.945 C 829.795 735.159 801.967 706.613 760.618 679.108 C 759.487 684.068 758.452 689.795 757.592 694.807 C 742.219 784.385 693.715 860.885 602.051 886.147 C 501.369 913.895 369.358 879.743 338.063 768.535 C 326.025 725.755 333.111 681.458 354.928 643.314 C 368.945 620.515 387.988 601.221 410.603 586.908 C 472.037 547.205 549.618 543.742 620.705 548.191 C 634.875 549.078 656.965 551.088 670.631 554.022 C 666.276 517.326 647.023 477.225 613.703 458.533 C 557.429 426.964 455.732 436.695 421.412 497.261 C 396.766 481.951 369.727 462.883 345.411 446.537 C 350.407 441.242 355.941 433.512 360.723 427.576 C 434.968 335.42 597.332 325.206 687.002 399.395 C 741.481 444.469 758.806 512.112 764.432 580.523 C 797.306 593.644 829.973 614.266 855.608 638.177 C 963.576 738.88 956.182 907.262 857.514 1011.61 C 774.318 1099.59 674.559 1131.98 555.991 1135.31 C 433.799 1138.74 313.033 1110.78 222.149 1025 C 119.92 929.028 82.6203 782.181 79.1566 646.518 C 76.6744 501.785 104.684 346.573 207.392 237.757 C 292.179 147.926 403.487 116.251 523.524 112.449 z"
                />
                <Path
                  fill="#ffffff"
                  d="M 564.509 637.433 C 602.525 635.779 636.213 639.911 673.365 646.439 C 663.033 736.594 635.387 803.436 533.287 805.031 C 486.307 805.487 425.118 783.898 422.665 728.765 C 421.916 710.03 428.696 691.776 441.495 678.073 C 471.805 645.003 522.468 639.114 564.509 637.433 z"
                />
              </Svg>
            </View>
            <View style={{
              position: 'absolute',
              top: -6,
              right: -7,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#FF3040',
              borderWidth: 2,
              borderColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '900',
                color: '#ffffff',
                lineHeight: 12,
                includeFontPadding: false,
              }}>
                2
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerRightBtn} activeOpacity={0.7}>
            <Menu size={26} color="#111111" strokeWidth={1.75} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Spinner — absolutely positioned below header, animates in/out */}
      <Animated.View style={[
        {
          position: 'absolute',
          top: HEADER_HEIGHT + insets.top,
          left: 0,
          right: 0,
          height: SPINNER_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          backgroundColor: '#f1f2f4',
        },
        spinnerAnimStyle,
      ]}>
        {showSpinner && <SpinnerArc />}
      </Animated.View>

      {/* Scroll Content — shifts down to reveal spinner space */}
      <Animated.View style={[{ flex: 1 }, contentAnimStyle]}>
      <PanGestureHandler
        ref={panRef}
        simultaneousHandlers={scrollRef}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetY={[-999, 5]}
        failOffsetY={[-5, 999]}
      >
        <Animated.View style={{ flex: 1 }}>
        <NativeViewGestureHandler ref={scrollRef} simultaneousHandlers={panRef}>
        <Animated.ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          contentContainerStyle={{ paddingBottom: 64 }}
        >
        {/* Profile Top Section */}
        <View style={styles.profileTop}>
          {/* Avatar with Note */}
          <View style={styles.avatarContainer}>
            <View style={{
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: '#DBDBDB',
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 7,
              marginBottom: -15,
              maxWidth: 100,
              minWidth: 80,
              position: 'relative',
              zIndex: 10,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#8E8E8E',
                lineHeight: 15,
                textAlign: 'center',
              }}>
                {"Today's\nvibe..."}
              </Text>
              <View style={{
                position: 'absolute',
                bottom: -5,
                left: 24,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#DBDBDB',
              }} />
            </View>

            <View style={{ position: "relative", width: 90, height: 90 }}>
              <Image
                source={{ uri: "https://picsum.photos/seed/myavatar/200" }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  borderWidth: 1,
                  borderColor: '#DBDBDB',
                }}
                resizeMode="cover"
              />
              <View style={styles.addStoryBadge}>
                <Text style={styles.addStoryBadgeText}>+</Text>
              </View>
            </View>
          </View>

          {/* Stats and Name */}
          <View style={styles.statsContainer}>
            <Text style={styles.displayName}>Aryan_</Text>
            <View style={styles.statsRow}>
              {[
                { count: "1", label: "posts" },
                { count: "75", label: "followers" },
                { count: "111", label: "following" },
              ].map(({ count, label }) => (
                <TouchableOpacity key={label} style={styles.statCol} activeOpacity={0.7}>
                  <Text style={styles.statCount}>{count}</Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.bioSection}>
          <Text style={styles.bioText}>
            {"Doing what 8yrs old me wanted to\n18yrs old\n🎯Goal is to make something big\nContact: wonderscraftofficial@gmail.com"}
          </Text>
        </View>

        {/* Threads Link Row */}
        <View style={styles.threadsLinkRow}>
          <TouchableOpacity style={styles.threadsLink} activeOpacity={0.7}>
            <ThreadsIcon size={14} />
            <Text style={styles.threadsLinkText}>wonders_craft_</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addLink} activeOpacity={0.7}>
            <Text style={styles.addLinkText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Professional Dashboard */}
        <TouchableOpacity style={styles.professionalDashboard} activeOpacity={0.7}>
          <View>
            <Text style={styles.dashboardTitle}>Professional dashboard</Text>
            <Text style={styles.dashboardSubtitle}>515.7K views in the last 30 days.</Text>
          </View>
        </TouchableOpacity>

        {/* Action Buttons Row */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionButtonText}>Edit profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionButtonText}>Share profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addPersonButton} activeOpacity={0.7}>
            <PersonPlusIcon size={20} color="#111111" />
          </TouchableOpacity>
        </View>

        {/* Highlights Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.highlightsContainer}
        >
          {/* New highlight — hidden while refreshing */}
          {!showSpinner && (
            <TouchableOpacity style={styles.highlightItem} activeOpacity={0.7}>
              <View style={styles.newHighlightCircle}>
                <Plus size={28} color="#111111" strokeWidth={1.75} />
              </View>
              <Text style={styles.highlightLabel}>New</Text>
            </TouchableOpacity>
          )}

          {/* highlights list */}
          {HIGHLIGHTS.map((hl) => (
            <TouchableOpacity key={hl.id} style={styles.highlightItem} activeOpacity={0.7}>
              <View style={styles.highlightOuterCircle}>
                <View style={styles.highlightCircle}>
                  <Image source={{ uri: hl.imageUri }} style={styles.highlightImage} resizeMode="cover" />
                </View>
              </View>
              <Text style={styles.highlightLabel} numberOfLines={1}>
                {hl.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content Tabs */}
        <View style={styles.tabsContainer}>
          {[
            { id: 0, component: (color) => <GridIcon color={color} /> },
            { id: 1, component: (color) => <ReelTabIcon color={color} /> },
            { id: 2, component: (color) => <RepostTabIcon color={color} /> },
            { id: 3, component: (color) => <TagIcon color={color} /> },
          ].map((tab) => {
            const isActive = activeContentTab === tab.id;
            const color = isActive ? "#111111" : "#8E8E8E";
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabBtn}
                activeOpacity={0.7}
                onPress={() => setActiveContentTab(tab.id)}
              >
                {tab.component(color)}
                {isActive && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Post Grid */}
        {activeContentTab === 0 && (
          <View style={styles.postGrid}>
            {POSTS.map((post) => (
              <TouchableOpacity key={post.id} style={styles.postCell} activeOpacity={0.9}>
                <Image source={{ uri: post.thumbnailUri }} style={styles.postThumbnail} resizeMode="cover" />
                {post.isVideo && (
                  <View style={styles.videoIndicator}>
                    <PostReelIcon size={60} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
        </Animated.ScrollView>
        </NativeViewGestureHandler>
        </Animated.View>
      </PanGestureHandler>
      </Animated.View>

      {/* Bottom Tab Bar - FIXED */}
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
    height: 60,
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
  headerRightBtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  threadsBtn: {
    position: "relative",
    padding: 4,
  },
  threadsOutline: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  threadsSymbol: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
    lineHeight: 18,
  },
  threadsBadge: {
    position: "absolute",
    top: -1,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF3040",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  threadsBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 10,
  },
  profileTop: {
    paddingHorizontal: 14,
    marginTop: -10,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    width: 90,
    alignItems: "flex-start",
  },
  noteBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginBottom: 4,
    marginLeft: 0,
    maxWidth: 90,
    position: "relative",
  },
  noteText: {
    fontSize: 11,
    color: "#8E8E8E",
    lineHeight: 14,
    fontFamily: "Inter_400Regular",
  },
  noteBubbleTail: {
    position: "absolute",
    bottom: -5,
    left: 14,
    width: 9,
    height: 9,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#DBDBDB",
    transform: [{ rotate: "45deg" }],
  },
  avatarImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 1,
    borderColor: "#DBDBDB",
  },
  addStoryBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#111111",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  addStoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
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
    marginBottom: 8,
    fontFamily: "Inter_500Medium",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 0,
  },
  statCol: {
    alignItems: "flex-start",
    gap: -2,
  },
  statCount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "#111111",
    marginTop: -2,
    fontFamily: "Inter_400Regular",
  },
  bioSection: {
    paddingHorizontal: 14,
    marginTop: 12,
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
    marginTop: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dashboardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 1,
  },
  dashboardSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#737373",
  },
  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  linkPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 28,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 14,
  },
  linkPillIcon: {
    fontSize: 13,
    color: "#111111",
    fontWeight: "400",
    fontFamily: "Inter_400Regular",
  },
  linkPillText: {
    fontSize: 13,
    color: "#111111",
    fontWeight: "400",
    fontFamily: "Inter_400Regular",
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 30,
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
    fontFamily: "Inter_500Medium",
  },
  addPersonButton: {
    width: 34,
    height: 30,
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
    borderWidth: 0,
    borderColor: "#DBDBDB",
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
    marginTop: 14,
    marginBottom: 5,
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
  postCell: {
    width: CELL_SIZE,
    height: CELL_HEIGHT,
    position: "relative",
    margin: 0,
  },
  postThumbnail: {
    width: "100%",
    height: "100%",
  },
  videoIndicator: {
    position: "absolute",
    top: 7,
    right: -8,
  },
  videoIndicatorTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 10,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#FFFFFF",
  },
});
