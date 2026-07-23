import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { Video, ResizeMode } from "expo-av";
import {
  MoreVertical,
  VolumeX,
  Music2,
} from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";
import { useProfileData } from "../context/ProfileDataContext";
import { PROFILE_POSTS } from "../constants/profilePosts";
import { formatCompactCountWhole } from "../constants/profileData";
import { C } from "../constants/colors";
import BackArrowIcon from "../components/icons/BackArrowIcon";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const fallbackUri = "https://picsum.photos/seed/profile-post/900/1200";
const MEDIA_HEIGHT = Math.max(574, SCREEN_HEIGHT - 186);
const VIEWS_EYE_ASSET = require("../../assets/icons/views-eye.png");
const REELS_BADGE_ASSET = require("../../assets/icons/reels-icon.png");

function formatCompactCount(value) {
  const n = Number(value) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${n}`;
}

function formatIntegerWithCommas(value) {
  const n = Math.max(0, Math.round(Number(value) || 0));
  return n.toLocaleString("en-US");
}

function PostCard({ item, onViewInsights, defaultUsername, defaultAvatarUri }) {
  const [videoFinished, setVideoFinished] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setVideoFinished(false);
  }, [item.id]);

  const username = item.user?.username || item.username || defaultUsername || "kingvalor1";
  const avatarUri =
    item.user?.avatarUri || item.avatarUri || defaultAvatarUri || "https://picsum.photos/seed/myavatar/200";
  const captionText = item.description || item.caption || "Reel preview";
  const captionDate = item.date || item.timestamp || "";
  const viewLabel = formatCompactCountWhole(item.views ?? item.viewCount ?? 0);
  const hasVideo = Boolean(item.videoUrl);
  const reactions = [
    { icon: require("../../assets/icons/like.png"), value: formatIntegerWithCommas(item.likesCount ?? item.likes ?? 0) },
    { icon: require("../../assets/icons/comment.png"), value: formatIntegerWithCommas(item.commentsCount ?? item.comments ?? 0) },
    { icon: require("../../assets/icons/repost.png"), value: formatIntegerWithCommas(item.repostsCount ?? item.reposts ?? 0) },
    { icon: require("../../assets/icons/share.png"), value: formatIntegerWithCommas(item.sharesCount ?? item.shares ?? 0) },
    { icon: require("../../assets/icons/saved.png"), value: formatIntegerWithCommas(item.savesCount ?? item.saves ?? 0) },
  ];

  const handleReplay = async () => {
    if (!videoRef.current || !hasVideo) return;
    setVideoFinished(false);
    try {
      await videoRef.current.replayAsync();
    } catch {
      await videoRef.current.setPositionAsync(0);
      await videoRef.current.playAsync();
    }
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.mediaWrap}>
        {hasVideo ? (
          <View style={styles.heroImage}>
            <Video
              ref={videoRef}
              source={{ uri: item.videoUrl }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              isLooping={false}
              shouldPlay
              isMuted
              useNativeControls={false}
              posterSource={{ uri: item.thumbnailUri || fallbackUri }}
              usePoster
              onPlaybackStatusUpdate={(status) => {
                if (!status?.isLoaded) return;
                setVideoFinished(Boolean(status.didJustFinish));
              }}
            />
            <View style={styles.heroOverlay} />
          </View>
        ) : (
          <ImageBackground
            source={{ uri: item.thumbnailUri || fallbackUri }}
            style={styles.heroImage}
            imageStyle={styles.heroImageInner}
          >
            <View style={styles.heroOverlay} />
          </ImageBackground>
        )}

        <View style={styles.postTopRowOverlay}>
          <View style={styles.userRow}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View>
              <Text style={styles.username}>{username}</Text>
              <View style={styles.audioRow}>
                <Music2 size={11} color="rgba(255,255,255,0.88)" strokeWidth={2.1} />
                <Text style={styles.audioLabel}>{username} · Original audio</Text>
              </View>
            </View>
          </View>

          <MoreVertical size={18} color={C.white} strokeWidth={2.2} />
        </View>

        {hasVideo && videoFinished ? (
          <TouchableOpacity activeOpacity={0.9} style={styles.centerPrompt} onPress={handleReplay}>
            <View style={styles.watchMorePill}>
              <Image source={REELS_BADGE_ASSET} style={styles.watchMoreIcon} resizeMode="contain" />
              <Text style={styles.watchMoreText}>Watch more reels</Text>
            </View>
            <Text style={styles.watchAgainText}>Watch Again</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity activeOpacity={0.8} style={styles.muteBtn}>
          <VolumeX size={14} color={C.white} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
      <View style={styles.insightsRow}>
        <TouchableOpacity activeOpacity={0.7} style={styles.viewInsightsBtn} onPress={onViewInsights}>
          <Image source={VIEWS_EYE_ASSET} style={styles.viewInsightsIcon} resizeMode="contain" />
          <Text style={styles.viewInsightsText}>{viewLabel} · View Insights</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.boostBtn}>
          <Text style={styles.boostText}>Boost Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.insightsDivider} />

      <View style={styles.reactionRow}>
        <View style={styles.reactionGroup}>
          {reactions.map((reaction, index) => (
            <View key={`${index}-${reaction.value}`} style={styles.reactionItem}>
              <Image source={reaction.icon} style={styles.reactionIcon} resizeMode="contain" />
              <Text style={styles.reactionValue}>{reaction.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.captionBlock}>
        <Text style={styles.captionText}>
          <Text style={styles.captionUsername}>{username} </Text>
          {captionText}
        </Text>
        <Text style={styles.captionMore}>... more</Text>
        <Text style={styles.captionDate}>{captionDate}</Text>
      </View>
    </View>
  );
}

export default function PostsScreen() {
  const { state, dispatch } = useReelData();
  const { state: profileState } = useProfileData();
  const profile = profileState.profile;
  const profileReels = profileState.profile?.reels || [];
  const startIndex = Math.max(0, state.selectedPostIndex || 0);
  const selectedPostData = state.selectedPostData;

  const posts = useMemo(() => {
    const source = profileReels.length ? profileReels : PROFILE_POSTS;
    return source.slice(startIndex).map((item) => {
      if (!selectedPostData) {
        return item;
      }

      const selectedId = selectedPostData.id || selectedPostData.shortCode;
      const matches =
        item.id === selectedId ||
        item.shortCode === selectedPostData.shortCode ||
        item.thumbnailUri === selectedPostData.thumbnailUri;

      if (!matches) {
        return item;
      }

      return {
        ...item,
        ...selectedPostData,
        thumbnailUri: selectedPostData.thumbnailUri || item.thumbnailUri,
        videoUrl: selectedPostData.videoUrl ?? item.videoUrl ?? null,
        viewCount: selectedPostData.viewCount ?? selectedPostData.views ?? item.viewCount,
        likesCount: selectedPostData.likesCount ?? selectedPostData.likes ?? item.likesCount,
        commentsCount: selectedPostData.commentsCount ?? selectedPostData.comments ?? item.commentsCount,
        caption: selectedPostData.caption || item.caption,
        timestamp: selectedPostData.timestamp || item.timestamp,
        username: selectedPostData.username || item.username,
        displayName: selectedPostData.displayName || item.displayName,
      };
    });
  }, [profileReels, startIndex, selectedPostData]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => dispatch({ type: "GO_BACK" })}
        >
          <BackArrowIcon size={28} color={C.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Posts</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PostCard
            item={item}
            defaultUsername={profile.username}
            defaultAvatarUri={profile.profilePicUri}
            onViewInsights={() => {
              const selectedThumb = item.thumbnailUri || item.videoUrl || null;
              dispatch({
                type: "SET_SELECTED_POST_DATA",
                data: {
                  id: item.id,
                  username: item.user?.username || item.username || profile.username,
                  displayName: item.user?.displayName || item.displayName || profile.displayName,
                  avatarUri: item.user?.avatarUri || item.avatarUri || profile.profilePicUri,
                  thumbnailUri: selectedThumb,
                  videoUrl: item.videoUrl || null,
                  views: item.viewCount || 0,
                  likes: item.likesCount || 0,
                  comments: item.commentsCount || 0,
                  caption: item.caption || item.description || "",
                  timestamp: item.timestamp || item.date || "",
                  videoDuration: item.videoDuration || null,
                  ownerUsername: item.username || item.user?.username || "",
                  ownerFullName: item.displayName || item.user?.displayName || "",
                },
              });
              dispatch({ type: "SET_SELECTED_POST_URI", uri: selectedThumb });
              dispatch({ type: "SET_THUMBNAIL", uri: selectedThumb });
              dispatch({
                type: "APPLY_HISTORICAL_BASELINE",
                selectedPost: {
                  ...item,
                  views: item.viewCount || 0,
                  likes: item.likesCount || 0,
                  comments: item.commentsCount || 0,
                },
                sourceReels: posts,
              });
              dispatch({ type: "SET_SCREEN", value: "insights" });
            }}
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
    fontSize: 18,
    fontWeight: "600",
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
    position: "relative",
  },
  heroImage: {
    flex: 1,
    justifyContent: "flex-start",
  },
  heroImageInner: {
    resizeMode: "cover",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
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
    fontSize: 13,
    fontWeight: "600",
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
    gap: 8,
    backgroundColor: C.white,
    borderRadius: 999,
    paddingHorizontal: 19,
    paddingVertical: 13,
  },
  watchMoreText: {
    color: C.black,
    fontSize: 13,
    fontWeight: "600",
  },
  watchMoreIcon: {
    width: 11,
    height: 11,
    tintColor: C.black,
  },
  watchAgainText: {
    marginTop: 10,
    color: C.white,
    fontSize: 13,
    fontWeight: "600",
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
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: C.white,
    minHeight: 48,
  },
  viewInsightsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  viewInsightsIcon: {
    width: 16,
    height: 16,
    tintColor: "#4A63F5",
  },
  viewInsightsText: {
    color: "#4A63F5",
    fontSize: 13,
    fontWeight: "500",
  },
  boostBtn: {
    backgroundColor: "#4A63F5",
    borderRadius: 9,
    paddingHorizontal: 17,
    paddingVertical: 8,
  },
  boostText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "600",
  },
  insightsDivider: {
    height: 1,
    backgroundColor: "#E3E3E3",
    width: "92%",
    alignSelf: "center",
  },
  reactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 10,
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
  reactionIcon: {
    width: 20,
    height: 20,
    tintColor: C.black,
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
