import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Animated, Image } from "react-native";
import { ChevronDown, CornerUpLeft, Heart, MessageCircle, Repeat2, Send } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "../constants/colors";

const FILTERS = ["Latest", "Views", "Accounts reached", "Follows", "Likes", "Comments", "Reposts", "Shares", "Saves"];

const REELS_ICON_ASSET = require("../../assets/icons/reels-icon.png");
const STORY_ICON_ASSET = require("../../assets/icons/story-icon.png");

const CONTENT_ITEMS = [
  {
    badge: "story",
    time: "21h",
    views: "400",
    stats: [
      { icon: Heart, value: "40" },
      { icon: MessageCircle, value: "0" },
      { icon: Repeat2, value: "0" },
    ],
    colors: ["#262626", "#6E7E8C", "#BCC7D3"],
    accent: "clock",
  },
  {
    badge: "story",
    time: "22h",
    views: "491",
    stats: [
      { icon: Heart, value: "48" },
      { icon: MessageCircle, value: "0" },
      { icon: Repeat2, value: "1" },
    ],
    colors: ["#6F91B7", "#2B394E", "#D7C2A2"],
    accent: "clock",
  },
  {
    badge: "story",
    time: "1d",
    views: "604",
    stats: [
      { icon: Heart, value: "59" },
      { icon: MessageCircle, value: "0" },
      { icon: Repeat2, value: "0" },
    ],
    colors: ["#4A5366", "#D39A2C", "#C66A22"],
    accent: "clock",
  },
  {
    badge: "reels",
    time: "1d",
    title: "I Guess it could\u{1F642}...",
    views: "5.1K",
    stats: [
      { icon: Heart, value: "222" },
      { icon: MessageCircle, value: "2" },
      { icon: Repeat2, value: "5" },
      { icon: Send, value: "11" },
    ],
    colors: ["#C88A21", "#8D4A1E", "#191919"],
    accent: "play",
  },
  {
    badge: "story",
    time: "2d",
    views: "554",
    stats: [
      { icon: Heart, value: "45" },
      { icon: MessageCircle, value: "0" },
      { icon: Repeat2, value: "1" },
    ],
    colors: ["#0F2C55", "#A7C1E6", "#233A63"],
    accent: "clock",
  },
  {
    badge: "story",
    time: "4d",
    views: "621",
    stats: [
      { icon: Heart, value: "68" },
      { icon: MessageCircle, value: "1" },
      { icon: Repeat2, value: "5" },
    ],
    colors: ["#3B8CBE", "#DCE5EE", "#1A4A78"],
    accent: "clock",
  },
  {
    badge: "story",
    time: "6d",
    views: "566",
    stats: [
      { icon: Heart, value: "63" },
      { icon: MessageCircle, value: "0" },
      { icon: Repeat2, value: "2" },
    ],
    colors: ["#D66A54", "#F5B87E", "#C53E2C"],
    accent: "clock",
  },
  {
    badge: "story",
    time: "1w",
    views: "544",
    stats: [
      { icon: Heart, value: "39" },
      { icon: MessageCircle, value: "1" },
      { icon: Repeat2, value: "2" },
    ],
    colors: ["#D6A04B", "#F2E6C9", "#5F3B19"],
    accent: "clock",
  },
];

function SkeletonLine({ width, height, style }) {
  const pulse = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.8],
  });

  return <Animated.View style={[{ width, height, opacity }, styles.skeleton, style]} />;
}

function ContentThumbnail({ colors, badge }) {
  const assetSource = badge === "story" ? STORY_ICON_ASSET : REELS_ICON_ASSET;

  return (
    <View style={styles.thumbShell}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.thumbBg}>
        <View style={styles.thumbOverlay} />
        <View style={styles.badgeWrap} pointerEvents="none">
          <Image source={assetSource} style={styles.badgeIcon} resizeMode="contain" />
        </View>
      </LinearGradient>
    </View>
  );
}

function ContentRow({ item }) {
  const statIcons =
    item.badge === "story"
      ? [Heart, Send, CornerUpLeft]
      : [Heart, MessageCircle, Repeat2, Send];

  return (
    <View style={styles.row}>
      <ContentThumbnail colors={item.colors} badge={item.badge} />

      <View style={styles.middle}>
        <View style={[styles.topLine, item.title && styles.topLineWithTitle]}>
          {item.title ? (
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
          ) : null}
          <Text style={[styles.time, item.title && styles.timeWithTitle]}>{item.time}</Text>
        </View>

        <View style={styles.statsRow}>
          {item.stats.map((stat, index) => {
            const Icon = statIcons[index] || statIcons[statIcons.length - 1];
            return (
              <View key={`${stat.value}-${index}`} style={styles.statItem}>
                <Icon size={12} color="#A0A0A0" strokeWidth={2} />
                <Text style={styles.statText}>{stat.value}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.viewsCol}>
        <Text style={styles.viewsValue}>{item.views}</Text>
        <Text style={styles.viewsLabel}>Views</Text>
      </View>
    </View>
  );
}

export default function InsightsContentTab() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.allContentBtn}>
          <Text style={styles.allContentText}>All content</Text>
          <ChevronDown size={18} color={C.black} strokeWidth={2} />
        </View>

        <View style={styles.dateBtn}>
          <Text style={styles.dateText}>30 days</Text>
          <ChevronDown size={18} color="#707070" strokeWidth={2} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((filter, index) => {
          const active = index === 0;
          return (
            <View key={filter} style={[styles.filterChip, active && styles.filterChipActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter}</Text>
            </View>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={styles.skeletonList}>
          {Array.from({ length: 8 }).map((_, index) => (
            <View key={index} style={styles.skeletonRow}>
              <SkeletonLine width={40} height={40} style={styles.skeletonThumb} />
              <View style={styles.skeletonMid}>
                <SkeletonLine width={150} height={10} style={styles.skeletonText} />
                <SkeletonLine width={88} height={10} style={styles.skeletonText} />
                <SkeletonLine width={82} height={10} style={styles.skeletonText} />
              </View>
              <View style={styles.skeletonRight}>
                <SkeletonLine width={42} height={16} style={styles.skeletonText} />
                <SkeletonLine width={34} height={10} style={styles.skeletonText} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.list}>
          {CONTENT_ITEMS.map((item) => (
            <ContentRow key={`${item.time}-${item.views}-${item.title || "no-title"}`} item={item} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 18,
  },
  allContentBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  allContentText: {
    fontSize: 17,
    color: C.black,
    fontFamily: "Inter_500Medium",
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 17,
    color: "#707070",
    fontFamily: "Inter_400Regular",
  },
  filterRow: {
    gap: 10,
    paddingLeft: 8,
    paddingRight: 16,
    paddingBottom: 18,
  },
  filterChip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    justifyContent: "center",
    backgroundColor: C.white,
  },
  filterChipActive: {
    backgroundColor: "#F3F4F6",
    borderColor: "#F3F4F6",
  },
  filterText: {
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  filterTextActive: {
    fontFamily: "Inter_500Medium",
  },
  list: {
    paddingTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  thumbShell: {
    width: 42,
    height: 56,
    borderRadius: 7,
    overflow: "hidden",
    marginRight: 12,
  },
  thumbBg: {
    flex: 1,
    justifyContent: "space-between",
    padding: 4,
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  badgeWrap: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 3,
    elevation: 3,
  },
  badgeIcon: {
    width: 14,
    height: 14,
  },
  middle: {
    flex: 1,
    minHeight: 38,
    justifyContent: "center",
  },
  topLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
    gap: 10,
  },
  topLineWithTitle: {
    justifyContent: "flex-start",
    gap: 6,
  },
  title: {
    flexShrink: 1,
    fontSize: 14,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  time: {
    fontSize: 14,
    color: "#777777",
    fontFamily: "Inter_400Regular",
  },
  timeWithTitle: {
    minWidth: 0,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statText: {
    fontSize: 12,
    color: "#878787",
    fontFamily: "Inter_400Regular",
  },
  viewsCol: {
    width: 54,
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 8,
  },
  viewsValue: {
    fontSize: 17,
    color: C.black,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  viewsLabel: {
    fontSize: 13,
    color: "#888888",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  skeletonList: {
    paddingTop: 2,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  skeleton: {
    backgroundColor: "#F2F2F2",
    borderRadius: 6,
  },
  skeletonThumb: {
    borderRadius: 4,
  },
  skeletonMid: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
    paddingVertical: 3,
  },
  skeletonRight: {
    width: 54,
    alignItems: "flex-end",
    gap: 8,
  },
  skeletonText: {
    borderRadius: 6,
  },
});
