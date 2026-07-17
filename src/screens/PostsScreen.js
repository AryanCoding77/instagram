import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  MoreVertical,
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  Bookmark,
  VolumeX,
  Music2,
} from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";
import { PROFILE_POSTS } from "../constants/profilePosts";
import { C } from "../constants/colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ACTIONS = [
  { icon: Heart, value: "887" },
  { icon: MessageCircle, value: "10" },
  { icon: Repeat2, value: "197" },
  { icon: Send, value: "480" },
];

const fallbackUri = "https://picsum.photos/seed/profile-post/900/1200";
const MEDIA_HEIGHT = Math.max(520, SCREEN_HEIGHT - 240);
const VIEWS_EYE_ASSET = require("../../assets/icons/views-eye.png");

function PostCard({ item, onViewInsights }) {
  return (
    <View style={styles.postCard}>
      <View style={styles.mediaWrap}>
        <ImageBackground
          source={{ uri: item.thumbnailUri || fallbackUri }}
          style={styles.heroImage}
          imageStyle={styles.heroImageInner}
        >
          <View style={styles.heroOverlay} />

          <View style={styles.postTopRowOverlay}>
            <View style={styles.userRow}>
              <Image
                source={{ uri: "https://picsum.photos/seed/myavatar/200" }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.username}>kingvalor1</Text>
                <View style={styles.audioRow}>
                  <Music2 size={13} color="rgba(255,255,255,0.88)" strokeWidth={2.1} />
                  <Text style={styles.audioLabel}>kingvalor1 · Original audio</Text>
                </View>
              </View>
            </View>

            <MoreVertical size={20} color={C.white} strokeWidth={2.2} />
          </View>

          <View style={styles.centerPrompt}>
            <View style={styles.watchMorePill}>
              <Image
                source={require("../../assets/icons/reels-icon.png")}
                style={styles.watchMoreIcon}
                resizeMode="contain"
              />
              <Text style={styles.watchMoreText}>Watch more reels</Text>
            </View>
            <Text style={styles.watchAgainText}>Watch Again</Text>
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.muteBtn}>
            <VolumeX size={16} color={C.white} strokeWidth={2.2} />
          </TouchableOpacity>
        </ImageBackground>
      </View>

      <View style={styles.divider} />
      <View style={styles.insightsRow}>
        <TouchableOpacity activeOpacity={0.7} style={styles.viewInsightsBtn} onPress={onViewInsights}>
          <Image source={VIEWS_EYE_ASSET} style={styles.viewInsightsIcon} resizeMode="contain" />
          <Text style={styles.viewInsightsText}>{item.views || "36K"} · View Insights</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.boostBtn}>
          <Text style={styles.boostText}>Boost Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reactionRow}>
        <View style={styles.reactionGroup}>
        {ACTIONS.map((reaction) => {
          const Icon = reaction.icon;
          return (
            <View key={reaction.value} style={styles.reactionItem}>
              <Icon size={24} color={C.black} strokeWidth={2} />
              <Text style={styles.reactionValue}>{reaction.value}</Text>
            </View>
          );
        })}
        </View>
        <Bookmark size={26} color={C.black} strokeWidth={2} />
      </View>

      <View style={styles.captionBlock}>
        <Text style={styles.captionText}>
          <Text style={styles.captionUsername}>kingvalor1 </Text>
          {item.description}
        </Text>
        <Text style={styles.captionMore}>... more</Text>
        <Text style={styles.captionDate}>{item.date}</Text>
      </View>
    </View>
  );
}

export default function PostsScreen() {
  const { state, dispatch } = useReelData();
  const startIndex = Math.max(0, state.selectedPostIndex || 0);
  const posts = PROFILE_POSTS.slice(startIndex);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => dispatch({ type: "SET_SCREEN", value: "profile" })}
        >
          <ArrowLeft size={28} color={C.black} strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Posts</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            item={item}
            onViewInsights={() => dispatch({ type: "SET_SCREEN", value: "insights" })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.white,
  },
  header: {
    height: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E7E7E7",
    backgroundColor: C.white,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: C.black,
  },
  listContent: {
    backgroundColor: C.white,
  },
  postCard: {
    backgroundColor: C.white,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E7E7E7",
  },
  mediaWrap: {
    height: MEDIA_HEIGHT,
    backgroundColor: C.black,
  },
  heroImage: {
    flex: 1,
    justifyContent: "flex-start",
  },
  heroImageInner: {
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.14)",
  },
  postTopRowOverlay: {
    position: "absolute",
    top: 14,
    left: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#ddd",
  },
  username: {
    color: C.white,
    fontSize: 16,
    fontWeight: "700",
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  audioLabel: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
  },
  centerPrompt: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "52%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  watchMorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.white,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  watchMoreText: {
    color: C.black,
    fontSize: 17,
    fontWeight: "700",
  },
  watchMoreIcon: {
    width: 16,
    height: 16,
    tintColor: C.black,
  },
  watchAgainText: {
    marginTop: 12,
    color: C.white,
    fontSize: 15,
    fontWeight: "700",
  },
  muteBtn: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#D6D6D6",
    marginHorizontal: 0,
  },
  insightsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: C.white,
    minHeight: 56,
  },
  viewInsightsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
  },
  viewInsightsIcon: {
    width: 20,
    height: 20,
    tintColor: "#4A63F5",
  },
  viewInsightsText: {
    color: "#4A63F5",
    fontSize: 15,
    fontWeight: "600",
  },
  boostBtn: {
    backgroundColor: "#4A63F5",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  boostText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "700",
  },
  reactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: C.white,
  },
  reactionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reactionValue: {
    fontSize: 14,
    color: C.black,
  },
  captionBlock: {
    backgroundColor: C.white,
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 18,
  },
  captionText: {
    fontSize: 14,
    color: C.black,
    lineHeight: 18,
  },
  captionUsername: {
    fontWeight: "700",
    color: C.black,
  },
  captionMore: {
    marginTop: 2,
    color: "#6F6F6F",
    fontSize: 13,
    fontWeight: "400",
  },
  captionDate: {
    marginTop: 8,
    color: "#6F6F6F",
    fontSize: 13,
  },
});
