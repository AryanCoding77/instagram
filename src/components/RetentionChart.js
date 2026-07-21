import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Polyline, Line, Text as SvgText } from "react-native-svg";
import VideoPreviewCard from "./VideoPreviewCard";

/**
 * RetentionChart
 * Props:
 *   title    – section title string (e.g. "How long people watched your reel")
 *   data     – array of 0–1 normalized values (left to right)
 *   yLabels  – array of 3 strings for top/mid/bottom
 *   xStart   – string for left x label
 *   xEnd     – string for right x label
 */

const IG_PINK = "#d500ca";
const GRID_COLOR = "#F5F5F5";
const TEXT_GRAY = "#8E8E8E";

const PAD_LEFT = 50;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

export default function RetentionChart({
  data,
  yLabels = ["100%", "50%", "0"],
  xStart = "0:00",
  xEnd = "0:23",
}) {
  const { width } = useWindowDimensions();
  const svgWidth = width - 32; // 16px padding on each side
  const svgHeight = 116;
  const chartW = svgWidth - PAD_LEFT - PAD_RIGHT;
  const chartH = svgHeight - PAD_TOP - PAD_BOTTOM;

  const toX = (i) => PAD_LEFT + (i / (data.length - 1)) * chartW;
  const toY = (v) => PAD_TOP + (1 - v) * chartH;

  const polylinePoints = data.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  const Y_VALS = [1, 0.5, 0];

  return (
    <View style={styles.wrapper}>
      <VideoPreviewCard width={83} showPlayIcon={true} />
      <View style={styles.chartContainer}>
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
          {yLabels.map((label, i) => (
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

          {/* X start label */}
          <SvgText
            x={PAD_LEFT}
            y={svgHeight - 6}
            textAnchor="start"
            fontSize={12}
            fontFamily="Inter_400Regular"
            fill={TEXT_GRAY}
          >
            {xStart}
          </SvgText>

          {/* X end label */}
          <SvgText
            x={svgWidth - PAD_RIGHT}
            y={svgHeight - 6}
            textAnchor="end"
            fontSize={12}
            fontFamily="Inter_400Regular"
            fill={TEXT_GRAY}
          >
            {xEnd}
          </SvgText>

          {/* Pink line */}
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={IG_PINK}
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 4,
  },
  chartContainer: {
    width: "100%",
    marginTop: 44,
  },
});
