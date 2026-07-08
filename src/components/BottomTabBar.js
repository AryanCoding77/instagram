import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { C } from "../constants/colors";
import { useReelData } from "../context/ReelDataContext";

const BAR_HEIGHT = 52;
const ICON_SIZE = 30;
const SHARE_SIZE = 22;

export default function BottomTabBar({ activeTab = "home" }) {
  const insets = useSafeAreaInsets();
  const totalHeight = BAR_HEIGHT + insets.bottom;
  const { dispatch } = useReelData();

  return (
    <View style={[styles.bar, { height: totalHeight }]}>
      <View style={styles.row}>
      {/* Tab 1 - Home */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.tabBtn}
        onPress={() => dispatch({ type: "SET_SCREEN", value: "home" })}
      >
        <Svg
          viewBox="0 0 24 24"
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={activeTab === "home" ? C.black : "none"}
          stroke={activeTab === "home" ? "none" : C.black}
          strokeWidth={activeTab === "home" ? 0 : 1.5}
        >
          <Path d="M12 3.2a1.7 1.7 0 0 0-1.2.5L5.1 9.3a2 2 0 0 0-.6 1.4V18a2 2 0 0 0 2 2h3v-5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V20h3a2 2 0 0 0 2-2v-7.3a2 2 0 0 0-.6-1.4l-5.7-5.6A1.7 1.7 0 0 0 12 3.2z" />
        </Svg>
      </TouchableOpacity>

      {/* Tab 2 - Reels */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.tabBtn}
        onPress={() => dispatch({ type: "SET_SCREEN", value: "insights" })}
      >
        <Svg
          viewBox="400 350 1250 1250"
          width={ICON_SIZE - 3}
          height={ICON_SIZE - 3}
        >
          <Path fill="rgb(0,0,0)" stroke="rgb(0,0,0)" strokeWidth="15" d="M 751.04 438.405 C 774.093 435.758 809.656 437.671 833.474 437.702 L 983.499 437.72 L 1187.84 437.752 C 1232.07 437.71 1294.39 435.121 1336.62 443.488 C 1383.12 452.818 1426.5 473.756 1462.72 504.353 C 1520.91 552.619 1557.26 622.239 1563.61 697.57 C 1566.1 727.989 1564.84 773.162 1564.86 804.407 L 1564.83 994.698 L 1564.82 1177.55 C 1564.82 1215.76 1566.86 1267.52 1559.95 1304.07 C 1550.92 1351.8 1529.49 1396.32 1497.81 1433.15 C 1444.62 1495.31 1376.72 1526.49 1296.02 1532.85 C 1256.87 1533.83 1214.56 1533 1175.1 1533 L 942.951 1532.99 L 821.465 1533.02 C 784.208 1533.03 745.882 1534.7 709.329 1527.39 C 664.689 1518.1 622.934 1498.23 587.581 1469.44 C 531.136 1423.67 491.105 1353.8 484.787 1281.32 C 482.242 1252.12 483.553 1205.19 483.527 1175.09 L 483.559 978.911 L 483.506 797.591 C 483.496 758.517 481.424 706.75 488.477 669.604 C 497.332 622.473 518.161 578.411 548.963 541.655 C 602.071 478.06 669.049 445.496 751.04 438.405 z"/>
          <Path fill="rgb(255,255,255)" d="M 759.68 508.449 C 799.312 507.295 842.218 508.163 882.22 508.169 L 1109.38 508.186 L 1229.46 508.172 C 1257.91 508.18 1291.74 506.775 1319.2 511.693 C 1355.59 518.052 1389.67 533.896 1417.98 557.629 C 1462.33 594.2 1490.2 646.994 1495.38 704.241 C 1498.09 735.36 1496.7 784.613 1496.69 816.97 L 1496.66 1017.29 L 1496.68 1177.87 C 1496.7 1210.54 1498.47 1259.71 1492.75 1290.15 C 1485.53 1326.66 1469.05 1360.7 1444.9 1389.02 C 1403.17 1438.26 1352.32 1459.75 1289.25 1464.78 C 1247.31 1465.72 1203.39 1465.09 1161.34 1465.09 L 934.248 1465.06 L 819.98 1465.09 C 790.28 1465.1 755.045 1466.52 726.505 1461.03 C 689.177 1453.95 654.422 1437.01 625.838 1411.98 C 581.916 1373.76 555.278 1319.43 551.956 1261.3 C 549.833 1228.36 551.282 1183.77 551.298 1149.68 L 551.345 944.227 L 551.296 794.335 C 551.262 762.283 549.647 715.806 555.373 685.606 C 562.846 646.377 580.799 609.903 607.326 580.053 C 647.834 534.555 699.467 512.015 759.68 508.449 z"/>
          <Path fill="rgb(0,0,0)" stroke="rgb(0,0,0)" strokeWidth="10" d="M 887.192 708.417 C 926.337 705.956 956.43 731.108 987.887 750.964 L 1089.21 814.938 L 1194.47 880.585 C 1213.05 892.162 1232.28 903.835 1250.47 916.002 C 1260.23 922.532 1265.19 928.048 1271.69 937.72 C 1286.53 960.13 1291.71 987.578 1286.06 1013.86 C 1280.51 1040.44 1264.57 1059.76 1242.03 1073.79 C 1226.36 1083.55 1210.7 1093.98 1195.16 1103.99 L 1087.04 1174.16 L 989.587 1237.26 C 963.666 1254.13 934.113 1277.7 903.031 1281.3 C 877.571 1284.32 851.969 1276.93 832.039 1260.8 C 789.334 1226.42 797.451 1174.31 797.466 1125.45 L 797.475 990.403 L 797.462 862.112 C 797.465 839.225 795.968 810.697 799.082 788.383 C 805.596 741.707 841.145 712.796 887.192 708.417 z"/>
          <Path fill="rgb(255,255,255)" d="M 884.949 777.173 C 892.606 776.031 900.093 776.545 906.854 780.645 C 924.039 791.066 941.042 801.787 958.077 812.452 L 1057.74 874.806 L 1154.54 935.27 C 1172.35 946.39 1190.31 957.392 1207.85 968.906 C 1221.24 976.557 1224.93 1001.39 1212.63 1011.48 C 1199.86 1021.96 1181.83 1032.37 1167.68 1041.4 L 1084.42 1094.98 L 965.151 1171.89 C 945.343 1184.69 925.182 1198.12 905.019 1210.35 C 899.042 1213.98 890.912 1215.02 884.14 1212.69 C 876.797 1210.14 870.862 1204.63 867.781 1197.49 C 864.588 1190.19 865.854 1130.04 865.856 1119.01 L 865.836 987.103 L 865.792 865.667 C 865.786 844.146 865.642 822.417 866.005 800.898 C 866.062 797.567 866.475 795.35 867.824 792.364 C 871.7 783.778 876.761 780.634 884.949 777.173 z"/>
        </Svg>
      </TouchableOpacity>

      {/* Tab 3 - Send (share.svg — outline paper plane, black border + white fill cutout) */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.tabBtn}
        onPress={() => dispatch({ type: "SET_SCREEN", value: "professionalDashboard" })}
      >
        <View style={styles.iconBadgeWrapper}>
          <Svg
            viewBox="720 375 620 570"
            width={SHARE_SIZE}
            height={SHARE_SIZE}
          >
            {/*
              share.svg renders its outline look by layering:
              1. Black outer shape (the paper plane silhouette)
              2. White inner shape (the cutout that creates the outline effect)
            */}
            <Path
              fill={C.black}
              d="M 824.529 385.392 C 851.786 384.268 883.952 385.073 911.474 385.071 L 1073.26 385.082 L 1174.66 385.023 C 1208.75 384.982 1243.24 381.162 1273.89 398.902 C 1297.32 412.371 1314.42 434.61 1321.42 460.709 C 1333.27 506.028 1315.07 532.668 1293.24 569.341 L 1260.18 624.914 L 1131.81 840.478 C 1108.43 880.672 1091 924.619 1040.75 935.733 C 1016.49 941.224 991.032 936.789 970.053 923.414 C 936.839 902.161 932.441 874.274 922.912 839.44 L 906.342 778.342 C 897.99 747.179 886.703 710.374 880 679.484 L 796.694 597.831 C 782.527 583.949 755.357 558.961 745.282 543.818 C 735.739 529.561 729.879 513.162 728.225 496.086 C 725.982 469.051 734.618 442.237 752.219 421.594 C 771.046 399.218 795.859 388.005 824.529 385.392 z"
            />
            {/* White cutout — creates the hollow/outline look */}
            <Path
              fill={C.white}
              d="M 828.944 437.446 L 1090.13 437.409 L 1177.75 437.355 C 1194.97 437.349 1212.52 437.096 1229.72 437.973 C 1237.12 438.35 1240.44 439.693 1246.9 442.878 C 1259.33 449.003 1268.53 459.671 1272.14 473.236 C 1276.84 490.871 1274.03 501.289 1265.19 516.476 C 1251.25 540.415 1237.02 564.094 1222.94 587.875 L 1127.44 748.578 L 1078.39 831.62 C 1071.15 843.887 1063.65 858.037 1055.57 869.615 C 1043.67 886.655 1016.93 891.014 999.509 880.961 C 992.969 877.194 987.595 871.695 983.98 865.069 C 978.579 855.357 967.47 808.883 964.001 795.532 C 961.408 788.539 956.612 767.979 954.419 759.831 L 932.947 679.46 L 1080.08 591.728 L 1122.12 566.544 C 1134.27 559.238 1149.78 552.974 1154.21 539.021 C 1160.85 518.128 1138.3 498.701 1119.08 508.753 C 1097.69 519.938 1077.26 533.347 1056.49 545.679 L 907.665 634.442 C 872.586 603.901 839.764 565.879 805.123 534.37 C 800.052 529.756 790.395 520.087 787.024 514.342 C 766.264 478.964 787.545 440.104 828.944 437.446 z"
            />
          </Svg>
          {/* Red notification dot */}
          <View style={styles.redDotSend} />
        </View>
      </TouchableOpacity>

      {/* Tab 4 - Search */}
      <TouchableOpacity activeOpacity={0.7} style={styles.tabBtn}>
        <Svg
          viewBox="0 0 24 24"
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill="none"
        >
          <Circle
            cx="10.5"
            cy="10.5"
            r="6.5"
            stroke={C.black}
            strokeWidth="1.5"
          />
          <Path
            d="M15.3 15.3L20 20"
            stroke={C.black}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </Svg>
      </TouchableOpacity>

      {/* Tab 5 - Profile */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.tabBtn}
        onPress={() => dispatch({ type: "SET_SCREEN", value: "profile" })}
      >
        <View style={styles.iconBadgeWrapper}>
          <Image
            source={{ uri: "https://picsum.photos/seed/myavatar/200" }}
            style={[
              styles.profileAvatar,
              activeTab === "profile" && styles.activeProfileBorder,
            ]}
          />
          {/* Red dot at bottom-right of avatar */}
          {activeTab !== "profile" && <View style={styles.redDotProfile} />}
        </View>
      </TouchableOpacity>
      </View>
      <View style={[styles.bottomInset, { height: insets.bottom }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.white,
    zIndex: 100,
  },
  row: {
    height: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: C.border,
  },
  tabBtn: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomInset: {
    backgroundColor: C.white,
  },
  iconBadgeWrapper: {
    position: "relative",
  },
  redDotSend: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: C.notifRed,
    borderWidth: 1.5,
    borderColor: C.white,
  },
  profileAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  activeProfileBorder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#111111',
  },
  redDotProfile: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.notifRed,
    borderWidth: 1,
    borderColor: C.white,
  },
});
