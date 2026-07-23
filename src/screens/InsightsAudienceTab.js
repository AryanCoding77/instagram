import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView } from "react-native";
import Svg, { Line, Polyline, Text as SvgText, Defs, LinearGradient, Stop, Path, Circle, Rect } from "react-native-svg";
import { Info } from "lucide-react-native";
import { C } from "../constants/colors";
import { useReelData } from "../context/ReelDataContext";
import EditableNumber from "../components/EditableNumber";
import EditableText from "../components/EditableText";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDE_PAD = 0;
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

const TOP_LOCATION_TABS = {
  Countries: TOP_LOCATIONS,
  "Towns/Cities": [
    { name: "Lahore", percent: 18.4 },
    { name: "Karachi", percent: 12.7 },
    { name: "Mumbai", percent: 8.9 },
    { name: "Johannesburg", percent: 6.1 },
    { name: "Cape Town", percent: 4.8 },
  ],
};

const ACTIVE_TIMES = [
  { day: "Su", value: 1 },
  { day: "M", value: 48 },
  { day: "Tu", value: 72 },
  { day: "W", value: 88 },
  { day: "Th", value: 82 },
  { day: "F", value: 96 },
  { day: "Sa", value: 74 },
  { day: "Su", value: 62 },
];

const ACTIVE_TIME_LABELS = ["12a", "3a", "6a", "9a", "12p", "3p", "6p", "9p"];

const TOP_TIMES = [
  { day: "Wednesdays", range: "15-18" },
  { day: "Thursdays", range: "15-18" },
  { day: "Saturdays", range: "15-18" },
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

function buildAreaPath(values, toX, toY, baselineY) {
  if (!values.length) return "";
  const startX = toX(0);
  const endX = toX(values.length - 1);
  const linePath = values.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");
  return `${linePath} L ${endX} ${baselineY} L ${startX} ${baselineY} Z`;
}

function AudienceGrowthPreview({ values }) {
  const chartWidth = SCREEN_WIDTH - 48;
  const chart = useMemo(() => buildChart(values, chartWidth, 132), [values, chartWidth]);
  const areaPath = useMemo(() => buildAreaPath(values, chart.toX, chart.toY, chart.toY(-44)), [chart, values]);
  const lastIndex = Math.max(values.length - 1, 0);

  return (
    <Svg width={chartWidth} height={132} viewBox={`0 0 ${chartWidth} 132`}>
      <Defs>
        <LinearGradient id="audienceGrowthFillPreview" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#D500CA" stopOpacity="0.18" />
          <Stop offset="72%" stopColor="#D500CA" stopOpacity="0.05" />
          <Stop offset="100%" stopColor="#D500CA" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect x={chart.padLeft - 8} y={chart.padTop - 8} width={chart.chartW + 10} height={chart.chartH + 10} rx={16} fill="#FBFBFD" />
      <Line x1={chart.padLeft} y1={chart.toY(44)} x2={chartWidth - chart.padRight} y2={chart.toY(44)} stroke="#EDEDED" strokeWidth={1} />
      <Line x1={chart.padLeft} y1={chart.toY(0)} x2={chartWidth - chart.padRight} y2={chart.toY(0)} stroke="#EDEDED" strokeWidth={1} />
      <Line x1={chart.padLeft} y1={chart.toY(-44)} x2={chartWidth - chart.padRight} y2={chart.toY(-44)} stroke="#EDEDED" strokeWidth={1} />
      <Path d={areaPath} fill="url(#audienceGrowthFillPreview)" />
      <Polyline points={chart.points} fill="none" stroke="#D500CA" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <Circle
        cx={chart.toX(lastIndex)}
        cy={chart.toY(values[lastIndex] || 0)}
        r={6.5}
        fill="#FFFFFF"
        stroke="#D500CA"
        strokeWidth={3}
      />
      <SvgText x={4} y={chart.toY(44) + 4} fontSize={11} fontFamily="Inter_400Regular" fill="#8E8E8E">
        44
      </SvgText>
      <SvgText x={4} y={chart.toY(0) + 4} fontSize={11} fontFamily="Inter_400Regular" fill="#8E8E8E">
        0
      </SvgText>
      <SvgText x={0} y={chart.toY(-44) + 4} fontSize={11} fontFamily="Inter_400Regular" fill="#8E8E8E">
        -44
      </SvgText>
      <SvgText x={chart.padLeft} y={124} fontSize={11} fontFamily="Inter_400Regular" fill="#8E8E8E" textAnchor="start">
        May 23
      </SvgText>
      <SvgText x={chart.padLeft + chart.chartW / 2} y={124} fontSize={11} fontFamily="Inter_400Regular" fill="#8E8E8E" textAnchor="middle">
        Jun 4
      </SvgText>
      <SvgText x={chartWidth - chart.padRight} y={124} fontSize={11} fontFamily="Inter_400Regular" fill="#8E8E8E" textAnchor="end">
        Jun 17
      </SvgText>
    </Svg>
  );
}

function BarRow({ label, percent, color, trackRadius = 2, fillRadius = 2, labelGap = 8, rowGap = 14 }) {
  return (
    <View style={[styles.barBlock, { marginBottom: rowGap }]}>
      <Text style={[styles.barLabel, { marginBottom: labelGap }]}>{label}</Text>
      <View style={styles.barLineRow}>
        <View style={[styles.barTrack, { borderRadius: trackRadius }]}>
          <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color, borderRadius: fillRadius }]} />
        </View>
        <Text style={styles.barPercent}>{percent.toFixed(1)}%</Text>
      </View>
    </View>
  );
}

function EditablePercentRow({
  label,
  value,
  color,
  editable,
  onUpdateLabel,
  onUpdateValue,
  trackRadius = 2,
  fillRadius = 2,
  labelGap = 8,
  rowGap = 14,
}) {
  return (
    <View style={[styles.barBlock, { marginBottom: rowGap }]}>
      {editable && onUpdateLabel ? (
        <EditableText value={label} onSave={onUpdateLabel} style={[styles.barLabel, { marginBottom: labelGap }]} />
      ) : (
        <Text style={[styles.barLabel, { marginBottom: labelGap }]}>{label}</Text>
      )}
      <View style={styles.barLineRow}>
        <View style={[styles.barTrack, { borderRadius: trackRadius }]}>
          <View
            style={[
              styles.barFill,
              { width: `${Math.max(value, 0)}%`, backgroundColor: color, borderRadius: fillRadius },
            ]}
          />
        </View>
        {editable && onUpdateValue ? (
          <EditableNumber value={value} onSave={onUpdateValue} style={styles.barPercent} suffix="%" />
        ) : (
          <Text style={styles.barPercent}>{value.toFixed(1)}%</Text>
        )}
      </View>
    </View>
  );
}

function AgeRangeRow({
  label,
  value,
  editable,
  onUpdateLabel,
  onUpdateValue,
}) {
  return (
    <View style={styles.ageRow}>
      {editable && onUpdateLabel ? (
        <EditableText value={label} onSave={onUpdateLabel} style={styles.ageLabel} />
      ) : (
        <Text style={styles.ageLabel}>{label}</Text>
      )}
      <View style={styles.ageLineRow}>
        <View style={styles.ageTrack}>
          <View style={styles.ageWomenFill} />
          <View style={styles.ageDivider} />
          <View style={[styles.ageMenFill, { width: `${Math.max(value - 2.2, 0)}%` }]} />
        </View>
        {editable && onUpdateValue ? (
          <EditableNumber
            value={value}
            onSave={onUpdateValue}
            style={styles.agePercent}
            suffix="%"
          />
        ) : (
          <Text style={styles.agePercent}>{value.toFixed(1)}%</Text>
        )}
      </View>
    </View>
  );
}

function LocationRow({ name, percent }) {
  return (
    <View style={styles.locationBlock}>
      <Text style={styles.locationLabel}>{name}</Text>
      <View style={styles.locationLineRow}>
        <View style={styles.locationTrack}>
          <View style={[styles.locationFill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.locationPercent}>{percent.toFixed(1)}%</Text>
      </View>
    </View>
  );
}

function AudienceGrowthEditor({ visible, values, onClose, onRandomize, onReset, onSaveValue }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.editorOverlay}>
        <View style={styles.editorSheet}>
          <View style={styles.editorHandle} />
          <View style={styles.editorHeader}>
            <TouchableOpacity activeOpacity={0.7} onPress={onReset ?? onClose} style={styles.editorHeaderTextBtn}>
              <Text style={styles.editorHeaderText}>Reset</Text>
            </TouchableOpacity>
            <Text style={styles.editorTitle}>Edit graph</Text>
            <View style={styles.editorHeaderRight}>
              <TouchableOpacity activeOpacity={0.7} onPress={onRandomize} style={styles.randomizeBtn}>
                <Text style={styles.randomizeText}>Randomize</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={styles.doneBtn}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.editorChartSection}>
            <AudienceGrowthPreview values={values} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.editorList}>
            {values.map((value, index) => (
              <View key={`audience-point-${index}`} style={styles.editorRow}>
                <Text style={styles.editorRowLabel}>Point {index + 1}</Text>
                <EditableNumber
                  value={value}
                  onSave={(nextValue) => onSaveValue(index, nextValue)}
                  style={styles.editorRowValue}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function InsightsAudienceTab() {
  const { state, dispatch } = useReelData();
  const chartWidth = SCREEN_WIDTH - 16;
  const [graphEditorVisible, setGraphEditorVisible] = useState(false);
  const [selectedLocationTab, setSelectedLocationTab] = useState("Countries");
  const [selectedActiveBar, setSelectedActiveBar] = useState(null);
  const activeBarTooltipAnim = useRef(ACTIVE_TIMES.map(() => new Animated.Value(0))).current;

  const womenPercent = Number(state.genderWomen ?? 14.4) || 0;
  const menPercent = Number(state.genderMen ?? 85.6) || 0;
  const audienceAgeRanges = Array.isArray(state.ageGroups) && state.ageGroups.length ? state.ageGroups : AGE_RANGES;
  const audienceGrowthValues = useMemo(
    () => (Array.isArray(state.audienceGrowthPoints) && state.audienceGrowthPoints.length ? state.audienceGrowthPoints : CHART_POINTS),
    [state.audienceGrowthPoints]
  );
  const chart = useMemo(() => buildChart(audienceGrowthValues, chartWidth, 130), [chartWidth, audienceGrowthValues]);
  const audienceLocations = useMemo(() => {
    const source = selectedLocationTab === "Towns/Cities"
      ? (state.topCities && state.topCities.length ? state.topCities : TOP_LOCATION_TABS["Towns/Cities"])
      : (state.countries && state.countries.length ? state.countries : TOP_LOCATIONS);
    if (Array.isArray(source) && source.length) {
      return source.map((item) => ({
        label: item.label || item.name,
        value: Number(item.value) || 0,
      }));
    }
    return (TOP_LOCATION_TABS[selectedLocationTab] || TOP_LOCATIONS).map((item) => ({
      label: item.name,
      value: item.percent,
    }));
  }, [selectedLocationTab, state.countries, state.topCities]);
  const activeTimes = Array.isArray(state.activeTimes) && state.activeTimes.length ? state.activeTimes : ACTIVE_TIMES;
  const activeBarHeights = useMemo(() => {
    const maxValue = Math.max(...activeTimes.map((item) => Number(item.value) || 0), 1);
    return activeTimes.map((item) => 56 + ((Number(item.value) || 0) / maxValue) * 100);
  }, [activeTimes]);

  useEffect(() => {
    activeTimes.forEach((_, index) => {
      Animated.timing(activeBarTooltipAnim[index], {
        toValue: selectedActiveBar === index ? 1 : 0,
        duration: selectedActiveBar === index ? 180 : 120,
        easing: selectedActiveBar === index ? Easing.out(Easing.cubic) : Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  }, [activeBarTooltipAnim, selectedActiveBar]);

  const randomizeAgeGroups = () => {
    dispatch({ type: "RANDOMIZE_AGE_GROUPS" });
  };

  const randomizeActiveTimes = () => {
    dispatch({ type: "RANDOMIZE_ACTIVE_TIMES" });
  };

  const randomizeGender = () => {
    dispatch({ type: "RANDOMIZE_GENDER" });
  };

  return (
    <View style={styles.content}>
      {state.isEditing ? (
        <EditableNumber
          value={state.followersCount ?? 6960}
          onSave={(val) =>
            dispatch({
              type: "UPDATE_FIELD",
              field: "followersCount",
              value: Math.max(0, parseInt(String(val).replace(/[^0-9]/g, ""), 10) || 0),
            })
          }
          style={styles.bigValue}
          formatDisplay={(n) => Number(n).toLocaleString()}
        />
      ) : (
        <Text style={styles.bigValue}>{Number(state.followersCount ?? 6960).toLocaleString()}</Text>
      )}
      <Text style={styles.growthText}>
        {state.followersGrowthChange ?? "+5.9%"} <Text style={styles.growthMuted}>since Jun 23</Text>
      </Text>

      <Text style={[styles.sectionTitle, styles.growthSectionTitle]}>Follower growth over time</Text>

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
        <Svg width={chartWidth} height={130} viewBox={`0 0 ${chartWidth} 130`}>
          <Defs>
            <LinearGradient id="audienceGrowthFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#D500CA" stopOpacity="0.18" />
              <Stop offset="72%" stopColor="#D500CA" stopOpacity="0.05" />
              <Stop offset="100%" stopColor="#D500CA" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect x={chart.padLeft - 8} y={chart.padTop - 8} width={chart.chartW + 10} height={chart.chartH + 10} rx={16} fill="#FBFBFD" />
          <Line x1={chart.padLeft} y1={chart.toY(44)} x2={chartWidth - chart.padRight} y2={chart.toY(44)} stroke="#EDEDED" strokeWidth={1} />
          <Line x1={chart.padLeft} y1={chart.toY(0)} x2={chartWidth - chart.padRight} y2={chart.toY(0)} stroke="#EDEDED" strokeWidth={1} />
          <Line x1={chart.padLeft} y1={chart.toY(-44)} x2={chartWidth - chart.padRight} y2={chart.toY(-44)} stroke="#EDEDED" strokeWidth={1} />
          <Path d={buildAreaPath(audienceGrowthValues, chart.toX, chart.toY, chart.toY(-44))} fill="url(#audienceGrowthFill)" />
          <Polyline points={chart.points} fill="none" stroke="#D500CA" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <Circle
            cx={chart.toX(audienceGrowthValues.length - 1)}
            cy={chart.toY(audienceGrowthValues[audienceGrowthValues.length - 1] || 0)}
            r={6.5}
            fill="#FFFFFF"
            stroke="#D500CA"
            strokeWidth={3}
          />

          <SvgText x={4} y={chart.toY(44) + 4} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E">
            44
          </SvgText>
          <SvgText x={4} y={chart.toY(0) + 4} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E">
            0
          </SvgText>
          <SvgText x={0} y={chart.toY(-44) + 4} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E">
            -44
          </SvgText>
          <SvgText x={chart.padLeft} y={124} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E" textAnchor="start">
            May 23
          </SvgText>
          <SvgText x={chart.padLeft + chart.chartW / 2} y={124} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E" textAnchor="middle">
            Jun 4
          </SvgText>
          <SvgText x={chartWidth - chart.padRight} y={124} fontSize={12} fontFamily="Inter_400Regular" fill="#8E8E8E" textAnchor="end">
            Jun 17
          </SvgText>
        </Svg>
      </View>
      {state.isEditing ? (
        <TouchableOpacity activeOpacity={0.7} onPress={() => setGraphEditorVisible(true)} style={styles.editGraphBtn}>
          <Text style={styles.editGraphText}>Edit graph</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.genderHeader}>
        <Text style={styles.sectionTitle}>Gender</Text>
        <Info size={16} color={C.black} strokeWidth={2.1} />
        {state.isEditing ? (
          <TouchableOpacity activeOpacity={0.7} onPress={randomizeGender} style={styles.randomizeBtn}>
            <Text style={styles.randomizeText}>Randomize</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {state.isEditing ? (
        <EditablePercentRow
          label="Women"
          value={womenPercent}
          color="#D500CA"
          editable
          onUpdateLabel={(newLabel) => dispatch({ type: "UPDATE_FIELD", field: "genderWomenLabel", value: newLabel })}
          onUpdateValue={(newVal) =>
            dispatch({
              type: "UPDATE_FIELD",
              field: "genderWomen",
              value: Math.max(0, parseFloat(String(newVal).replace(/[^0-9.]/g, "")) || 0),
            })
          }
          trackRadius={2}
          fillRadius={2}
          labelGap={2}
          rowGap={8}
        />
      ) : (
        <BarRow label="Women" percent={womenPercent} color="#D500CA" trackRadius={2} fillRadius={2} labelGap={2} rowGap={8} />
      )}
      {state.isEditing ? (
        <EditablePercentRow
          label="Men"
          value={menPercent}
          color="#9D1090"
          editable
          onUpdateLabel={(newLabel) => dispatch({ type: "UPDATE_FIELD", field: "genderMenLabel", value: newLabel })}
          onUpdateValue={(newVal) =>
            dispatch({
              type: "UPDATE_FIELD",
              field: "genderMen",
              value: Math.max(0, parseFloat(String(newVal).replace(/[^0-9.]/g, "")) || 0),
            })
          }
          trackRadius={2}
          fillRadius={2}
          labelGap={2}
          rowGap={8}
        />
      ) : (
        <BarRow label="Men" percent={menPercent} color="#9D1090" trackRadius={2} fillRadius={2} labelGap={2} rowGap={8} />
      )}

      <View style={styles.ageHeader}>
        <Text style={styles.sectionTitle}>Age range</Text>
        <Info size={16} color={C.black} strokeWidth={2.1} />
        {state.isEditing ? (
          <TouchableOpacity activeOpacity={0.7} onPress={randomizeAgeGroups} style={styles.randomizeBtn}>
            <Text style={styles.randomizeText}>Randomize</Text>
          </TouchableOpacity>
        ) : null}
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
        {audienceAgeRanges.map((group, index) =>
          state.isEditing ? (
            <AgeRangeRow
              key={group.label}
              label={group.label}
              value={Number(group.value) || 0}
              editable
              onUpdateLabel={(newLabel) =>
                dispatch({
                  type: "UPDATE_AGE_GROUP",
                  index,
                  updates: { label: newLabel },
                })
              }
              onUpdateValue={(newVal) =>
                dispatch({
                  type: "UPDATE_AGE_GROUP",
                  index,
                  updates: { value: Math.max(0, parseFloat(String(newVal).replace(/[^0-9.]/g, "")) || 0) },
                })
              }
            />
          ) : (
            <AgeRangeRow key={group.label} label={group.label} value={Number(group.value) || 0} />
          )
        )}
      </View>

      <View style={styles.locationsHeader}>
        <Text style={styles.sectionTitle}>Top locations</Text>
        <Info size={16} color={C.black} strokeWidth={2.1} />
      </View>

      <View style={styles.locationTabs}>
        {["Countries", "Towns/Cities"].map((tab) => {
          const active = selectedLocationTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.7}
              style={[styles.locationTab, active && styles.locationTabActive]}
              onPress={() => setSelectedLocationTab(tab)}
            >
              <Text style={[styles.locationTabText, active && styles.locationTabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.locationsList}>
        {audienceLocations.map((location, index) =>
          state.isEditing ? (
            <View key={`${location.label}-${index}`} style={styles.locationBlock}>
              <EditableText
                value={location.label}
                onSave={(newLabel) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: selectedLocationTab === "Towns/Cities" ? "topCities" : "countries",
                    value: audienceLocations.map((item, itemIndex) =>
                      itemIndex === index
                        ? {
                            ...item,
                            label: newLabel,
                            name: newLabel,
                          }
                        : item
                    ),
                  })
                }
                style={styles.locationLabel}
              />
              <View style={styles.locationLineRow}>
                <View style={styles.locationTrack}>
                  <View style={[styles.locationFill, { width: `${location.value}%` }]} />
                </View>
                <EditableNumber
                  value={location.value}
                  onSave={(newVal) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: selectedLocationTab === "Towns/Cities" ? "topCities" : "countries",
                      value: audienceLocations.map((item, itemIndex) =>
                        itemIndex === index
                          ? {
                              ...item,
                              value: Math.max(0, parseFloat(String(newVal).replace(/[^0-9.]/g, "")) || 0),
                            }
                          : item
                      ),
                    })
                  }
                  style={styles.locationPercent}
                  suffix="%"
                />
              </View>
            </View>
          ) : (
            <LocationRow key={`${location.label}-${index}`} name={location.label} percent={location.value} />
          )
        )}
      </View>

      <View style={styles.activeTimesHeader}>
        <Text style={styles.sectionTitle}>Follower active times</Text>
        <Info size={16} color={C.black} strokeWidth={2.1} />
        {state.isEditing ? (
          <TouchableOpacity activeOpacity={0.7} onPress={randomizeActiveTimes} style={styles.randomizeBtn}>
            <Text style={styles.randomizeText}>Randomize</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.activeDayRow}>
        {(activeTimes || []).map((item, index) => {
          const active = index === 0;
          return (
            <View key={`${item.day}-${index}`} style={[styles.activeDayChip, active && styles.activeDayChipActive]}>
              <Text style={[styles.activeDayChipText, active && styles.activeDayChipTextActive]}>{item.day}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.activeBars}>
        {activeTimes.map((item, index) => {
          const heights = activeBarHeights;
          const active = selectedActiveBar === index;
          const dimmed = selectedActiveBar !== null && !active;
          return (
            <TouchableOpacity
              key={`${item.day}-${index}`}
              activeOpacity={0.85}
              onPress={() => setSelectedActiveBar((current) => (current === index ? null : index))}
              style={styles.activeBarItem}
            >
              <View
                style={[
                  styles.activeBar,
                  { height: heights[index], backgroundColor: dimmed ? "#E6E7EE" : "#D500CA" },
                ]}
              />
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.activeBarTooltipWrap,
                  { bottom: heights[index] + 44 },
                  {
                    opacity: activeBarTooltipAnim[index],
                    transform: [
                      {
                        scale: activeBarTooltipAnim[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.84, 1],
                        }),
                      },
                      {
                        translateY: activeBarTooltipAnim[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [6, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.activeBarTooltip}>
                  <Text style={styles.activeBarTooltipText}>{item.value}</Text>
                </View>
                <View style={styles.activeBarTooltipArrow} />
              </Animated.View>
              <Text style={styles.activeTimeLabel}>{ACTIVE_TIME_LABELS[index]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.topTimesSection}>
        <Text style={styles.topTimesTitle}>Top times</Text>
        {(state.topTimes && state.topTimes.length ? state.topTimes : TOP_TIMES).map((item, index, list) => (
          <View
            key={item.day}
            style={[styles.topTimesItem, index === list.length - 1 && styles.topTimesItemLast]}
          >
            {state.isEditing ? (
              <EditableText
                value={item.day}
                onSave={(newDay) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: "topTimes",
                    value: (state.topTimes && state.topTimes.length ? state.topTimes : TOP_TIMES).map((row, rowIndex) =>
                      rowIndex === index ? { ...row, day: newDay } : row
                    ),
                  })
                }
                style={styles.topTimesDay}
              />
            ) : (
              <Text style={styles.topTimesDay}>{item.day}</Text>
            )}
            {state.isEditing ? (
              <EditableText
                value={item.range}
                onSave={(newRange) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: "topTimes",
                    value: (state.topTimes && state.topTimes.length ? state.topTimes : TOP_TIMES).map((row, rowIndex) =>
                      rowIndex === index ? { ...row, range: newRange } : row
                    ),
                  })
                }
                style={styles.topTimesRange}
              />
            ) : (
              <Text style={styles.topTimesRange}>{item.range}</Text>
            )}
          </View>
        ))}
      </View>

      <AudienceGrowthEditor
        visible={graphEditorVisible}
        values={audienceGrowthValues}
        onClose={() => setGraphEditorVisible(false)}
        onRandomize={() => dispatch({ type: "RANDOMIZE_AUDIENCE_GROWTH" })}
        onReset={() => dispatch({ type: "RESET_AUDIENCE_GROWTH" })}
        onSaveValue={(index, nextValue) =>
          dispatch({
            type: "UPDATE_AUDIENCE_GROWTH",
            index,
            value: Math.max(-44, Math.min(44, parseFloat(String(nextValue).replace(/[^0-9.-]/g, "")) || 0)),
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SIDE_PAD,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: C.white,
  },
  bigValue: {
    fontSize: 28,
    lineHeight: 32,
    color: C.black,
    fontFamily: "Inter_500Medium",
    marginBottom: 2,
  },
  growthText: {
    fontSize: 10,
    color: "#16A34A",
    fontFamily: "Inter_500Medium",
    marginBottom: 28,
  },
  growthMuted: {
    color: "#777777",
    fontFamily: "Inter_400Regular",
  },
  sectionTitle: {
    fontSize: 15,
    color: C.black,
    fontFamily: "Inter_500Medium",
  },
  growthSectionTitle: {
    marginTop: 0,
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
    fontSize: 11,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  filterTextActive: {
    fontFamily: "Inter_500Medium",
  },
  chartWrap: {
    marginTop: 50,
    marginBottom: 28,
  },
  editGraphBtn: {
    alignSelf: "flex-start",
    marginTop: -6,
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DD2A7B",
    backgroundColor: "#FFF8FD",
  },
  editGraphText: {
    fontSize: 12,
    color: "#DD2A7B",
    fontFamily: "Inter_600SemiBold",
  },
  genderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  randomizeBtn: {
    marginLeft: "auto",
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    backgroundColor: "#F7F7F9",
    alignItems: "center",
    justifyContent: "center",
  },
  randomizeText: {
    fontSize: 11,
    color: C.black,
    fontFamily: "Inter_500Medium",
  },
  barLabel: {
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  barLineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  barPercent: {
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_400Regular",
    width: 52,
    textAlign: "right",
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 2,
    backgroundColor: "#F4F5F8",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
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
    fontSize: 10,
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
  },
  ageRow: {
    marginBottom: 16,
  },
  ageLabel: {
    fontSize: 11,
    color: C.black,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  ageLineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  agePercent: {
    fontSize: 11,
    color: C.black,
    fontFamily: "Inter_400Regular",
    width: 52,
    textAlign: "right",
  },
  ageTrack: {
    flex: 1,
    flexDirection: "row",
    height: 8,
    borderRadius: 2,
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
    fontSize: 11,
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
    marginTop: 8,
    marginBottom: 8,
  },
  activeDayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 2,
  },
  activeDayChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 11,
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
    width: "100%",
    alignSelf: "stretch",
    height: 240,
    paddingHorizontal: 4,
    paddingBottom: 0,
    marginBottom: 0,
    columnGap: 6,
  },
  activeBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    position: "relative",
  },
  activeBarTooltipWrap: {
    position: "absolute",
    left: "50%",
    marginLeft: -26,
    alignItems: "center",
    justifyContent: "flex-start",
    width: 52,
    zIndex: 3,
    elevation: 4,
  },
  activeBarTooltip: {
    minWidth: 44,
    minHeight: 36,
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 9,
    borderRadius: 12,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  activeBarTooltipArrow: {
    width: 12,
    height: 12,
    marginTop: -6,
    backgroundColor: C.white,
    transform: [{ rotate: "45deg" }],
    borderBottomRightRadius: 2,
  },
  activeBarTooltipText: {
    fontSize: 11,
    color: C.black,
    fontFamily: "Inter_500Medium",
  },
  activeBar: {
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#D500CA",
    marginBottom: 8,
    zIndex: 1,
  },
  activeTimeLabel: {
    width: "100%",
    textAlign: "center",
    fontSize: 9,
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
    zIndex: 1,
  },
  topTimesSection: {
    marginTop: 18,
    paddingBottom: 0,
  },
  topTimesTitle: {
    fontSize: 14,
    color: C.black,
    fontFamily: "Inter_500Medium",
    marginBottom: 10,
  },
  topTimesItem: {
    marginBottom: 14,
  },
  topTimesItemLast: {
    marginBottom: 0,
  },
  topTimesDay: {
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_400Regular",
    marginBottom: 3,
  },
  topTimesRange: {
    fontSize: 11,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  editorOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.34)",
    justifyContent: "flex-end",
  },
  editorSheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    maxHeight: "82%",
  },
  editorHandle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
    marginBottom: 12,
  },
  editorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  editorHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editorHeaderTextBtn: {
    minWidth: 42,
    alignItems: "flex-start",
  },
  editorHeaderText: {
    fontSize: 14,
    color: C.black,
    fontFamily: "Inter_400Regular",
  },
  editorTitle: {
    fontSize: 15,
    color: C.black,
    fontFamily: "Inter_600SemiBold",
  },
  editorChartSection: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  doneBtn: {
    minHeight: 30,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  doneText: {
    fontSize: 12,
    color: C.black,
    fontFamily: "Inter_500Medium",
  },
  editorList: {
    paddingBottom: 12,
  },
  editorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  editorRowLabel: {
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_500Medium",
  },
  editorRowValue: {
    fontSize: 15,
    color: C.black,
    fontFamily: "Inter_500Medium",
    textAlign: "right",
  },
  locationsList: {
    paddingBottom: 24,
  },
  locationBlock: {
    marginBottom: 14,
  },
  locationLabel: {
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  locationLineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  locationPercent: {
    fontSize: 13,
    color: C.black,
    fontFamily: "Inter_400Regular",
    width: 52,
    textAlign: "right",
  },
  locationTrack: {
    flex: 1,
    height: 8,
    borderRadius: 2,
    backgroundColor: "#F4F5F8",
    overflow: "hidden",
  },
  locationFill: {
    height: "100%",
    backgroundColor: "#D500CA",
    borderRadius: 2,
  },
});
