import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg";
import {
  ArrowLeft,
  ArrowUpRightFromSquare,
  ChevronDown,
  ChevronRight,
  Check,
  Heart,
  Info,
  MessageCircle,
  Repeat2,
  Store,
  UserRound,
} from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";
import { C } from "../constants/colors";
import InsightsContentTab from "./InsightsContentTab";
import InsightsAudienceTab from "./InsightsAudienceTab";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDE_PAD = 16;

const TAB_ITEMS = ["Overview", "Content", "Audience"];

const METRIC_CARDS = [
  { label: "Views", value: "643,907", active: true },
  { label: "Net followers", value: "+386" },
  { label: "Interactions", value: "50,109" },
];

const PERIOD_OPTIONS = ["7 days", "14 days", "30 days", "60 days", "90 days", "180 days", "Custom"];

const CHART_POINTS = [
  19, 24, 23, 20, 18, 14, 17, 12, 15, 13, 68, 31, 22, 18, 11, 29, 34, 27, 17, 13, 11, 10,
];

const CONTENT_TYPES = [
  { label: "Reels", value: "624K", percent: 96 },
  { label: "Posts", value: "1.5K", percent: 2 },
  { label: "Live videos", value: "0", percent: 0 },
];

const INTERACTION_FILTERS = [
  { label: "All" },
  { label: "Likes", icon: Heart },
  { label: "Comments", icon: MessageCircle },
  { label: "Reposts", icon: Repeat2 },
  { label: "Shares", icon: Repeat2 },
];

const INTERACTION_TYPES = [
  { label: "Reels", value: "49K", percent: 96 },
  { label: "Stories", value: "1.1K", percent: 2 },
  { label: "Posts", value: "117", percent: 1 },
  { label: "Live videos", value: "0", percent: 0 },
];

const PROFILE_ACTIVITY = [
  { label: "Profile visits", value: "6,478", icon: UserRound },
  { label: "Bio link taps", value: "342", icon: ArrowUpRightFromSquare },
  { label: "Business address taps", value: "0", icon: Store },
];

function buildChartPath(values, width, height) {
  const padLeft = 40;
  const padRight = 14;
  const padTop = 18;
  const padBottom = 30;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const max = 70;

  const toX = (i) => padLeft + (i / (values.length - 1)) * chartW;
  const toY = (v) => padTop + (1 - v / max) * chartH;

  return {
    padLeft,
    padRight,
    padTop,
    padBottom,
    chartW,
    chartH,
    toX,
    toY,
    points: values.map((v, i) => `${toX(i)},${toY(v)}`).join(" "),
    lastPoint: { x: toX(values.length - 1), y: toY(values[values.length - 1]) },
  };
}

export default function InsightsDetailScreen() {
  const { dispatch } = useReelData();
  const [activeTab, setActiveTab] = useState("Content");
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30 days");
  const chartWidth = SCREEN_WIDTH - SIDE_PAD * 2;

  const chart = useMemo(
    () => buildChartPath(CHART_POINTS, chartWidth, 220),
    [chartWidth]
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconBtn}
            onPress={() => dispatch({ type: "SET_SCREEN", value: "professionalDashboard" })}
          >
            <ArrowLeft size={28} color={C.black} strokeWidth={2.1} />
          </TouchableOpacity>

          <Text style={styles.title}>Insights</Text>

          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
            <Info size={26} color={C.black} strokeWidth={2.1} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabRow}>
          {TAB_ITEMS.map((item) => {
            const active = activeTab === item;
            return (
              <TouchableOpacity key={item} activeOpacity={0.7} style={styles.tabItem} onPress={() => setActiveTab(item)}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{item}</Text>
                <View style={[styles.tabUnderline, active && styles.tabUnderlineActive]} />
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === "Overview" ? (
          <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All content</Text>
          <View style={styles.periodPickerWrap}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.dateBtn}
              onPress={() => setPeriodMenuOpen((value) => !value)}
            >
              <Text style={styles.dateText}>{selectedPeriod}</Text>
              <ChevronDown size={18} color="#6F6F6F" strokeWidth={2} />
            </TouchableOpacity>

            {periodMenuOpen ? (
              <View style={styles.periodMenu}>
                <Text style={styles.periodMenuLabel}>Time period</Text>
                {PERIOD_OPTIONS.map((option) => {
                  const active = option === selectedPeriod;
                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.7}
                      style={styles.periodMenuItem}
                      onPress={() => {
                        setSelectedPeriod(option);
                        setPeriodMenuOpen(false);
                      }}
                    >
                      <Text style={[styles.periodMenuItemText, active && styles.periodMenuItemTextActive]}>
                        {option}
                      </Text>
                      <View style={styles.periodMenuItemRight}>
                        {active ? (
                          <Check size={18} color={C.black} strokeWidth={2.4} />
                        ) : option === "Custom" ? (
                          <ChevronRight size={18} color="#9A9A9A" strokeWidth={2.2} />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
          {METRIC_CARDS.map((card) => (
            <View key={card.label} style={[styles.metricCard, card.active && styles.metricCardActive]}>
              <Text style={styles.metricLabel}>{card.label}</Text>
              <Text style={styles.metricValue}>{card.value}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.followersSplit}>
          <Text style={styles.followersText}>6.0% followers</Text>
          <Text style={styles.followersText}>94.0% non-followers</Text>
        </View>

        <View style={styles.chartBlock}>
          <Svg width={chartWidth} height={220} viewBox={`0 0 ${chartWidth} 220`}>
            {[0, 35, 70].map((value) => (
              <Line
                key={value}
                x1={chart.padLeft}
                y1={chart.toY(value)}
                x2={chartWidth - chart.padRight}
                y2={chart.toY(value)}
                stroke="#EDEDED"
                strokeWidth={1}
              />
            ))}
            <Polyline
              points={chart.points}
              fill="none"
              stroke="#D500CA"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx={chart.lastPoint.x} cy={chart.lastPoint.y} r={4.5} fill="#D500CA" />

            <SvgText
              x={18}
              y={chart.toY(70) + 4}
              fontSize={12}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
            >
              70K
            </SvgText>
            <SvgText
              x={18}
              y={chart.toY(35) + 4}
              fontSize={12}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
            >
              35K
            </SvgText>
            <SvgText
              x={18}
              y={chart.toY(0) + 4}
              fontSize={12}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
            >
              0
            </SvgText>
            <SvgText
              x={chart.padLeft}
              y={205}
              fontSize={12}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
              textAnchor="start"
            >
              May 23
            </SvgText>
            <SvgText
              x={chart.padLeft + chart.chartW / 2}
              y={205}
              fontSize={12}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
              textAnchor="middle"
            >
              Jun 6
            </SvgText>
            <SvgText
              x={chartWidth - chart.padRight}
              y={205}
              fontSize={12}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
              textAnchor="end"
            >
              Jun 21
            </SvgText>
          </Svg>
        </View>

        <View style={styles.sectionSpacer} />

        <View style={[styles.secondarySection, styles.profileActivitySection]}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.secondaryTitle}>Views by content type</Text>
            <Info size={16} color={C.black} strokeWidth={2.1} />
          </View>

          <View style={styles.accountsRow}>
            <Text style={styles.accountsLabel}>Accounts reached</Text>
            <Text style={styles.accountsValue}>359,365</Text>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#d500ca" }]} />
              <Text style={styles.legendText}>Followers</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#9D1090" }]} />
              <Text style={styles.legendText}>Non-followers</Text>
            </View>
          </View>

        {CONTENT_TYPES.map((item) => (
          <View key={item.label} style={styles.barGroup}>
            <Text style={styles.barLabel}>{item.label}</Text>
            <View style={styles.barRow}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${item.percent}%` }]}>
                  <View style={[styles.barFillFollowers, { width: item.percent > 0 ? "6%" : "0%" }]} />
                  <View style={styles.barSeparator} />
                  <View style={[styles.barFillNonFollowers, { width: item.percent > 0 ? "93%" : "0%" }]} />
                </View>
              </View>
              <Text style={styles.barValue}>{item.value}</Text>
            </View>
          </View>
        ))}
        </View>

        <View style={styles.secondarySection}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.secondaryTitle}>Interactions by content type</Text>
            <Info size={16} color={C.black} strokeWidth={2.1} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {INTERACTION_FILTERS.map((filter, index) => (
              <TouchableOpacity
                key={filter.label}
                activeOpacity={0.7}
                style={[styles.filterChip, index === 0 && styles.filterChipActive]}
              >
                {(() => {
                  const Icon = filter.icon;
                  return Icon ? <Icon size={14} color={C.black} strokeWidth={2} /> : null;
                })()}
                <Text style={[styles.filterChipText, index === 0 && styles.filterChipTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#d500ca" }]} />
              <Text style={styles.legendText}>Followers</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#9D1090" }]} />
              <Text style={styles.legendText}>Non-followers</Text>
            </View>
          </View>

          {INTERACTION_TYPES.map((item) => (
            <View key={item.label} style={styles.barGroup}>
              <Text style={styles.barLabel}>{item.label}</Text>
              <View style={styles.barRow}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${item.percent}%` }]}>
                    <View style={[styles.barFillFollowers, { width: item.percent > 0 ? "6%" : "0%" }]} />
                    <View style={styles.barSeparator} />
                    <View style={[styles.barFillNonFollowers, { width: item.percent > 0 ? "93%" : "0%" }]} />
                  </View>
                </View>
                <Text style={styles.barValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.secondarySection}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.secondaryTitle}>Profile activity</Text>
            <Info size={16} color={C.black} strokeWidth={2.1} />
          </View>

          {PROFILE_ACTIVITY.map((item) => (
            <View key={item.label} style={styles.profileRow}>
              <View style={styles.profileIconCircle}>
                {(() => {
                  const Icon = item.icon;
                  return <Icon size={18} color={C.black} strokeWidth={2} />;
                })()}
              </View>
              <Text style={styles.profileRowLabel}>{item.label}</Text>
              <Text style={styles.profileRowValue}>{item.value}</Text>
            </View>
          ))}
        </View>
          </>
        ) : activeTab === "Content" ? (
          <InsightsContentTab />
        ) : (
          <InsightsAudienceTab />
        )}
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
    paddingHorizontal: SIDE_PAD,
    paddingTop: 2,
    paddingBottom: 28,
    backgroundColor: C.white,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "left",
    fontSize: 21,
    fontWeight: "700",
    color: C.black,
    fontFamily: "Inter_700Bold",
    marginLeft: 2,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 18,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 14,
    color: "#777777",
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  tabTextActive: {
    color: C.black,
  },
  tabUnderline: {
    width: "100%",
    height: 2,
    backgroundColor: "transparent",
    marginTop: 9,
  },
  tabUnderlineActive: {
    backgroundColor: C.black,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    color: C.black,
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  periodPickerWrap: {
    position: "relative",
    alignItems: "flex-end",
    zIndex: 20,
    elevation: 20,
  },
  dateText: {
    fontSize: 16,
    color: "#6F6F6F",
    fontFamily: "Inter_400Regular",
  },
  periodMenu: {
    position: "absolute",
    top: 30,
    right: -8,
    width: 162,
    backgroundColor: C.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  periodMenuLabel: {
    fontSize: 12,
    color: "#A5A5A5",
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  periodMenuItem: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  periodMenuItemText: {
    fontSize: 16,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  periodMenuItemTextActive: {
    fontFamily: "Inter_500Medium",
  },
  periodMenuItemRight: {
    width: 20,
    alignItems: "flex-end",
  },
  cardsRow: {
    paddingBottom: 8,
    gap: 10,
  },
  metricCard: {
    width: 128,
    minHeight: 72,
    borderRadius: 14,
    backgroundColor: "#F4F5F8",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  metricCardActive: {
    backgroundColor: "#F4F5F8",
    borderWidth: 2,
    borderColor: "#111111",
  },
  metricLabel: {
    fontSize: 13,
    color: "#7A7A7A",
    fontFamily: "Inter_400Regular",
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 20,
    color: C.black,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  followersSplit: {
    marginTop: 6,
    marginBottom: 10,
  },
  followersText: {
    fontSize: 14,
    lineHeight: 20,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  chartBlock: {
    marginTop: 2,
    paddingBottom: 10,
  },
  sectionSpacer: {
    height: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
    marginTop: 18,
  },
  secondarySection: {
    marginTop: 18,
  },
  profileActivitySection: {
    paddingBottom: 56,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 6,
    marginBottom: 14,
  },
  secondaryTitle: {
    fontSize: 18,
    color: C.black,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  accountsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  accountsLabel: {
    fontSize: 16,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  accountsValue: {
    fontSize: 16,
    color: C.black,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
  },
  filterRow: {
    gap: 10,
    paddingBottom: 8,
  },
  filterChip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    backgroundColor: C.white,
  },
  filterChipActive: {
    backgroundColor: "#F3F4F6",
    borderColor: "#F3F4F6",
  },
  filterChipText: {
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  filterChipTextActive: {
    fontFamily: "Inter_500Medium",
  },
  barGroup: {
    marginTop: 16,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barLabel: {
    marginBottom: 8,
    fontSize: 14,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F4F5F8",
    overflow: "hidden",
    marginRight: 10,
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
    overflow: "hidden",
    flexDirection: "row",
  },
  barFillFollowers: {
    height: "100%",
    backgroundColor: "#d500ca",
  },
  barSeparator: {
    width: 2,
    height: "100%",
    backgroundColor: C.white,
  },
  barFillNonFollowers: {
    height: "100%",
    backgroundColor: "#9D1090",
  },
  barValue: {
    width: 46,
    textAlign: "right",
    fontSize: 14,
    color: C.black,
    fontFamily: "Inter_500Medium",
  },
  profileRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 0,
  },
  profileIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  profileRowLabel: {
    flex: 1,
    fontSize: 16,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  profileRowValue: {
    fontSize: 16,
    color: C.black,
    fontFamily: "Inter_500Medium",
  },
});
