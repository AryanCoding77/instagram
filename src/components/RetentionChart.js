import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
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
import VideoPreviewCard from "./VideoPreviewCard";

const IG_PINK = "#d500ca";
const GRID_COLOR = "#EEF1F5";
const TEXT_GRAY = "#8E8E8E";
const SURFACE = "#FBFBFD";

const PAD_LEFT = 50;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

function buildAreaPath(points, toX, toY, baselineY) {
  if (!points.length) return "";
  const startX = toX(0);
  const endX = toX(points.length - 1);
  const linePath = points.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");
  return `${linePath} L ${endX} ${baselineY} L ${startX} ${baselineY} Z`;
}

export default function RetentionChart({
  data,
  yLabels = ["100%", "50%", "0"],
  xStart = "0:00",
  xEnd = "0:23",
}) {
  const { width } = useWindowDimensions();
  const safeData = Array.isArray(data) && data.length ? data : [1, 0.8, 0.6, 0.4, 0.2, 0];
  const svgWidth = width - 32;
  const svgHeight = 124;
  const chartW = svgWidth - PAD_LEFT - PAD_RIGHT;
  const chartH = svgHeight - PAD_TOP - PAD_BOTTOM;

  const toX = (i) => PAD_LEFT + (i / Math.max(safeData.length - 1, 1)) * chartW;
  const toY = (v) => PAD_TOP + (1 - v) * chartH;
  const polylinePoints = safeData.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  const yValues = [1, 0.5, 0];
  const areaPath = buildAreaPath(safeData, toX, toY, toY(0));
  const lastIndex = Math.max(safeData.length - 1, 0);

  return (
    <View style={styles.wrapper}>
      <VideoPreviewCard width={83} showPlayIcon={true} />
      <View style={styles.chartContainer}>
        <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <Defs>
            <LinearGradient id="retentionFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#D500CA" stopOpacity="0.2" />
              <Stop offset="72%" stopColor="#D500CA" stopOpacity="0.04" />
              <Stop offset="100%" stopColor="#D500CA" stopOpacity="0" />
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

          <Path d={areaPath} fill="url(#retentionFill)" />

          {yLabels.map((label, i) => (
            <SvgText
              key={`ylabel-${i}`}
              x={PAD_LEFT - 6}
              y={toY(yValues[i]) + 4}
              textAnchor="end"
              fontSize={12}
              fontFamily="Inter_400Regular"
              fill={TEXT_GRAY}
            >
              {label}
            </SvgText>
          ))}

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

          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={IG_PINK}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <Circle
            cx={toX(lastIndex)}
            cy={toY(safeData[lastIndex] || 0)}
            r={6.5}
            fill="#FFFFFF"
            stroke={IG_PINK}
            strokeWidth={3}
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
