import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Animated, Image, ImageBackground } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "../constants/colors";
import { useProfileData } from "../context/ProfileDataContext";
import { useReelData } from "../context/ReelDataContext";
import { formatCompactCountWhole, formatCount } from "../constants/profileData";
import LikeIcon from "../components/icons/LikeIcon";
import CommentIcon from "../components/icons/CommentIcon";
import RepostIcon from "../components/RepostIcon";
import ShareIcon from "../components/icons/ShareIcon";
import ClipIcon from "../components/icons/ClipIcon";

const FILTERS = ["Latest", "Views", "Accounts reached", "Follows", "Likes", "Comments", "Reposts", "Shares", "Saves"];

const STORY_ICON_ASSET = require("../../assets/icons/story-icon.png");

const MOCK_CONTENT_ITEMS = [
  {
    badge: "story",
    time: "21h",
    views: "400",
    stats: [
      { icon: LikeIcon, value: "40" },
      { icon: ShareIcon, value: "0" },
      { icon: RepostIcon, value: "0" },
    ],
    colors: ["#262626", "#6E7E8C", "#BCC7D3"],
    accent: "clock",
  },
  {
    badge: "story",
    time: "22h",
    views: "491",
    stats: [
      { icon: LikeIcon, value: "48" },
      { icon: ShareIcon, value: "0" },
      { icon: RepostIcon, value: "1" },
    ],
    colors: ["#6F91B7", "#2B394E", "#D7C2A2"],
    accent: "clock",
  },
  {
    badge: "story",
    time: "1d",
    views: "604",
    stats: [
      { icon: LikeIcon, value: "59" },
      { icon: ShareIcon, value: "0" },
      { icon: RepostIcon, value: "0" },
    ],
    colors: ["#4A5366", "#D39A2C", "#C66A22"],
    accent: "clock",
  },
  {
    badge: "reels",
    time: "1d",
    title: "I Guess it could\u{1F642}...",
    views: "5.1k",
    stats: [
      { icon: LikeIcon, value: "222" },
      { icon: CommentIcon, value: "2" },
      { icon: RepostIcon, value: "5" },
      { icon: ShareIcon, value: "11" },
    ],
    colors: ["#C88A21", "#8D4A1E", "#191919"],
    accent: "play",
  },
  {
    badge: "story",
    time: "2d",
    views: "554",
    stats: [
      { icon: LikeIcon, value: "45" },
      { icon: ShareIcon, value: "0" },
      { icon: RepostIcon, value: "1" },
    ],
    colors: ["#0F2C55", "#A7C1E6", "#233A63"],
    accent: "clock",
  },
  {
    badge: "story",
    time: "4d",
    views: "621",
    stats: [
      { icon: LikeIcon, value: "68" },
      { icon: ShareIcon, value: "1" },
      { icon: RepostIcon, value: "5" },
    ],
    colors: ["#3B8CBE", "#DCE5EE", "#1A4A78"],
    accent: "clock",
  },
  {
    badge: "story",
    time: "6d",
    views: "566",
    stats: [
      { icon: LikeIcon, value: "63" },
      { icon: ShareIcon, value: "0" },
      { icon: RepostIcon, value: "2" },
    ],
    colors: ["#D66A54", "#F5B87E", "#C53E2C"],
    accent: "clock",
  },
  {
    badge: "story",
    time: "1w",
    views: "544",
    stats: [
      { icon: LikeIcon, value: "39" },
      { icon: ShareIcon, value: "1" },
      { icon: RepostIcon, value: "2" },
    ],
    colors: ["#D6A04B", "#F2E6C9", "#5F3B19"],
    accent: "clock",
  },
];

function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return "1d";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "1d";
  }

  const diffHours = Math.max(1, Math.round((Date.now() - date.getTime()) / 36e5));
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  return `${Math.max(1, Math.round(diffHours / 24))}d`;
}

function truncateCaption(text = "", maxLength = 28) {
  const cleaned = String(text).trim();
  if (!cleaned) {
    return "";
  }
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  return `${cleaned.slice(0, maxLength - 1)}...`;
}

function mergeSelectedPost(item, selectedPostData) {
  if (!selectedPostData) {
    return item;
  }

  const selectedId = selectedPostData.id || selectedPostData.shortCode || selectedPostData.thumbnailUri;
  const matches =
    item.id === selectedId ||
    item.id === selectedPostData.shortCode ||
    item.thumbnailUri === selectedPostData.thumbnailUri;

  if (!matches) {
    return item;
  }

  return {
    ...item,
    ...selectedPostData,
    thumbnailUri: selectedPostData.thumbnailUri || item.thumbnailUri,
    views: formatCompactCountWhole(selectedPostData.views ?? selectedPostData.viewCount ?? item.views),
    time: formatRelativeTime(selectedPostData.timestamp || item.timestamp),
    title: truncateCaption(selectedPostData.caption || selectedPostData.description || item.title || ""),
    stats: item.stats.map((stat, index) => {
      if (index === 0) {
        return { ...stat, value: formatCount(selectedPostData.likes ?? selectedPostData.likesCount ?? stat.value) };
      }
      if (index === 1) {
        return { ...stat, value: formatCount(selectedPostData.comments ?? selectedPostData.commentsCount ?? stat.value) };
      }
      if (index === 2) {
        return { ...stat, value: formatCount(selectedPostData.reposts ?? selectedPostData.repostsCount ?? stat.value) };
      }
      if (index === 3) {
        return { ...stat, value: formatCount(selectedPostData.shares ?? selectedPostData.sharesCount ?? stat.value) };
      }
      return stat;
    }),
  };
}

function buildContentItems(reels = [], selectedPostData = null) {
  return reels
    .map((item, index) => ({
      id: item.id || String(index),
      badge: item.videoUrl ? "reels" : "story",
      time: formatRelativeTime(item.timestamp),
      title: truncateCaption(item.caption || item.description || ""),
      views: formatCompactCountWhole(item.viewCount || 0),
      stats: [
        { icon: LikeIcon, value: formatCount(item.likesCount || 0) },
        { icon: CommentIcon, value: formatCount(item.commentsCount || 0) },
        { icon: RepostIcon, value: "0" },
        { icon: ShareIcon, value: "0" },
      ],
      thumbnailUri: item.thumbnailUri || item.videoUrl || "",
      colors: ["#262626", "#6E7E8C", "#BCC7D3"],
    }))
    .map((item) => mergeSelectedPost(item, selectedPostData))
    .filter((item) => item.thumbnailUri);
}

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

function ContentThumbnail({ colors, badge, thumbnailUri }) {
  if (thumbnailUri) {
    return (
      <View style={styles.thumbShell}>
        <ImageBackground source={{ uri: thumbnailUri }} style={styles.thumbBg} imageStyle={styles.thumbImage}>
          <View style={styles.thumbOverlay} />
          <View style={styles.badgeWrap} pointerEvents="none">
            {badge === "story" ? (
              <Image source={STORY_ICON_ASSET} style={styles.badgeIcon} resizeMode="contain" />
            ) : (
              <ClipIcon size={13} color="#FFFFFF" />
            )}
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.thumbShell}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.thumbBg}>
        <View style={styles.thumbOverlay} />
        <View style={styles.badgeWrap} pointerEvents="none">
          {badge === "story" ? <Image source={STORY_ICON_ASSET} style={styles.badgeIcon} resizeMode="contain" /> : <ClipIcon size={13} color="#FFFFFF" />}
        </View>
      </LinearGradient>
    </View>
  );
}

function ContentRow({ item }) {
  return (
    <View style={styles.row}>
      <ContentThumbnail colors={item.colors} badge={item.badge} thumbnailUri={item.thumbnailUri} />

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
            const Icon = stat.icon;
            return (
              <View key={`${stat.value}-${index}`} style={styles.statItem}>
                <Icon size={12} color="#111111" />
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
  const { state: profileState } = useProfileData();
  const { state: reelState } = useReelData();
  const contentItems = useMemo(() => {
    const reels = Array.isArray(profileState.profile?.reels) ? profileState.profile.reels : [];
    const mapped = buildContentItems(reels, reelState.selectedPostData);
    return mapped.length ? mapped : MOCK_CONTENT_ITEMS;
  }, [profileState.profile?.reels, reelState.selectedPostData]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
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
          {contentItems.map((item) => (
            <ContentRow key={`${item.id}-${item.time}-${item.views}-${item.title || "no-title"}`} item={item} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
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
    paddingTop: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  thumbShell: {
    width: 40,
    height: 54,
    borderRadius: 7,
    overflow: "hidden",
    marginRight: 12,
  },
  thumbBg: {
    flex: 1,
    justifyContent: "space-between",
    padding: 3,
  },
  thumbImage: {
    borderRadius: 7,
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
    width: 13,
    height: 13,
  },
  middle: {
    flex: 1,
    minHeight: 34,
    justifyContent: "center",
  },
  topLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
    gap: 8,
  },
  topLineWithTitle: {
    justifyContent: "flex-start",
    gap: 5,
  },
  title: {
    flexShrink: 1,
    fontSize: 13,
    color: "#202020",
    fontFamily: "Inter_400Regular",
  },
  time: {
    fontSize: 11,
    color: "#777777",
    fontFamily: "Inter_400Regular",
  },
  timeWithTitle: {
    minWidth: 0,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#626262",
    fontFamily: "Inter_400Regular",
  },
  viewsCol: {
    width: 50,
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 6,
  },
  viewsValue: {
    fontSize: 14,
    color: C.black,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 18,
  },
  viewsLabel: {
    fontSize: 10,
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
