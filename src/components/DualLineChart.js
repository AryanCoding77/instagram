import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Svg, {
  Polyline,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
  Rect,
} from "react-native-svg";

const IG_PINK = "#d500ca";
const GRAY = "#989CA6";
const GRID_COLOR = "#EEF1F5";
const TEXT_GRAY = "#6E6E6E";
const SURFACE = "#FBFBFD";

const PAD_LEFT = 44;
const PAD_RIGHT = 12;
const PAD_TOP = 18;
const PAD_BOTTOM = 24;

function buildAreaPath(values, toX, toY, baselineY) {
  if (!values.length) return "";
  const startX = toX(0);
  const endX = toX(values.length - 1);
  const linePath = values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`)
    .join(" ");
  return `${linePath} L ${endX} ${baselineY} L ${startX} ${baselineY} Z`;
}

export default function DualLineChart({ data }) {
  const { width } = useWindowDimensions();
  const safeData = Array.isArray(data) && data.length ? data : [{ label: "", thisReel: 0, typicalReel: 0 }];
  const svgWidth = width;
  const svgHeight = 164;
  const chartW = svgWidth - PAD_LEFT - PAD_RIGHT;
  const chartH = svgHeight - PAD_TOP - PAD_BOTTOM;

  const allValues = safeData.flatMap((d) => [d.thisReel, d.typicalReel]).map((value) => Number(value) || 0);
  const maxValue = Math.max(...allValues, 1);
  const yMax = Math.ceil(maxValue / 5000) * 5000 || 5000;

  const normalizeValue = (val) => (yMax === 0 ? 0 : (Number(val) || 0) / yMax);

  const thisReelSeries = safeData.map((d) => normalizeValue(d.thisReel));
  const typicalReelSeries = safeData.map((d) => normalizeValue(d.typicalReel));

  const toX = (i) => PAD_LEFT + (i / Math.max(thisReelSeries.length - 1, 1)) * chartW;
  const toY = (v) => PAD_TOP + (1 - v) * chartH;
  const buildPolylinePoints = (series) => series.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  const formatYLabel = (val) => {
    if (val >= 1000) return `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K`;
    return String(val);
  };

  const yLabels = [formatYLabel(yMax), formatYLabel(yMax / 2), "0"];
  const yValues = [1, 0.5, 0];
  const xLabels = [
    safeData[0]?.label || "",
    safeData[Math.floor(safeData.length / 2)]?.label || "",
    safeData[safeData.length - 1]?.label || "",
  ];
  const xPositions = [0, 0.5, 1];
  const baselineY = toY(0);
  const areaPath = buildAreaPath(thisReelSeries, toX, toY, baselineY);
  const lastIndex = Math.max(thisReelSeries.length - 1, 0);

  return (
    <View style={styles.wrapper}>
      <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <Defs>
          <LinearGradient id="viewsAreaFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#D500CA" stopOpacity="0.22" />
            <Stop offset="68%" stopColor="#D500CA" stopOpacity="0.06" />
            <Stop offset="100%" stopColor="#D500CA" stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="typicalLineFade" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#C6CAD2" stopOpacity="0.55" />
            <Stop offset="100%" stopColor="#8E939D" stopOpacity="0.95" />
          </LinearGradient>
        </Defs>

        <Rect
          x={PAD_LEFT - 10}
          y={PAD_TOP - 8}
          width={chartW + 12}
          height={chartH + 10}
          rx={16}
          fill={SURFACE}
        />

        {yValues.map((v, i) => (
          <Line
            key={`grid-${i}`}
            x1={PAD_LEFT}
            y1={toY(v)}
            x2={svgWidth - PAD_RIGHT}
            y2={toY(v)}
            stroke={GRID_COLOR}
            strokeWidth={1}
          />
        ))}

        <Path d={areaPath} fill="url(#viewsAreaFill)" />

        {yLabels.map((label, i) => (
          <SvgText
            key={`ylabel-${i}`}
            x={PAD_LEFT - 6}
            y={toY(yValues[i]) + 4}
            textAnchor="end"
            fontSize={11.5}
            fontFamily="Inter_400Regular"
            fill={TEXT_GRAY}
          >
            {label}
          </SvgText>
        ))}

        {xLabels.map((label, i) => (
          <SvgText
            key={`xlabel-${i}`}
            x={PAD_LEFT + xPositions[i] * chartW}
            y={svgHeight - 6}
            textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}
            fontSize={11.5}
            fontFamily="Inter_400Regular"
            fill={TEXT_GRAY}
          >
            {label}
          </SvgText>
        ))}

        <Polyline
          points={buildPolylinePoints(typicalReelSeries)}
          fill="none"
          stroke="url(#typicalLineFade)"
          strokeWidth={3}
          strokeDasharray="5,5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Polyline
          points={buildPolylinePoints(thisReelSeries)}
          fill="none"
          stroke={IG_PINK}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Circle
          cx={toX(lastIndex)}
          cy={toY(thisReelSeries[lastIndex] || 0)}
          r={6.5}
          fill="#FFFFFF"
          stroke={IG_PINK}
          strokeWidth={3}
        />
        <Circle
          cx={toX(lastIndex)}
          cy={toY(typicalReelSeries[lastIndex] || 0)}
          r={4.5}
          fill="#FFFFFF"
          stroke="#9EA3AD"
          strokeWidth={2}
        />
      </Svg>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: IG_PINK }]} />
          <Text style={styles.legendText}>This reel</Text>
        </View>
        <View style={[styles.legendItem, { marginLeft: 16 }]}>
          <View style={[styles.dot, { backgroundColor: GRAY }]} />
          <Text style={styles.legendText}>Your typical reel</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
    marginHorizontal: -16,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10.5,
    fontFamily: "Inter_500Medium",
    color: "#525252",
  },
});
