import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { C } from "../constants/colors";
import { useReelData } from "../context/ReelDataContext";
import { useProfileData } from "../context/ProfileDataContext";

const BAR_HEIGHT = 52;
const ICON_SIZE = 28.5;
const SHARE_SIZE = 20.5;

export default function BottomTabBar({ activeTab = "home" }) {
  const insets = useSafeAreaInsets();
  const totalHeight = BAR_HEIGHT + insets.bottom;
  const { dispatch } = useReelData();
  const { state: profileState } = useProfileData();
  const profilePicUri = profileState.profile?.profilePicUri;

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
        onPress={() => dispatch({ type: "SET_SCREEN", value: "reels" })}
      >
        {activeTab === "reels" ? (
          <Svg viewBox="0 0 24 24" width={26} height={26}>
            <Path
              d="M7 2.8h10.1c2.2 0 4 1.8 4 4V17.2c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4V6.8c0-2.2 1.8-4 4-4Z"
              fill="#111111"
            />
            <Path
              d="M10 8.9C10 8.6 10.3 8.4 10.6 8.6L15.1 11.5C15.4 11.7 15.4 12.3 15.1 12.5L10.6 15.4C10.3 15.6 10 15.4 10 15.1Z"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="0.9"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </Svg>
        ) : (
          <Svg viewBox="0 0 24 24" width={26} height={26}>
            <Path
              d="M7 2.8h10.1c2.2 0 4 1.8 4 4V17.2c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4V6.8c0-2.2 1.8-4 4-4Z"
              fill="none"
              stroke="#111111"
              strokeWidth="1.8"
            />
            <Path
              d="M10 8.9C10 8.6 10.3 8.4 10.6 8.6L15.1 11.5C15.4 11.7 15.4 12.3 15.1 12.5L10.6 15.4C10.3 15.6 10 15.4 10 15.1Z"
              fill="none"
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </Svg>
        )}
      </TouchableOpacity>

      {/* Tab 3 - Send (share.svg — outline paper plane, black border + white fill cutout) */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.tabBtn}
        onPress={() => dispatch({ type: "SET_SCREEN", value: "reels" })}
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
            source={{ uri: profilePicUri || "https://picsum.photos/seed/myavatar/200" }}
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
    width: 24.5,
    height: 24.5,
    borderRadius: 12.25,
  },
  activeProfileBorder: {
    width: 26.5,
    height: 26.5,
    borderRadius: 13.25,
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
