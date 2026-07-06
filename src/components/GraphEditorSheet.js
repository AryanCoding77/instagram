import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Polyline, Line, Text as SvgText, Circle, G, Rect } from "react-native-svg";
import { useReelData, DEFAULT_DATA } from "../context/ReelDataContext";

const IG_PINK = "#DD2A7B";
const GRAY = "#888888";
const GRID_COLOR = "#F5F5F5";
const TEXT_GRAY = "#8E8E8E";

const PAD_LEFT = 44;
const PAD_RIGHT = 12;
const PAD_TOP = 32;
const PAD_BOTTOM = 28;

export default function GraphEditorSheet({ visible, onClose }) {
  const { state, dispatch } = useReelData();
  const scrollRef = useRef(null);

  const [editorData, setEditorData] = useState(() =>
    JSON.parse(JSON.stringify(state.viewsOverTime))
  );
  const [activeLine, setActiveLine] = useState("thisReel");
  const [selectedPointIndex, setSelectedPointIndex] = useState(0);
  const [stepSize, setStepSize] = useState(500);
  const [editingLabelIndex, setEditingLabelIndex] = useState(null);
  const [editLabelText, setEditLabelText] = useState("");
  const [lastTap, setLastTap] = useState(null);

  // Format helpers
  const formatK = (n) => {
    if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
    return `${n}`;
  };

  const formatComma = (n) => n.toLocaleString();

  const getStepLabel = () => {
    if (stepSize === 100) return "+100";
    if (stepSize === 500) return "+500";
    if (stepSize === 1000) return "+1K";
    if (stepSize === 2500) return "+2.5K";
    return `+${stepSize}`;
  };

  const cycleStepSize = () => {
    if (stepSize === 100) setStepSize(500);
    else if (stepSize === 500) setStepSize(1000);
    else if (stepSize === 1000) setStepSize(2500);
    else setStepSize(100);
  };

  // Update point value
  const updatePointValue = useCallback((index, line, raw) => {
    const value = Math.max(0, Math.min(15000, Math.round(raw)));
    setEditorData((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [line]: value };
      return next;
    });
  }, []);

  // Handlers
  const handleReset = () => {
    setEditorData(JSON.parse(JSON.stringify(DEFAULT_DATA.viewsOverTime)));
    setActiveLine("thisReel");
    setSelectedPointIndex(0);
  };

  const handleDone = () => {
    dispatch({ type: "UPDATE_VIEWS_OVER_TIME", data: editorData });
    onClose();
  };

  const handleLineToggle = (line) => {
    setActiveLine(line);
    setSelectedPointIndex(0);
  };

  const handlePointSelect = (index) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300; // 300ms for double tap

    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY && index === selectedPointIndex) {
      // Double tap detected - open edit modal
      handleLabelEdit(index);
      setLastTap(null);
    } else {
      // Single tap - select point
      setSelectedPointIndex(index);
      setLastTap(now);
      
      // Auto-scroll to chip
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: index * 70, animated: true });
      }
    }
  };

  const handleIncrement = () => {
    const current = editorData[selectedPointIndex][activeLine];
    updatePointValue(selectedPointIndex, activeLine, current + stepSize);
  };

  const handleDecrement = () => {
    const current = editorData[selectedPointIndex][activeLine];
    updatePointValue(selectedPointIndex, activeLine, current - stepSize);
  };

  const handleLabelEdit = (index) => {
    setEditingLabelIndex(index);
    setEditLabelText(editorData[index].label);
  };

  const handleLabelSave = () => {
    if (editLabelText.trim()) {
      setEditorData((prev) => {
        const next = [...prev];
        next[editingLabelIndex] = { ...next[editingLabelIndex], label: editLabelText.trim() };
        return next;
      });
    }
    setEditingLabelIndex(null);
    setEditLabelText("");
  };

  const handleLabelCancel = () => {
    setEditingLabelIndex(null);
    setEditLabelText("");
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
          {/* Handle bar */}
          <View style={styles.handleBar} />

          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Views over time</Text>
              <TouchableOpacity onPress={handleDone}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>

        {/* Live Chart Preview */}
        <View style={styles.chartSection}>
          <LiveChartPreview
            data={editorData}
            activeLine={activeLine}
            selectedPointIndex={selectedPointIndex}
            onPointSelect={handlePointSelect}
          />
        </View>

        {/* Line Toggle Pills */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.pill,
              activeLine === "thisReel" && styles.pillActive,
            ]}
            onPress={() => handleLineToggle("thisReel")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.pillDot,
                activeLine === "thisReel"
                  ? styles.pillDotActiveThis
                  : { backgroundColor: IG_PINK },
              ]}
            />
            <Text
              style={[
                styles.pillText,
                activeLine === "thisReel" && styles.pillTextActive,
              ]}
            >
              This reel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pill,
              activeLine === "typicalReel" && styles.pillActive,
            ]}
            onPress={() => handleLineToggle("typicalReel")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.pillDot,
                activeLine === "typicalReel"
                  ? styles.pillDotActiveTypical
                  : { backgroundColor: GRAY },
              ]}
            />
            <Text
              style={[
                styles.pillText,
                activeLine === "typicalReel" && styles.pillTextActive,
              ]}
            >
              Typical reel
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Selected Point Editor */}
        <View style={styles.editorSection}>
          <View style={styles.editorRow}>
            <View>
              <Text style={styles.pointDate}>
                {editorData[selectedPointIndex].label}
              </Text>
              <Text style={styles.pointValue}>
                {formatComma(editorData[selectedPointIndex][activeLine])}
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
            <Text style={styles.sliderLabel}>0</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={15000}
              step={50}
              value={editorData[selectedPointIndex][activeLine]}
              onValueChange={(val) =>
                updatePointValue(selectedPointIndex, activeLine, val)
              }
              minimumTrackTintColor={IG_PINK}
              maximumTrackTintColor="#EBEBEB"
              thumbTintColor={IG_PINK}
            />
            <Text style={styles.sliderLabel}>15K</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Point Chip Scroll Row */}
        <View style={styles.chipSection}>
          <Text style={styles.chipHint}>Tap to select · Double tap to edit date</Text>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollContent}
            style={styles.chipScrollView}
          >
          {editorData.map((point, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                index === selectedPointIndex && styles.chipActive,
              ]}
              onPress={() => handlePointSelect(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipDate}>{point.label}</Text>
              <Text
                style={[
                  styles.chipValue,
                  index === selectedPointIndex && styles.chipValueActive,
                ]}
              >
                {formatK(point[activeLine])}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        </View>
          </View>
        </View>
      </View>

      {/* Label Edit Modal */}
      <Modal
        visible={editingLabelIndex !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={handleLabelCancel}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContainer}>
            <Text style={styles.editModalTitle}>Edit Date Label</Text>
            <TextInput
              style={styles.editModalInput}
              value={editLabelText}
              onChangeText={setEditLabelText}
              placeholder="e.g. 14 Jun"
              autoFocus={true}
              selectTextOnFocus={true}
            />
            <View style={styles.editModalButtons}>
              <TouchableOpacity
                style={[styles.editModalBtn, styles.editModalBtnCancel]}
                onPress={handleLabelCancel}
              >
                <Text style={styles.editModalBtnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editModalBtn, styles.editModalBtnSave]}
                onPress={handleLabelSave}
              >
                <Text style={styles.editModalBtnTextSave}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

// Live Chart Preview Component
function LiveChartPreview({ data, activeLine, selectedPointIndex, onPointSelect }) {
  const { width } = useWindowDimensions();
  const svgWidth = width - 32;
  const svgHeight = 180;
  const chartW = svgWidth - PAD_LEFT - PAD_RIGHT;
  const chartH = svgHeight - PAD_TOP - PAD_BOTTOM;

  const allValues = data.flatMap((d) => [d.thisReel, d.typicalReel]);
  const maxValue = Math.max(...allValues);
  const yMax = Math.ceil(maxValue / 5000) * 5000;

  const normalizeValue = (val) => (yMax === 0 ? 0 : val / yMax);

  const THIS_REEL = data.map((d) => normalizeValue(d.thisReel));
  const TYPICAL_REEL = data.map((d) => normalizeValue(d.typicalReel));

  const toX = (i) => PAD_LEFT + (i / (THIS_REEL.length - 1)) * chartW;
  const toY = (v) => PAD_TOP + (1 - v) * chartH;

  const buildPolylinePoints = (dataArray) =>
    dataArray.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  const formatYLabel = (val) => {
    if (val >= 1000) return `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K`;
    return String(val);
  };

  const Y_LABELS = [formatYLabel(yMax), formatYLabel(yMax / 2), "0"];
  const Y_VALS = [1, 0.5, 0];

  const activeData = activeLine === "thisReel" ? THIS_REEL : TYPICAL_REEL;
  const activeColor = activeLine === "thisReel" ? IG_PINK : GRAY;

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

      {/* Typical reel line (dashed gray) */}
      <Polyline
        points={buildPolylinePoints(TYPICAL_REEL)}
        fill="none"
        stroke={GRAY}
        strokeWidth={2.5}
        strokeDasharray="4,3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={activeLine === "typicalReel" ? 1 : 0.4}
      />

      {/* This reel line (solid pink) */}
      <Polyline
        points={buildPolylinePoints(THIS_REEL)}
        fill="none"
        stroke={IG_PINK}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={activeLine === "thisReel" ? 1 : 0.4}
      />

      {/* Interactive dots on active line */}
      {activeData.map((v, i) => {
        const isSelected = i === selectedPointIndex;
        const cx = toX(i);
        const cy = toY(v);

        return (
          <G key={`dot-${i}`} onPress={() => onPointSelect(i)}>
            {/* Touchable area */}
            <Rect
              x={cx - 10}
              y={cy - 10}
              width={20}
              height={20}
              fill="transparent"
            />

            {isSelected ? (
              <>
                {/* Selected dot: white with pink border + inner pink dot */}
                <Circle cx={cx} cy={cy} r={7} fill="white" stroke={activeColor} strokeWidth={2.5} />
                <Circle cx={cx} cy={cy} r={3} fill={activeColor} />
                
                {/* Tooltip above */}
                <G>
                  <Rect
                    x={cx - 20}
                    y={cy - 30}
                    width={40}
                    height={18}
                    rx={6}
                    fill={activeColor}
                  />
                  <SvgText
                    x={cx}
                    y={cy - 18}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight="700"
                    fill="white"
                  >
                    {data[i][activeLine].toLocaleString()}
                  </SvgText>
                  {/* Stem line */}
                  <Line x1={cx} y1={cy - 12} x2={cx} y2={cy - 7} stroke={activeColor} strokeWidth={2} />
                </G>
              </>
            ) : (
              <Circle cx={cx} cy={cy} r={4} fill={activeColor} />
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
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 99,
    borderWidth: 0.5,
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
    gap: 8,
  },
  pillActive: {
    backgroundColor: IG_PINK,
    borderColor: IG_PINK,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillDotActiveThis: {
    backgroundColor: "white",
  },
  pillDotActiveTypical: {
    backgroundColor: "white",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888",
    fontFamily: "Inter_500Medium",
  },
  pillTextActive: {
    color: "white",
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
    minWidth: 65,
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
  editModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  editModalContainer: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 20,
    width: "80%",
    maxWidth: 320,
  },
  editModalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
  },
  editModalInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
    marginBottom: 18,
    fontFamily: "Inter_500Medium",
  },
  editModalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  editModalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  editModalBtnCancel: {
    backgroundColor: "#F5F5F5",
  },
  editModalBtnSave: {
    backgroundColor: IG_PINK,
  },
  editModalBtnTextCancel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    fontFamily: "Inter_600SemiBold",
  },
  editModalBtnTextSave: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    fontFamily: "Inter_600SemiBold",
  },
});
