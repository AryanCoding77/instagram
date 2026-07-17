import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Plus,
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  Bookmark,
  MoreVertical,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react-native";
import BottomTabBar from "../components/BottomTabBar";
import { FEED_POSTS } from "../constants/mockData";
import { C } from "../constants/colors";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const BOTTOM_NAV_HEIGHT = 52;

const REEL_ITEMS = FEED_POSTS.filter((post) => post.type === "reel");

const ACTIONS = [
  { icon: Heart, value: "69.8K" },
  { icon: MessageCircle, value: "172" },
  { icon: Repeat2, value: "4,039" },
  { icon: Send, value: "28K" },
  { icon: Bookmark, value: "3,510" },
];

function ReelsCard({ item, cardHeight }) {
  return (
    <View style={[styles.card, { height: cardHeight }]}>
      <ImageBackground
        source={{ uri: item.mediaUri }}
        style={styles.media}
        imageStyle={styles.mediaImage}
      >
        <View style={styles.overlay} />
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            <TouchableOpacity activeOpacity={0.8} style={styles.plusBtn}>
              <Plus size={28} color={C.white} strokeWidth={1.6} />
            </TouchableOpacity>
            <View style={styles.topTitleWrap}>
              <Text style={styles.topTitle}>Reels</Text>
              <ChevronDown size={16} color={C.white} strokeWidth={2.2} />
            </View>
            <View style={styles.topFriendsWrap}>
              <Text style={styles.topFriends}>Friends</Text>
              <View style={styles.friendAvatars}>
                <Image
                  source={{ uri: "https://picsum.photos/seed/friend1/100" }}
                  style={styles.friendAvatar}
                />
                <Image
                  source={{ uri: "https://picsum.photos/seed/friend2/100" }}
                  style={styles.friendAvatarOverlap}
                />
                <Image
                  source={{ uri: "https://picsum.photos/seed/friend3/100" }}
                  style={styles.friendAvatarOverlap}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.filterBtn}>
            <SlidersHorizontal size={24} color={C.white} strokeWidth={2.1} />
          </TouchableOpacity>
        </View>

        <View style={[styles.actionsRail, { top: cardHeight * 0.33 }]}>
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <View key={action.value} style={styles.actionItem}>
                <Icon size={34} color={C.white} strokeWidth={1.95} />
                <Text style={styles.actionValue}>{action.value}</Text>
              </View>
            );
          })}
          <View style={[styles.actionItem, styles.moreActionItem]}>
            <MoreVertical size={24} color={C.white} strokeWidth={2} />
          </View>
          <View style={styles.thumbActionItem}>
            <Image
              source={{ uri: item.user.avatarUri }}
              style={styles.captionThumb}
            />
          </View>
        </View>

        <View style={styles.bottomMeta}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: item.user.avatarUri }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{item.user.username}</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.captionRow}>
            <Text style={styles.caption} numberOfLines={2}>
              {item.textOverlay || "Reel preview"}
            </Text>
          </View>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={styles.progressBarFill} />
        </View>

      </ImageBackground>
    </View>
  );
}

export default function ReelsScreen() {
  const insets = useSafeAreaInsets();
  const bottomOffset = BOTTOM_NAV_HEIGHT + insets.bottom + 28;
  const cardHeight = SCREEN_HEIGHT - bottomOffset;

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <FlatList
        data={REEL_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReelsCard item={item} cardHeight={cardHeight} />}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        snapToInterval={cardHeight}
        decelerationRate="fast"
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomOffset },
        ]}
        getItemLayout={(_, index) => ({
          length: cardHeight,
          offset: cardHeight * index,
          index,
        })}
      />
      <BottomTabBar activeTab="reels" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.black,
  },
  listContent: {
    paddingBottom: 0,
  },
  card: {
    width: SCREEN_WIDTH,
    backgroundColor: C.black,
  },
  media: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: C.black,
  },
  mediaImage: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 10,
    zIndex: 2,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    flexShrink: 1,
  },
  topTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  plusBtn: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -4,
  },
  topTitle: {
    color: C.white,
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  topFriendsWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 4,
  },
  topFriends: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 22,
    fontWeight: "600",
  },
  friendAvatars: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.black,
  },
  friendAvatarOverlap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.black,
    marginLeft: -7,
  },
  filterBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsRail: {
    position: "absolute",
    right: 10,
    alignItems: "center",
    gap: 16,
    zIndex: 3,
    transform: [{ translateY: 28 }],
  },
  actionItem: {
    alignItems: "center",
    gap: 7,
    minWidth: 56,
  },
  moreActionItem: {
    transform: [{ translateY: 6 }],
  },
  thumbActionItem: {
    marginTop: 18,
  },
  actionValue: {
    color: C.white,
    fontSize: 13,
    fontWeight: "600",
  },
  bottomMeta: {
    paddingHorizontal: 18,
    paddingBottom: 22,
    zIndex: 2,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  username: {
    color: C.white,
    fontSize: 18,
    fontWeight: "600",
  },
  followBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginLeft: 4,
  },
  followText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "600",
  },
  captionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  caption: {
    flex: 1,
    color: C.white,
    fontSize: 13,
    lineHeight: 17,
  },
  captionThumb: {
    width: 31,
    height: 31,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: C.white,
    transform: [{ translateY: 0 }],
  },
  progressBarTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 4,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.18)",
    zIndex: 4,
  },
  progressBarFill: {
    width: "14%",
    height: "100%",
    backgroundColor: C.white,
  },
});
