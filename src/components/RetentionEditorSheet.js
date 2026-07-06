import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Modal,
  TextInput,
} from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Polyline, Line, Text as SvgText, Circle, G, Rect } from "react-native-svg";
import { useReelData, DEFAULT_DATA } from "../context/ReelDataContext";

const IG_PINK = "#DD2A7B";
const GRID_COLOR = "#F5F5F5";
const TEXT_GRAY = "#8E8E8E";

const PAD_LEFT = 44;
const PAD_RIGHT = 12;
const PAD_TOP = 32;
const PAD_BOTTOM = 28;

export default function RetentionEditorSheet({ visible, onClose }) {
  const { state, dispatch } = useReelData();
  const scrollRef = useRef(null);

  const [editorData, setEditorData] = useState(() => [...state.retentionPoints]);
  const [videoDuration, setVideoDuration] = useState(state.videoDuration);
  const [selectedPointIndex, setSelectedPointIndex] = useState(0);
  const [stepSize, setStepSize] = useState(5);
  const [lastTap, setLastTap] = useState(null);

  // Format helpers
  const formatPercent = (n) => `${Math.round(n)}%`;

  const getStepLabel = () => {
    if (stepSize === 1) return "+1%";
    if (stepSize === 5) return "+5%";
    if (stepSize === 10) return "+10%";
    return `+${stepSize}%`;
  };

  const cycleStepSize = () => {
    if (stepSize === 1) setStepSize(5);
    else if (stepSize === 5) setStepSize(10);
    else setStepSize(1);
  };

  // Update point value
  const updatePointValue = (index, raw) => {
    const value = Math.max(0, Math.min(100, Math.round(raw)));
    setEditorData((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  // Handlers
  const handleReset = () => {
    setEditorData([...DEFAULT_DATA.retentionPoints]);
    setVideoDuration(DEFAULT_DATA.videoDuration);
    setSelectedPointIndex(0);
  };

  const handleDone = () => {
    dispatch({ type: "UPDATE_RETENTION", data: editorData, duration: videoDuration });
    onClose();
  };

  const handlePointSelect = (index) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY && index === selectedPointIndex) {
      // Double tap - for future features
      setLastTap(null);
    } else {
      setSelectedPointIndex(index);
      setLastTap(now);
      
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: index * 65, animated: true });
      }
    }
  };

  const handleIncrement = () => {
    const current = editorData[selectedPointIndex];
    updatePointValue(selectedPointIndex, current + stepSize);
  };

  const handleDecrement = () => {
    const current = editorData[selectedPointIndex];
    updatePointValue(selectedPointIndex, current - stepSize);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.handleBar} />

          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Retention curve</Text>
              <TouchableOpacity onPress={handleDone}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>

        {/* Live Chart Preview */}
        <View style={styles.chartSection}>
          <RetentionChartPreview
            data={editorData}
            duration={videoDuration}
            selectedPointIndex={selectedPointIndex}
            onPointSelect={handlePointSelect}
          />
        </View>

        <View style={styles.divider} />

        {/* Selected Point Editor */}
        <View style={styles.editorSection}>
          <View style={styles.editorRow}>
            <View>
              <Text style={styles.pointDate}>
                Point {selectedPointIndex + 1} of {editorData.length}
              </Text>
              <Text style={styles.pointValue}>
                {formatPercent(editorData[selectedPointIndex])}
              </Text>
            </View>

            {/* Stepper */}
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={handleDecrement}
                activeOpacity={0.7}
              >
                <Text style={styles.stepperBtnText}>−</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stepperLabel}
                onPress={cycleStepSize}
                activeOpacity={0.7}
              >
                <Text style={styles.stepperLabelText}>{getStepLabel()}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={handleIncrement}
                activeOpacity={0.7}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Slider */}
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>0%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={editorData[selectedPointIndex]}
              onValueChange={(val) => updatePointValue(selectedPointIndex, val)}
              minimumTrackTintColor={IG_PINK}
              maximumTrackTintColor="#EBEBEB"
              thumbTintColor={IG_PINK}
            />
            <Text style={styles.sliderLabel}>100%</Text>
          </View>

          {/* Video Duration */}
          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Video duration:</Text>
            <TextInput
              style={styles.durationInput}
              value={videoDuration.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 0;
                setVideoDuration(Math.max(1, Math.min(180, num)));
              }}
              keyboardType="numeric"
              selectTextOnFocus={true}
            />
            <Text style={styles.durationUnit}>seconds</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Point Chip Scroll Row */}
        <View style={styles.chipSection}>
          <Text style={styles.chipHint}>Tap a point to edit its retention</Text>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollContent}
            style={styles.chipScrollView}
          >
          {editorData.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                index === selectedPointIndex && styles.chipActive,
              ]}
              onPress={() => handlePointSelect(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipDate}>#{index + 1}</Text>
              <Text
                style={[
                  styles.chipValue,
                  index === selectedPointIndex && styles.chipValueActive,
                ]}
              >
                {formatPercent(value)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Retention Chart Preview Component
function RetentionChartPreview({ data, duration, selectedPointIndex, onPointSelect }) {
  const { width } = useWindowDimensions();
  const svgWidth = width - 32;
  const svgHeight = 180;
  const chartW = svgWidth - PAD_LEFT - PAD_RIGHT;
  const chartH = svgHeight - PAD_TOP - PAD_BOTTOM;

  const normalizeValue = (val) => val / 100;
  const normalizedData = data.map(normalizeValue);

  const toX = (i) => PAD_LEFT + (i / (normalizedData.length - 1)) * chartW;
  const toY = (v) => PAD_TOP + (1 - v) * chartH;

  const buildPolylinePoints = () =>
    normalizedData.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  const Y_LABELS = ["100%", "50%", "0"];
  const Y_VALS = [1, 0.5, 0];

  return (
    <Svg width={svgWidth} height={svgHeight}>
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
          fontSize={11}
          fill={TEXT_GRAY}
        >
          {label}
        </SvgText>
      ))}

      {/* X axis labels */}
      <SvgText
        x={PAD_LEFT}
        y={svgHeight - 6}
        textAnchor="start"
        fontSize={11}
        fill={TEXT_GRAY}
      >
        0:00
      </SvgText>
      <SvgText
        x={svgWidth - PAD_RIGHT}
        y={svgHeight - 6}
        textAnchor="end"
        fontSize={11}
        fill={TEXT_GRAY}
      >
        0:{duration.toString().padStart(2, '0')}
      </SvgText>

      {/* Retention curve */}
      <Polyline
        points={buildPolylinePoints()}
        fill="none"
        stroke={IG_PINK}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Interactive dots */}
      {normalizedData.map((v, i) => {
        const isSelected = i === selectedPointIndex;
        const cx = toX(i);
        const cy = toY(v);

        return (
          <G key={`dot-${i}`} onPress={() => onPointSelect(i)}>
            <Rect
              x={cx - 10}
              y={cy - 10}
              width={20}
              height={20}
              fill="transparent"
            />

            {isSelected ? (
              <>
                <Circle cx={cx} cy={cy} r={7} fill="white" stroke={IG_PINK} strokeWidth={2.5} />
                <Circle cx={cx} cy={cy} r={3} fill={IG_PINK} />
                
                {/* Tooltip */}
                <G>
                  <Rect
                    x={cx - 22}
                    y={cy - 30}
                    width={44}
                    height={18}
                    rx={6}
                    fill={IG_PINK}
                  />
                  <SvgText
                    x={cx}
                    y={cy - 18}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight="700"
                    fill="white"
                  >
                    {Math.round(data[i])}%
                  </SvgText>
                  <Line x1={cx} y1={cy - 12} x2={cx} y2={cy - 7} stroke={IG_PINK} strokeWidth={2} />
                </G>
              </>
            ) : (
              <Circle cx={cx} cy={cy} r={4} fill={IG_PINK} />
            )}
          </G>
        );
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: "80%",
    paddingTop: 10,
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: "#DEDEDE",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EFEFEF",
  },
  resetText: {
    fontSize: 14,
    color: TEXT_GRAY,
    fontFamily: "Inter_400Regular",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    fontFamily: "Inter_600SemiBold",
  },
  doneText: {
    fontSize: 14,
    fontWeight: "600",
    color: IG_PINK,
    fontFamily: "Inter_600SemiBold",
  },
  chartSection: {
    height: 180,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  divider: {
    height: 0.5,
    backgroundColor: "#EFEFEF",
    marginHorizontal: 16,
  },
  editorSection: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  editorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  pointDate: {
    fontSize: 11,
    color: TEXT_GRAY,
    marginBottom: 3,
    fontFamily: "Inter_400Regular",
  },
  pointValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    fontFamily: "Inter_700Bold",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  stepperBtnText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#888",
  },
  stepperLabel: {
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperLabelText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111",
    fontFamily: "Inter_500Medium",
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  sliderLabel: {
    fontSize: 11,
    color: "#C0C0C0",
    fontFamily: "Inter_400Regular",
  },
  slider: {
    flex: 1,
    height: 40,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  durationLabel: {
    fontSize: 13,
    color: TEXT_GRAY,
    fontFamily: "Inter_500Medium",
  },
  durationInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    minWidth: 50,
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
  },
  durationUnit: {
    fontSize: 13,
    color: TEXT_GRAY,
    fontFamily: "Inter_400Regular",
  },
  chipHint: {
    fontSize: 11,
    color: "#AAAAAA",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    fontFamily: "Inter_400Regular",
  },
  chipSection: {
    maxHeight: 95,
  },
  chipScrollView: {
    maxHeight: 70,
  },
  chipScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12,
    paddingTop: 8,
    alignItems: "center",
  },
  chip: {
    flexShrink: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#E8E8E8",
    backgroundColor: "white",
    gap: 3,
    minWidth: 60,
    height: 56,
  },
  chipActive: {
    borderWidth: 1.5,
    borderColor: IG_PINK,
    backgroundColor: "#FFF0F7",
  },
  chipDate: {
    fontSize: 10,
    color: "#AAAAAA",
    fontFamily: "Inter_400Regular",
  },
  chipValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    fontFamily: "Inter_600SemiBold",
  },
  chipValueActive: {
    color: IG_PINK,
  },
});
