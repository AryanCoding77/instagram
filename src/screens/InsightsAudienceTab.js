import { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Line, Polyline, Text as SvgText } from "react-native-svg";
import { ChevronDown, Info } from "lucide-react-native";
import { C } from "../constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDE_PAD = 16;
const PERIOD_OPTIONS = ["7 days", "14 days", "30 days", "60 days", "90 days", "180 days", "Custom"];

const CHART_POINTS = [
  18, 10, 16, 12, 17, 15, 16, 23, 11, 13, 27, 12, 2, -8, 18, 32, 15, 8, 3, 1, 2, 1, 29, 9, 4, -11, 14,
];

const AGE_RANGES = [
  { label: "13-17", percent: 28.0 },
  { label: "18-24", percent: 28.7 },
  { label: "25-34", percent: 23.1 },
  { label: "35-44", percent: 14.0 },
  { label: "45-54", percent: 4.3 },
  { label: "55-64", percent: 1.1 },
  { label: "65+", percent: 0.8 },
];

const TOP_LOCATIONS = [
  { name: "India", percent: 81.0 },
  { name: "Pakistan", percent: 2.2 },
  { name: "Bangladesh", percent: 2.1 },
  { name: "Brazil", percent: 1.9 },
  { name: "Morocco", percent: 1.1 },
];

const ACTIVE_TIMES = [
  { day: "Su", value: 1 },
  { day: "M", value: 48 },
  { day: "Tu", value: 72 },
  { day: "W", value: 88 },
  { day: "Th", value: 82 },
  { day: "F", value: 96 },
  { day: "Sa", value: 74 },
];

function buildChart(values, width, height) {
  const padLeft = 26;
  const padRight = 10;
  const padTop = 14;
  const padBottom = 22;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const max = 44;
  const min = -44;

  const toX = (i) => padLeft + (i / (values.length - 1)) * chartW;
  const toY = (v) => padTop + ((max - v) / (max - min)) * chartH;

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
  };
}

function BarRow({ label, percent, color }) {
  return (
    <View style={styles.barBlock}>
      <View style={styles.barTopRow}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barPercent}>{percent.toFixed(1)}%</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function LocationRow({ name, percent }) {
  return (
    <View style={styles.locationBlock}>
      <View style={styles.locationLabelRow}>
        <Text style={styles.locationLabel}>{name}</Text>
        <Text style={styles.locationPercent}>{percent.toFixed(1)}%</Text>
      </View>
      <View style={styles.locationTrack}>
        <View style={[styles.locationFill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

export default function InsightsAudienceTab() {
  const chartWidth = SCREEN_WIDTH - SIDE_PAD * 2;
  const chart = useMemo(() => buildChart(CHART_POINTS, chartWidth, 170), [chartWidth]);
  const [selectedPeriod] = useState("30 days");
  const [selectedLocationTab] = useState("Countries");

  const womenPercent = 14.4;
  const menPercent = 85.6;

  return (
    <View style={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Followers</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.periodBtn}>
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <ChevronDown size={18} color="#707070" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <Text style={styles.bigValue}>6,960</Text>
      <Text style={styles.growthText}>+5.9% <Text style={styles.growthMuted}>since May 23</Text></Text>

      <Text style={styles.sectionTitle}>Follower growth over time</Text>

      <View style={styles.filterRow}>
        <View style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={[styles.filterText, styles.filterTextActive]}>Overall</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>Follows</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>Unfollows</Text>
        </View>
      </View>

      <View style={styles.chartWrap}>
        <Svg width={chartWidth} height={170} viewBox={`0 0 ${chartWidth} 170`}>
          <Line x1={chart.padLeft} y1={chart.toY(44)} x2={chartWidth - chart.padRight} y2={chart.toY(44)} stroke="#EDEDED" strokeWidth={1} />
          <Line x1={chart.padLeft} y1={chart.toY(0)} x2={chartWidth - chart.padRight} y2={chart.toY(0)} stroke="#EDEDED" strokeWidth={1} />
          <Line x1={chart.padLeft} y1={chart.toY(-44)} x2={chartWidth - chart.padRight} y2={chart.toY(-44)} stroke="#EDEDED" strokeWidth={1} />
          <Polyline points={chart.points} fill="none" stroke="#D500CA" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />

          <SvgText x={4} y={chart.toY(44) + 4} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E">
            44
          </SvgText>
          <SvgText x={4} y={chart.toY(0) + 4} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E">
            0
          </SvgText>
          <SvgText x={0} y={chart.toY(-44) + 4} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E">
            -44
          </SvgText>
          <SvgText x={chart.padLeft} y={164} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E" textAnchor="start">
            May 23
          </SvgText>
          <SvgText x={chart.padLeft + chart.chartW / 2} y={164} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E" textAnchor="middle">
            Jun 4
          </SvgText>
          <SvgText x={chartWidth - chart.padRight} y={164} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E" textAnchor="end">
            Jun 17
          </SvgText>
        </Svg>
      </View>

      <View style={styles.genderHeader}>
        <Text style={styles.sectionTitle}>Gender</Text>
        <Info size={16} color={C.black} strokeWidth={2.1} />
      </View>

      <BarRow label="Women" percent={womenPercent} color="#D500CA" />
      <BarRow label="Men" percent={menPercent} color="#9D1090" />

      <View style={styles.ageHeader}>
        <Text style={styles.sectionTitle}>Age range</Text>
        <Info size={16} color={C.black} strokeWidth={2.1} />
      </View>

      <View style={styles.ageLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#D500CA" }]} />
          <Text style={styles.legendText}>Women</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#9D1090" }]} />
          <Text style={styles.legendText}>Men</Text>
        </View>
      </View>

      <View style={styles.ageBars}>
        {AGE_RANGES.map((group) => (
          <View key={group.label} style={styles.ageRow}>
            <View style={styles.ageRowTop}>
              <Text style={styles.ageLabel}>{group.label}</Text>
              <Text style={styles.agePercent}>{group.percent.toFixed(1)}%</Text>
            </View>
            <View style={styles.ageTrack}>
              <View style={styles.ageWomenFill} />
              <View style={styles.ageDivider} />
              <View style={[styles.ageMenFill, { width: `${Math.max(group.percent - 2.2, 0)}%` }]} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.locationsHeader}>
        <Text style={styles.sectionTitle}>Top locations</Text>
        <Info size={16} color={C.black} strokeWidth={2.1} />
      </View>

      <View style={styles.locationTabs}>
        <View style={[styles.locationTab, selectedLocationTab === "Countries" && styles.locationTabActive]}>
          <Text style={[styles.locationTabText, styles.locationTabTextActive]}>Countries</Text>
        </View>
        <View style={styles.locationTab}>
          <Text style={styles.locationTabText}>Cities</Text>
        </View>
      </View>

      <View style={styles.locationsList}>
        {TOP_LOCATIONS.map((location) => (
          <LocationRow key={location.name} name={location.name} percent={location.percent} />
        ))}
      </View>

      <View style={styles.activeTimesHeader}>
        <Text style={styles.sectionTitle}>Follower active times</Text>
        <Info size={16} color={C.black} strokeWidth={2.1} />
      </View>

      <View style={styles.activeDayRow}>
        {ACTIVE_TIMES.map((item, index) => {
          const active = index === 0;
          return (
            <View key={item.day} style={[styles.activeDayChip, active && styles.activeDayChipActive]}>
              <Text style={[styles.activeDayChipText, active && styles.activeDayChipTextActive]}>{item.day}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.activeBars}>
        {ACTIVE_TIMES.map((item, index) => {
          const heights = [8, 58, 90, 102, 96, 108, 84];
          return <View key={item.day} style={[styles.activeBar, { height: heights[index] }]} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SIDE_PAD,
    paddingTop: 2,
    paddingBottom: 28,
    backgroundColor: C.white,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  heading: {
    fontSize: 19,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  periodBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  periodText: {
    fontSize: 17,
    color: "#707070",
    fontFamily: "Inter_400Regular",
  },
  bigValue: {
    fontSize: 30,
    lineHeight: 34,
    color: C.black,
    fontFamily: "Inter_500Medium",
    marginBottom: 2,
  },
  growthText: {
    fontSize: 12,
    color: "#16A34A",
    fontFamily: "Inter_500Medium",
    marginBottom: 22,
  },
  growthMuted: {
    color: "#777777",
    fontFamily: "Inter_400Regular",
  },
  sectionTitle: {
    fontSize: 17,
    color: C.black,
    fontFamily: "Inter_500Medium",
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 12,
    paddingBottom: 18,
  },
  filterChip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    alignItems: "center",
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
  chartWrap: {
    marginTop: 2,
    marginBottom: 28,
  },
  genderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  barBlock: {
    marginBottom: 14,
  },
  barTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 15,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  barPercent: {
    fontSize: 15,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F4F5F8",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  ageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    marginBottom: 12,
  },
  ageBars: {
    paddingBottom: 20,
  },
  ageLegend: {
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
    fontSize: 12,
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
  },
  ageRow: {
    marginBottom: 16,
  },
  ageRowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ageLabel: {
    fontSize: 13,
    color: "#7C7C7C",
    fontFamily: "Inter_400Regular",
  },
  agePercent: {
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  ageTrack: {
    flexDirection: "row",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F4F5F8",
    overflow: "hidden",
  },
  ageWomenFill: {
    width: 6,
    height: "100%",
    backgroundColor: "#D500CA",
  },
  ageDivider: {
    width: 2,
    height: "100%",
    backgroundColor: C.white,
  },
  ageMenFill: {
    height: "100%",
    backgroundColor: "#9D1090",
  },
  locationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    marginBottom: 14,
  },
  locationTabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },
  locationTab: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.white,
  },
  locationTabActive: {
    backgroundColor: "#F3F4F6",
    borderColor: "#F3F4F6",
  },
  locationTabText: {
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  locationTabTextActive: {
    fontFamily: "Inter_500Medium",
  },
  activeTimesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    marginBottom: 16,
  },
  activeDayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  activeDayChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.white,
  },
  activeDayChipActive: {
    backgroundColor: "#F3F4F6",
    borderColor: "#F3F4F6",
  },
  activeDayChipText: {
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  activeDayChipTextActive: {
    fontFamily: "Inter_500Medium",
  },
  activeBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 118,
    paddingHorizontal: 4,
    marginBottom: 18,
  },
  activeBar: {
    width: 36,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: "#D500CA",
  },
  locationsList: {
    paddingBottom: 24,
  },
  locationBlock: {
    marginBottom: 14,
  },
  locationLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 15,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  locationPercent: {
    fontSize: 15,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  locationTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F4F5F8",
    overflow: "hidden",
  },
  locationFill: {
    height: "100%",
    backgroundColor: "#D500CA",
    borderRadius: 999,
  },
});
