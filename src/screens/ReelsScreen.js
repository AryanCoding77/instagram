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
  MoreVertical,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react-native";
import BottomTabBar from "../components/BottomTabBar";
import LikeIcon from "../components/icons/LikeIcon";
import CommentIcon from "../components/icons/CommentIcon";
import RepostIcon from "../components/RepostIcon";
import ShareIcon from "../components/icons/ShareIcon";
import SaveIcon from "../components/icons/SaveIcon";
import { FEED_POSTS } from "../constants/mockData";
import { C } from "../constants/colors";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const BOTTOM_NAV_HEIGHT = 52;

const REEL_ITEMS = FEED_POSTS.filter((post) => post.type === "reel");

const ACTIONS = [
  { value: "69.8K", icon: LikeIcon },
  { value: "172", icon: CommentIcon },
  { value: "4,039", icon: RepostIcon },
  { value: "28K", icon: ShareIcon },
  { value: "3,510", icon: SaveIcon },
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
          {ACTIONS.map((action, index) => {
            const Icon = action.icon;
            return (
              <View key={action.value} style={styles.actionItem}>
                <Icon size={26} color={C.white} />
                <Text style={styles.actionValue}>{action.value}</Text>
              </View>
            );
          })}
          <View style={[styles.actionItem, styles.moreActionItem]}>
            <MoreVertical size={20} color={C.white} strokeWidth={1.75} />
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
    paddingLeft: 10,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 8,
    zIndex: 2,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
    marginLeft: 10,
  },
  topTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginLeft: 10,
    marginRight: 2,
  },
  plusBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -1,
  },
  topTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  topFriendsWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 10,
    marginRight: 14,
  },
  topFriends: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 17,
    fontWeight: "600",
  },
  friendAvatars: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 2,
  },
  friendAvatar: {
    width: 19,
    height: 19,
    borderRadius: 9.5,
    borderWidth: 1.25,
    borderColor: C.black,
  },
  friendAvatarOverlap: {
    width: 19,
    height: 19,
    borderRadius: 9.5,
    borderWidth: 1.25,
    borderColor: C.black,
    marginLeft: -5,
  },
  filterBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsRail: {
    position: "absolute",
    right: 8,
    alignItems: "center",
    gap: 12,
    zIndex: 3,
    transform: [{ translateY: 86 }],
  },
  actionItem: {
    alignItems: "center",
    gap: 4,
    minWidth: 44,
  },
  moreActionItem: {
    transform: [{ translateY: 15 }],
  },
  thumbActionItem: {
    marginTop: 10,
  },
  actionValue: {
    color: C.white,
    fontSize: 10,
    fontWeight: "600",
  },
  actionIcon: {
    width: 25,
    height: 25,
    tintColor: C.white,
  },
  bottomMeta: {
    paddingHorizontal: 18,
    paddingBottom: 22,
    zIndex: 2,
    backgroundColor: "transparent",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  username: {
    color: C.white,
    fontSize: 13,
    fontWeight: "600",
  },
  followBtn: {
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 5,
    marginLeft: 4,
    borderWidth: 0.5,
    borderColor: C.white,
  },
  followText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "500",
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
    fontSize: 12,
    lineHeight: 16,
  },
  captionThumb: {
    width: 23,
    height: 23,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: C.white,
    marginTop: 14,
    transform: [{ translateY: 8 }],
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
