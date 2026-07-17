import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { ClipPath, Defs, Path, Polyline, Rect, Text as SvgText, Line } from "react-native-svg";
import {
  ArrowUpRightFromSquare,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Check,
  CornerUpLeft,
  Heart,
  Info,
  MessageCircle,
  Repeat2,
  Store,
  Upload,
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
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 3, 0, 0, 0, 0, 262, 84, 4, 0, 0,
];

const CONTENT_TYPES = [
  { label: "Reels", value: "23K", percent: 96 },
  { label: "Stories", value: "28", percent: 2 },
  { label: "Posts", value: "0", percent: 0 },
  { label: "Live videos", value: "0", percent: 0 },
];

const TOP_CONTENT_ITEMS = [
  { id: "1", uri: "https://picsum.photos/seed/topviews1/300/420", value: "60K" },
  { id: "2", uri: "https://picsum.photos/seed/topviews2/300/420", value: "48K" },
  { id: "3", uri: "https://picsum.photos/seed/topviews3/300/420", value: "47K" },
  { id: "4", uri: "https://picsum.photos/seed/topviews4/300/420", value: "36K" },
];

const TOP_CONTENT_REELS_ICON_ASSET = require("../../assets/icons/reels-icon.png");

const TOP_CONTENT_EYE_ASSET = require("../../assets/icons/views-eye.png");

const CHART_HEIGHT = 160;
const CHART_LABEL_Y = 148;
const CHART_TOOLTIP_WIDTH = 64;
const CHART_TOOLTIP_HEIGHT = 62;

const INTERACTION_FILTERS = [
  { label: "All" },
  { label: "Likes", icon: Heart },
  { label: "Comments", icon: MessageCircle },
  { label: "Reposts", icon: Repeat2 },
  { label: "Saves", icon: Bookmark },
  { label: "Shares", icon: Repeat2 },
  { label: "Replies", icon: CornerUpLeft },
];

const INTERACTION_TYPES = [
  { label: "Reels", value: "49K", percent: 96 },
  { label: "Stories", value: "1.1K", percent: 2 },
  { label: "Posts", value: "117", percent: 1 },
  { label: "Live videos", value: "0", percent: 0 },
];

const INTERACTION_TYPE_SETS = {
  All: INTERACTION_TYPES,
  Likes: [
    { label: "Reels", value: "31K", percent: 96 },
    { label: "Stories", value: "820", percent: 3 },
    { label: "Posts", value: "94", percent: 1 },
    { label: "Live videos", value: "0", percent: 0 },
  ],
  Comments: [
    { label: "Reels", value: "4.8K", percent: 90 },
    { label: "Stories", value: "290", percent: 7 },
    { label: "Posts", value: "44", percent: 3 },
    { label: "Live videos", value: "0", percent: 0 },
  ],
  Reposts: [
    { label: "Reels", value: "2.1K", percent: 86 },
    { label: "Stories", value: "160", percent: 9 },
    { label: "Posts", value: "28", percent: 5 },
    { label: "Live videos", value: "0", percent: 0 },
  ],
  Saves: [
    { label: "Reels", value: "7.4K", percent: 91 },
    { label: "Stories", value: "430", percent: 6 },
    { label: "Posts", value: "70", percent: 3 },
    { label: "Live videos", value: "0", percent: 0 },
  ],
  Shares: [
    { label: "Reels", value: "2.9K", percent: 88 },
    { label: "Stories", value: "210", percent: 8 },
    { label: "Posts", value: "26", percent: 4 },
    { label: "Live videos", value: "0", percent: 0 },
  ],
  Replies: [
    { label: "Reels", value: "1.1K", percent: 84 },
    { label: "Stories", value: "94", percent: 10 },
    { label: "Posts", value: "15", percent: 6 },
    { label: "Live videos", value: "0", percent: 0 },
  ],
};

const PROFILE_ACTIVITY = [
  { label: "Profile visits", value: "6,478", icon: UserRound },
  { label: "Bio link taps", value: "342", icon: ArrowUpRightFromSquare },
  { label: "Business address taps", value: "0", icon: Store },
];

function BackArrowIcon({ size = 30, color = "#111111" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <Path
        d="M27 15H8.7M8.7 15L15.2 9.1M8.7 15L15.2 20.9"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function buildChartPath(values, width, height) {
  const padLeft = 44;
  const padRight = 8;
  const padTop = 10;
  const padBottom = 34;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const max = 262;

  const toX = (i) => padLeft + (i / (values.length - 1)) * chartW;
  const toY = (v) => Math.max(padTop + 1, padTop + (1 - v / max) * chartH);

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

function formatChartDate(index, total) {
  const start = new Date(2026, 5, 15);
  const end = new Date(2026, 6, 14);
  const date = new Date(start.getTime() + ((end.getTime() - start.getTime()) * index) / Math.max(total - 1, 1));
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

export default function InsightsDetailScreen() {
  const { dispatch } = useReelData();
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30 days");
  const [activeChartPoint, setActiveChartPoint] = useState(null);
  const [activeInteractionFilter, setActiveInteractionFilter] = useState("All");
  const chartWidth = SCREEN_WIDTH - SIDE_PAD * 2;

  const chart = useMemo(
    () => buildChartPath(CHART_POINTS, chartWidth, CHART_HEIGHT),
    [chartWidth]
  );
  const interactionTypes = INTERACTION_TYPE_SETS[activeInteractionFilter] || INTERACTION_TYPES;

  useEffect(() => {
    setPeriodMenuOpen(false);
    setActiveChartPoint(null);
    scrollRef.current?.scrollTo?.({ y: 0, animated: false });
  }, [activeTab]);

  const updateChartPoint = (touchX) => {
    const x = Math.max(chart.padLeft, Math.min(touchX, chartWidth - chart.padRight));
    const index = Math.round(((x - chart.padLeft) / chart.chartW) * (CHART_POINTS.length - 1));
    const clampedIndex = Math.max(0, Math.min(CHART_POINTS.length - 1, index));
    if (activeChartPoint?.index === clampedIndex) {
      return;
    }
    const value = CHART_POINTS[clampedIndex];
    setActiveChartPoint({
      index: clampedIndex,
      value,
      label: formatChartDate(clampedIndex, CHART_POINTS.length),
      x: chart.toX(clampedIndex),
      y: chart.toY(value),
    });
  };

  const chartPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => updateChartPoint(evt.nativeEvent.locationX),
        onPanResponderMove: (evt) => updateChartPoint(evt.nativeEvent.locationX),
        onPanResponderRelease: () => setActiveChartPoint(null),
        onPanResponderTerminate: () => setActiveChartPoint(null),
      }),
    [chart]
  );

  useEffect(() => {
    TOP_CONTENT_ITEMS.forEach((item) => {
      Image.prefetch(item.uri);
    });
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.stickyHeader}>
          <View style={styles.topBar}>
          <TouchableOpacity
              activeOpacity={0.7}
              style={styles.iconBtn}
              onPress={() => dispatch({ type: "SET_SCREEN", value: "professionalDashboard" })}
            >
              <BackArrowIcon />
            </TouchableOpacity>

            <Text style={styles.title}>Insights</Text>

            <View style={styles.topBarActions}>
              <TouchableOpacity activeOpacity={0.7} style={styles.headerActionBtn}>
                <Upload size={24} color={C.black} strokeWidth={2.1} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.headerActionBtn}>
                <Info size={25} color={C.black} strokeWidth={2.1} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tabsSection}>
            <View style={styles.tabsDivider} />

            <View style={styles.tabRow}>
              {TAB_ITEMS.map((item) => {
                const active = activeTab === item;
                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.7}
                    style={styles.tabItem}
                    onPress={() => {
                      setPeriodMenuOpen(false);
                      setActiveChartPoint(null);
                      setActiveTab(item);
                    }}
                  >
                    <Text style={[styles.tabText, active && styles.tabTextActive]}>{item}</Text>
                    <View style={[styles.tabUnderline, active && styles.tabUnderlineActive]} />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.tabsDivider} />
          </View>
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardsScroller}
          contentContainerStyle={styles.cardsRow}
        >
          {METRIC_CARDS.map((card) => (
            <View key={card.label} style={[styles.metricCard, card.active && styles.metricCardActive]}>
              <Text style={styles.metricLabel}>{card.label}</Text>
              <Text style={styles.metricValue}>{card.value}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.followersSplit}>
          <Text style={styles.followersText}>
            <Text style={styles.followersValue}>6.0%</Text> followers
          </Text>
          <Text style={styles.followersText}>
            <Text style={styles.followersValue}>94.0%</Text> non-followers
          </Text>
        </View>

        <View style={styles.chartBlock}>
          <View style={[styles.chartSurface, { width: chartWidth, height: CHART_HEIGHT }]}>
          <Svg width={chartWidth} height={CHART_HEIGHT} viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}>
            <Defs>
              <ClipPath id="chartLineClip">
                <Rect
                  x={chart.padLeft}
                  y={chart.toY(262)}
                  width={chart.chartW}
                  height={CHART_HEIGHT - chart.toY(262)}
                />
              </ClipPath>
            </Defs>
            {[262, 131, 0].map((value) => (
            <Line
                key={value}
                x1={chart.padLeft}
                y1={chart.toY(value)}
                x2={chartWidth - chart.padRight}
                y2={chart.toY(value)}
                stroke="#F0F0F0"
                strokeWidth={1}
              />
            ))}
            <Polyline
              points={chart.points}
              fill="none"
              stroke="#E11BC4"
              strokeWidth={4}
              strokeLinecap="butt"
              strokeLinejoin="miter"
              clipPath="url(#chartLineClip)"
            />
            <SvgText
              x={12}
              y={chart.toY(262) + 3}
              fontSize={10}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
            >
              262K
            </SvgText>
            <SvgText
              x={12}
              y={chart.toY(131) + 3}
              fontSize={10}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
            >
              131K
            </SvgText>
            <SvgText
              x={14}
              y={chart.toY(0) + 3}
              fontSize={10}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
            >
              0
            </SvgText>
            <SvgText
              x={chart.padLeft}
              y={CHART_LABEL_Y}
              fontSize={10}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
              textAnchor="start"
            >
              15 Jun
            </SvgText>
            <SvgText
              x={chart.padLeft + chart.chartW * 0.44}
              y={CHART_LABEL_Y}
              fontSize={10}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
              textAnchor="middle"
            >
              29 Jun
            </SvgText>
            <SvgText
              x={chartWidth - chart.padRight}
              y={CHART_LABEL_Y}
              fontSize={10}
              fontFamily="Inter_400Regular"
              fill="#8E8E8E"
              textAnchor="end"
            >
              14 Jul
            </SvgText>
          </Svg>
          <View style={StyleSheet.absoluteFill} {...chartPanResponder.panHandlers} />
          {activeChartPoint ? (
            <>
              {(() => {
                const tooltipLeft = Math.max(
                  8,
                  Math.min(activeChartPoint.x - CHART_TOOLTIP_WIDTH / 2, chartWidth - CHART_TOOLTIP_WIDTH - 8)
                );
                const tooltipTop = -74;
                const tooltipBottom = tooltipTop + CHART_TOOLTIP_HEIGHT;

                return (
                  <>
              <View
                pointerEvents="none"
                style={[
                  styles.chartTooltip,
                  {
                    left: tooltipLeft,
                    top: tooltipTop,
                  },
                ]}
              >
                <Text style={styles.chartTooltipValue}>{activeChartPoint.value.toLocaleString()}</Text>
                <Text style={styles.chartTooltipDate}>{activeChartPoint.label}</Text>
                <View pointerEvents="none" style={styles.chartTooltipPointer} />
              </View>
                  </>
                );
              })()}
            </>
          ) : null}
          </View>
        </View>

        <View style={styles.sectionSpacer} />

        <View style={[styles.secondarySection, styles.profileActivitySection]}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.secondaryTitle}>Views by content type</Text>
            <View style={styles.sectionInfoWrap}>
              <Info size={16} color={C.black} strokeWidth={2.1} />
            </View>
          </View>

          <View style={styles.accountsRow}>
            <Text style={styles.accountsLabel}>Accounts reached</Text>
            <Text style={styles.accountsValue}>359,365</Text>
          </View>

          <View style={styles.accountsDivider} />

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#D81BC0" }]} />
              <Text style={styles.legendText}>Followers</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#841177" }]} />
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

          <View style={styles.topContentHeader}>
            <Text style={styles.topContentTitle}>Top content by views</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.topContentSeeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.topContentScroller}
            contentContainerStyle={styles.topContentRow}
          >
            {TOP_CONTENT_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={styles.topContentCard}
                onPress={() => dispatch({ type: "SET_SCREEN", value: "insights" })}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={styles.topContentImage}
                  resizeMode="cover"
                  fadeDuration={0}
                />
                <View style={styles.topContentBadgeIcon}>
                  <Image source={TOP_CONTENT_REELS_ICON_ASSET} style={styles.topContentBadgeImage} resizeMode="contain" />
                </View>
                <View style={styles.topContentCountRow}>
                  <View style={styles.topContentCountIconWrap}>
                    <Image source={TOP_CONTENT_EYE_ASSET} style={styles.topContentCountIcon} resizeMode="contain" />
                  </View>
                  <Text style={styles.topContentCount}>{item.value}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.secondarySection, styles.interactionsSection]}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.secondaryTitle}>Interactions by content type</Text>
            <Info size={16} color={C.black} strokeWidth={2.1} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroller}
            contentContainerStyle={styles.filterRow}
          >
            {INTERACTION_FILTERS.map((filter, index) => (
              <TouchableOpacity
                key={filter.label}
                activeOpacity={0.7}
                style={[styles.filterChip, activeInteractionFilter === filter.label && styles.filterChipActive]}
                onPress={() => setActiveInteractionFilter(filter.label)}
              >
                {(() => {
                  const Icon = filter.icon;
                  return Icon ? <Icon size={14} color={C.black} strokeWidth={2} /> : null;
                })()}
                <Text style={[styles.filterChipText, activeInteractionFilter === filter.label && styles.filterChipTextActive]}>
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

          {interactionTypes.map((item) => (
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
          <View style={[styles.sectionTitleRow, styles.profileActivityTitleRow]}>
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
          <InsightsContentTab key="content" />
        ) : (
          <InsightsAudienceTab key="audience" />
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
    paddingTop: 14,
    paddingBottom: 28,
    backgroundColor: C.white,
  },
  stickyHeader: {
    backgroundColor: C.white,
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
    marginHorizontal: -SIDE_PAD,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 52,
    marginBottom: 2,
    paddingHorizontal: SIDE_PAD,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarActions: {
    minWidth: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  headerActionBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "left",
    fontSize: 18,
    fontWeight: "600",
    color: C.black,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 14,
  },
  tabsSection: {
    marginTop: 2,
    marginBottom: 0,
    backgroundColor: C.white,
    zIndex: 50,
    elevation: 0,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 0,
  },
  tabsDivider: {
    height: 1,
    backgroundColor: "#ECECEC",
  },
  tabText: {
    fontSize: 13,
    color: "#777777",
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  tabTextActive: {
    color: C.black,
  },
  tabUnderline: {
    width: 88,
    height: 2.6,
    backgroundColor: "transparent",
    marginTop: 9,
  },
  tabUnderlineActive: {
    backgroundColor: "#111111",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 52,
    marginBottom: 14,
    zIndex: 20,
    elevation: 20,
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
    zIndex: 30,
    elevation: 30,
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
    zIndex: 40,
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
    elevation: 40,
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
  cardsScroller: {
    marginLeft: -SIDE_PAD,
    marginRight: -SIDE_PAD,
  },
  cardsRow: {
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: SIDE_PAD,
    gap: 10,
  },
  metricCard: {
    width: 122,
    minHeight: 66,
    borderRadius: 14,
    backgroundColor: "#F4F5F8",
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  metricCardActive: {
    backgroundColor: "#F4F5F8",
    borderWidth: 2,
    borderColor: "#111111",
  },
  metricLabel: {
    fontSize: 12,
    color: "#7A7A7A",
    fontFamily: "Inter_400Regular",
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 18,
    color: C.black,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  followersSplit: {
    marginTop: 6,
    marginBottom: 22,
  },
  followersText: {
    fontSize: 12,
    lineHeight: 20,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  followersValue: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    color: C.black,
  },
  chartBlock: {
    marginTop: 30,
    paddingBottom: 10,
  },
  chartSurface: {
    position: "relative",
  },
  chartTooltip: {
    position: "absolute",
    width: 74,
    minHeight: 60,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    borderRadius: 14,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    zIndex: 4,
  },
  chartTooltipValue: {
    fontSize: 14,
    lineHeight: 17,
    color: C.black,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  chartTooltipDate: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 13,
    color: "#747474",
    fontFamily: "Inter_400Regular",
  },
  chartTooltipPointer: {
    position: "absolute",
    left: "50%",
    bottom: -6,
    marginLeft: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: C.white,
    zIndex: 5,
  },
  sectionSpacer: {
    height: 5,
    backgroundColor: "#EFEFEF",
    marginTop: 1,
    marginHorizontal: -SIDE_PAD,
  },
  secondarySection: {
    marginTop: 0,
  },
  interactionsSection: {
    marginTop: 0,
  },
  profileActivitySection: {
    marginTop: 32,
    paddingBottom: 56,
  },
  profileActivityTitleRow: {
    marginTop: 24,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 6,
    marginBottom: 14,
  },
  sectionInfoWrap: {
    marginTop: 2,
  },
  sectionInfoImage: {
    width: 16,
    height: 16,
    tintColor: C.black,
  },
  secondaryTitle: {
    fontSize: 16,
    color: C.black,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  accountsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  accountsLabel: {
    fontSize: 14,
    color: C.black,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  accountsValue: {
    fontSize: 16,
    color: C.black,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  accountsDivider: {
    height: 1,
    backgroundColor: "#ECEFF3",
    marginTop: 4,
    marginBottom: 8,
    marginHorizontal: 2,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 10,
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
    fontSize: 11,
    color: "#6F6F6F",
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  filterRow: {
    gap: 10,
    paddingLeft: 8,
    paddingRight: SIDE_PAD,
    paddingBottom: 8,
  },
  filterScroller: {
    marginLeft: -SIDE_PAD,
    marginRight: -SIDE_PAD,
  },
  filterChip: {
    height: 36,
    paddingHorizontal: 16,
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
    marginTop: 8,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barLabel: {
    marginBottom: 2,
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 2,
    backgroundColor: "#F4F5F8",
    overflow: "hidden",
    marginRight: 10,
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
    flexDirection: "row",
  },
  barFillFollowers: {
    height: "100%",
    backgroundColor: "#D81BC0",
  },
  barSeparator: {
    width: 2,
    height: "100%",
    backgroundColor: C.white,
  },
  barFillNonFollowers: {
    height: "100%",
    backgroundColor: "#841177",
  },
  barValue: {
    width: 46,
    textAlign: "right",
    fontSize: 14,
    color: C.black,
    fontFamily: "Inter_500Medium",
  },
  topContentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 8,
  },
  topContentTitle: {
    fontSize: 16,
    color: C.black,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  topContentSeeAll: {
    fontSize: 14,
    color: "#3E5BFF",
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  topContentScroller: {
    marginLeft: -SIDE_PAD,
    marginRight: -SIDE_PAD,
  },
  topContentRow: {
    gap: 10,
    paddingLeft: 8,
    paddingRight: SIDE_PAD,
    paddingBottom: 0,
  },
  topContentCard: {
    width: 88,
    height: 114,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#E9EAF0",
    position: "relative",
  },
  topContentImage: {
    width: "100%",
    height: "100%",
  },
  topContentBadgeIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    zIndex: 2,
  },
  topContentBadgeImage: {
    width: 16,
    height: 16,
  },
  topContentCountRow: {
    position: "absolute",
    left: 8,
    bottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  topContentCountIconWrap: {
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  topContentCountIcon: {
    width: 13,
    height: 13,
    opacity: 0.98,
  },
  topContentCount: {
    color: C.white,
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
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
