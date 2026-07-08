import { useMemo } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, Mask, Path, Rect } from "react-native-svg";
import { ArrowLeft, ChevronRight, Clock3, GraduationCap, Lightbulb, BadgeCheck, Users, TrendingUp, SquarePlay } from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";
import { C } from "../constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const THUMB_GAP = 8;

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
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <Mask id="play-badge-cutout">
          <Rect x="0" y="0" width="24" height="24" fill="white" />
          <Path d="M10 8.5L16 12L10 15.5V8.5Z" fill="black" />
        </Mask>
      </Defs>
      <Rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill={C.white} mask="url(#play-badge-cutout)" />
    </Svg>
  );
}

function FirstThumbBadgeIcon({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="7.2"
        stroke={C.white}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="34 10"
        transform="rotate(-20 12 12)"
      />
    </Svg>
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
  const thumbSize = useMemo(() => {
    const horizontalPadding = 16 * 2;
    const rowGap = THUMB_GAP * 3;
    return Math.floor((SCREEN_WIDTH - horizontalPadding - rowGap) / 4);
  }, []);
  const thumbHeight = Math.round(thumbSize * 1.45);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconBtn}
            onPress={() => dispatch({ type: "SET_SCREEN", value: "profile" })}
          >
            <ArrowLeft size={29} color={C.black} strokeWidth={2.1} />
          </TouchableOpacity>

          <Text style={styles.title}>Professional dashboard</Text>

          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
            <GearIcon size={27} color={C.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <Text style={styles.sectionMeta}>30 days</Text>
        </View>

        <View style={styles.statsRow}>
          {INSIGHT_STATS.map((item) => (
            <View key={item.label} style={styles.statCol}>
              <Text style={styles.statLabel}>{item.label}</Text>
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
          {THUMBNAILS.map((item, index) => (
            <View key={item.id} style={[styles.thumbWrap, { width: thumbSize, height: thumbHeight }]}>
              <Image source={{ uri: item.uri }} style={[styles.thumbImage, { transform: [{ rotate: item.rotate }] }]} resizeMode="cover" />
              <View style={styles.playBadge}>
                {index === 0 ? <FirstThumbBadgeIcon size={20} /> : <PlayBadgeIcon size={19} />}
              </View>
            </View>
          ))}
        </View>

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
    fontWeight: "700",
    color: C.black,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.2,
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
  statLabel: {
    fontSize: 13,
    lineHeight: 16,
    color: "#6F6F6F",
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
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
