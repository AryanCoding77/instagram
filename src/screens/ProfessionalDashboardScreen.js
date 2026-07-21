import { useMemo } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, Mask, Path, Rect } from "react-native-svg";
import { ChevronRight, Clock3, GraduationCap, Lightbulb, BadgeCheck, Users, TrendingUp, SquarePlay } from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";
import { useProfileData } from "../context/ProfileDataContext";
import { formatCount } from "../constants/profileData";
import { C } from "../constants/colors";
import ProfileEditorSheet from "../components/ProfileEditorSheet";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const THUMB_GAP = 8;

function BackArrowIcon({ size = 28, color = C.black }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <Path
        d="M27 15H7.8M7.8 15L14.6 9.1M7.8 15L14.6 20.9"
        stroke={color}
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const INSIGHT_STATS = [
  { label: "Views", value: "643.7K" },
  { label: "Accounts\nreached", value: "359.4K" },
  { label: "Net followers", value: "+386" },
];

const THUMBNAILS = [
  { id: "1", uri: "https://picsum.photos/seed/dashboard-road/300/300", rotate: "-1deg" },
  { id: "2", uri: "https://picsum.photos/seed/dashboard-city/300/300", rotate: "0deg" },
  { id: "3", uri: "https://picsum.photos/seed/dashboard-car1/300/300", rotate: "0deg" },
  { id: "4", uri: "https://picsum.photos/seed/dashboard-car2/300/300", rotate: "1deg", isVideo: true },
];

function GearIcon({ size = 24, color = "currentColor" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="8.635"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlayBadgeIcon({ size = 18 }) {
  const assetSource = require("../../assets/icons/reels-icon.png");

  return (
    <Image source={assetSource} style={{ width: size, height: size }} resizeMode="contain" />
  );
}

function FirstThumbBadgeIcon({ size = 20 }) {
  const assetSource = require("../../assets/icons/story-icon.png");

  return (
    <Image source={assetSource} style={{ width: size, height: size }} resizeMode="contain" />
  );
}

const TOOLS = [
  { id: "monthly", icon: Clock3, label: "Monthly recap" },
  { id: "best", icon: GraduationCap, label: "Best practices" },
  { id: "insp", icon: Lightbulb, label: "Inspiration" },
  { id: "brand", icon: BadgeCheck, label: "Branded content" },
  { id: "partnership", icon: Users, label: "Partnership ads" },
  { id: "ads", icon: TrendingUp, label: "Ad tools" },
  { id: "audience", icon: Users, label: "Audience connections" },
  { id: "trial", icon: SquarePlay, label: "Trial reels" },
];

export default function ProfessionalDashboardScreen() {
  const { dispatch } = useReelData();
  const { state: profileState, dispatch: profileDispatch } = useProfileData();
  const profile = profileState.profile;
  const thumbSize = useMemo(() => {
    const horizontalPadding = 16 * 2;
    const rowGap = THUMB_GAP * 3;
    return Math.floor((SCREEN_WIDTH - horizontalPadding - rowGap) / 4);
  }, []);
  const thumbHeight = Math.round(thumbSize * 1.45);
  const insightStats = useMemo(() => {
    return [
      { label: "Views", value: formatCount(profile.dashboardViews || 0) },
      { label: "Accounts\nreached", value: formatCount(profile.followersCount || 0) },
      { label: "Net followers", value: `+${Math.max((profile.followersCount || 0) - (profile.followingCount || 0), 0)}` },
    ];
  }, [profile.dashboardViews, profile.followersCount, profile.followingCount]);
  const thumbnails = useMemo(() => {
    const reels = Array.isArray(profile.reels) ? profile.reels : [];
    const mapped = reels.slice(0, 4).map((item, index) => ({
      id: item.id || `${index}`,
      uri: item.thumbnailUri || item.videoUrl || THUMBNAILS[index % THUMBNAILS.length].uri,
      rotate: THUMBNAILS[index % THUMBNAILS.length].rotate,
      isVideo: Boolean(item.videoUrl),
      source: item,
    }));
    return mapped.length ? mapped : THUMBNAILS;
  }, [profile.reels]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconBtn}
            onPress={() => dispatch({ type: "SET_SCREEN", value: "profile" })}
          >
            <BackArrowIcon size={28} color={C.black} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.titleTouch}
            onPress={() => profileDispatch({ type: "SET_EDITING", value: true })}
          >
            <Text style={styles.title}>Professional dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
            <GearIcon size={27} color={C.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <Text style={styles.sectionMeta}>30 days</Text>
        </View>

        <View style={styles.statsRow}>
          {insightStats.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.statCol,
                index === 1 && styles.statColAccountsReached,
                index === 2 && styles.statColNetFollowers,
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  (index === 0 || index === 2) && styles.statLabelLower,
                ]}
              >
                {item.label}
              </Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
          ))}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.statChevron}
            onPress={() => dispatch({ type: "SET_SCREEN", value: "insightsDetail" })}
          >
            <ChevronRight size={22} color="#8E8E8E" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.thumbRow}>
          {thumbnails.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[styles.thumbWrap, { width: thumbSize, height: thumbHeight }]}
              onPress={() => {
                const selectedPost = item.source || null;
                if (selectedPost) {
                  dispatch({
                    type: "SET_SELECTED_POST_DATA",
                    data: {
                      id: selectedPost.id,
                      username: selectedPost.username || profile.username,
                      displayName: selectedPost.displayName || profile.displayName,
                      avatarUri: profile.profilePicUri,
                      thumbnailUri: selectedPost.thumbnailUri || selectedPost.videoUrl || item.uri,
                      videoUrl: selectedPost.videoUrl || null,
                      views: selectedPost.viewCount || 0,
                      likes: selectedPost.likesCount || 0,
                      comments: selectedPost.commentsCount || 0,
                      caption: selectedPost.caption || "",
                      timestamp: selectedPost.timestamp || "",
                      videoDuration: selectedPost.videoDuration || null,
                      ownerUsername: selectedPost.username || profile.username,
                      ownerFullName: selectedPost.displayName || profile.displayName,
                    },
                  });
                  dispatch({ type: "SET_SELECTED_POST_URI", uri: selectedPost.thumbnailUri || selectedPost.videoUrl || item.uri });
                  dispatch({ type: "SET_THUMBNAIL", uri: selectedPost.thumbnailUri || selectedPost.videoUrl || item.uri });
                  dispatch({ type: "UPDATE_FIELD", field: "thumbnailUri", value: selectedPost.thumbnailUri || selectedPost.videoUrl || item.uri });
                  dispatch({ type: "UPDATE_FIELD", field: "views", value: Number(selectedPost.viewCount) || 0 });
                  dispatch({ type: "UPDATE_FIELD", field: "likes", value: Number(selectedPost.likesCount) || 0 });
                  dispatch({ type: "UPDATE_FIELD", field: "comments", value: Number(selectedPost.commentsCount) || 0 });
                  if (selectedPost.videoDuration) {
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "videoDuration",
                      value: Math.round(Number(selectedPost.videoDuration)) || 0,
                    });
                  }
                }
                dispatch({ type: "SET_SCREEN", value: "insights" });
              }}
            >
              <Image source={{ uri: item.uri }} style={[styles.thumbImage, { transform: [{ rotate: item.rotate }] }]} resizeMode="cover" />
              <View style={styles.playBadge}>
                {index === 0 ? <FirstThumbBadgeIcon size={20} /> : <PlayBadgeIcon size={19} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.toolsDivider} />

        <View style={styles.toolsHeader}>
          <Text style={styles.sectionTitle}>Your tools</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toolsList}>
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <TouchableOpacity key={tool.id} activeOpacity={0.7} style={styles.toolRow}>
                <View style={styles.toolLeft}>
                  <Icon size={24} color={C.black} strokeWidth={1.8} />
                  <Text style={styles.toolText}>{tool.label}</Text>
                </View>
                <ChevronRight size={22} color="#8E8E8E" strokeWidth={2} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <ProfileEditorSheet />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.white,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 24,
    backgroundColor: C.white,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: C.black,
    fontFamily: "Inter_500Medium",
    letterSpacing: -0.2,
  },
  titleTouch: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "400",
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  sectionMeta: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6F6F6F",
    fontFamily: "Inter_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    position: "relative",
  },
  statCol: {
    flex: 1,
    paddingRight: 8,
  },
  statColAccountsReached: {
    marginLeft: -52,
  },
  statColNetFollowers: {
    marginLeft: -52,
  },
  statLabel: {
    fontSize: 13,
    lineHeight: 16,
    color: "#6F6F6F",
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
    minHeight: 32,
  },
  statLabelLower: {
    paddingTop: 18,
  },
  statValue: {
    fontSize: 16,
    lineHeight: 19,
    color: C.black,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  statChevron: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  thumbRow: {
    flexDirection: "row",
    gap: THUMB_GAP,
    marginBottom: 18,
    alignItems: "flex-start",
  },
  thumbWrap: {
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#D9D9D9",
    position: "relative",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  playBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 5.5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  toolsDivider: {
    height: 1,
    backgroundColor: "#E9E9E9",
    marginBottom: 14,
  },
  toolsHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  seeAll: {
    fontSize: 14,
    color: C.badgeBlue,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  toolsList: {
    marginTop: 2,
  },
  toolRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toolLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  toolText: {
    fontSize: 16,
    color: C.black,
    fontFamily: "Inter_400Regular",
    fontWeight: "400",
  },
});
