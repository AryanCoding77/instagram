import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Polyline, Line, Text as SvgText, Circle } from "react-native-svg";

/**
 * DualLineChart
 * Renders the "Views over time" chart:
 *  - solid ig.pink line ("This reel")
 *  - dashed gray line ("Your typical reel")
 *  - Auto-scaling Y-axis based on data
 */

const IG_PINK = "#d500ca";
const GRAY = "#AAAAAA";
const GRID_COLOR = "#F5F5F5";
const TEXT_GRAY = "#8E8E8E";

const PAD_LEFT = 44;
const PAD_RIGHT = 12;
const PAD_TOP = 32;
const PAD_BOTTOM = 28;

export default function DualLineChart({ data }) {
  const { width } = useWindowDimensions();
  const svgWidth = width - 32; // 16px padding on each side
  const svgHeight = 200;
  const chartW = svgWidth - PAD_LEFT - PAD_RIGHT;
  const chartH = svgHeight - PAD_TOP - PAD_BOTTOM;

  // Calculate max value from data for auto-scaling
  const allValues = data.flatMap((d) => [d.thisReel, d.typicalReel]);
  const maxValue = Math.max(...allValues);
  const yMax = Math.ceil(maxValue / 5000) * 5000; // Round up to nearest 5000

  // Normalize data to 0-1 range
  const normalizeValue = (val) => (yMax === 0 ? 0 : val / yMax);

  const THIS_REEL = data.map((d) => normalizeValue(d.thisReel));
  const TYPICAL_REEL = data.map((d) => normalizeValue(d.typicalReel));

  const toX = (i) => PAD_LEFT + (i / (THIS_REEL.length - 1)) * chartW;
  const toY = (v) => PAD_TOP + (1 - v) * chartH;

  const buildPolylinePoints = (dataArray) =>
    dataArray.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  // Y labels: 0, half, max
  const formatYLabel = (val) => {
    if (val >= 1000) return `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K`;
    return String(val);
  };

  const Y_LABELS = [formatYLabel(yMax), formatYLabel(yMax / 2), "0"];
  const Y_VALS = [1, 0.5, 0];

  // X labels: show first, middle, last
  const X_LABELS = [
    data[0]?.label || "",
    data[Math.floor(data.length / 2)]?.label || "",
    data[data.length - 1]?.label || "",
  ];
  const X_POSITIONS = [0, 0.5, 1];

  return (
    <View style={styles.wrapper}>
      <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        {/* Gridlines */}
        {Y_VALS.map((v, i) => (
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

        {/* Y axis labels */}
        {Y_LABELS.map((label, i) => (
          <SvgText
            key={`ylabel-${i}`}
            x={PAD_LEFT - 6}
            y={toY(Y_VALS[i]) + 4}
            textAnchor="end"
            fontSize={12}
            fontFamily="Inter_400Regular"
            fill={TEXT_GRAY}
          >
            {label}
          </SvgText>
        ))}

        {/* X axis labels */}
        {X_LABELS.map((label, i) => (
          <SvgText
            key={`xlabel-${i}`}
            x={PAD_LEFT + X_POSITIONS[i] * chartW}
            y={svgHeight - 6}
            textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}
            fontSize={12}
            fontFamily="Inter_400Regular"
            fill={TEXT_GRAY}
          >
            {label}
          </SvgText>
        ))}

        {/* "Your typical reel" — dashed gray line */}
        <Polyline
          points={buildPolylinePoints(TYPICAL_REEL)}
          fill="none"
          stroke={GRAY}
          strokeWidth={3.5}
          strokeDasharray="6,5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* "This reel" — solid pink line */}
        <Polyline
          points={buildPolylinePoints(THIS_REEL)}
          fill="none"
          stroke={IG_PINK}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Endpoint dot for pink line */}
        <Circle
          cx={toX(THIS_REEL.length - 1)}
          cy={toY(THIS_REEL[THIS_REEL.length - 1])}
          r={5}
          fill={IG_PINK}
        />
      </Svg>

      {/* Legend */}
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
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#8E8E8E",
  },
});
