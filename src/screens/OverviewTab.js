import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  Send,
  Heart,
  Bookmark,
  MessageCircle,
  Plus,
  PenLine,
  ChevronRight,
  TrendingUp,
} from "lucide-react-native";
import RepostIcon from "../components/RepostIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SectionHeading from "../components/SectionHeading";
import StatCard from "../components/StatCard";
import SegmentedControl from "../components/SegmentedControl";
import DualLineChart from "../components/DualLineChart";
import RateRow from "../components/RateRow";
import RetentionChart from "../components/RetentionChart";
import HorizontalBarRow from "../components/HorizontalBarRow";
import SkipRateIcon from "../components/SkipRateIcon";
import EditableNumber from "../components/EditableNumber";
import EditableText from "../components/EditableText";
import GraphEditorSheet from "../components/GraphEditorSheet";
import RetentionEditorSheet from "../components/RetentionEditorSheet";
import SpinnerArc from "../components/SpinnerArc";
import { useReelData } from "../context/ReelDataContext";

function InsightsSkeletonBlock({ style }) {
  return <View style={[styles.skeletonBlock, style]} />;
}

function OverviewLoadingState({ hideTopHeading = false }) {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.container, styles.loadingContainer]}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={24}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        {!hideTopHeading && <SectionHeading title="Summary" />}
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <View style={styles.card}>
              <InsightsSkeletonBlock style={styles.skeletonLabel} />
              <InsightsSkeletonBlock style={styles.skeletonValueWide} />
            </View>
            <View style={styles.card}>
              <InsightsSkeletonBlock style={styles.skeletonLabel} />
              <InsightsSkeletonBlock style={styles.skeletonValueTall} />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.card}>
              <InsightsSkeletonBlock style={styles.skeletonLabel} />
              <InsightsSkeletonBlock style={styles.skeletonValueWide} />
            </View>
            <View style={styles.card}>
              <InsightsSkeletonBlock style={styles.skeletonLabel} />
              <InsightsSkeletonBlock style={styles.skeletonValueShort} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Views over time" />
        <View style={styles.skeletonSegmentRow}>
          <InsightsSkeletonBlock style={styles.skeletonChipActive} />
          <InsightsSkeletonBlock style={styles.skeletonChip} />
          <InsightsSkeletonBlock style={styles.skeletonChipWide} />
        </View>
        <View style={styles.chartGap} />
        <View style={styles.chartContainer}>
          <InsightsSkeletonBlock style={styles.skeletonChart} />
        </View>
      </View>

      <View style={styles.loadingSpinnerRow}>
        <SpinnerArc
          size={50}
          strokeWidth={1}
          duration={950}
          segmentColors={["#F4F4F4", "#E5E5E5", "#D0D0D0", "#B9B9B9", "#A0A0A0", "#878787", "#6D6D6D", "#575757", "#404040"]}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

export default function OverviewTab({
  hideTopHeading = false,
  isLoading = false,
  loadingPhase = "ready",
}) {
  const { state, dispatch } = useReelData();
  const [viewsFilter, setViewsFilter] = useState("All");
  const [graphEditorVisible, setGraphEditorVisible] = useState(false);
  const [retentionEditorVisible, setRetentionEditorVisible] = useState(false);
  const [showViewsChart, setShowViewsChart] = useState(true);

  if (isLoading) {
    return <OverviewLoadingState hideTopHeading={hideTopHeading} />;
  }

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getIconForRate = (key) => {
    switch (key) {
      case "skip":
        return <SkipRateIcon size={56} color="#111111" />;
      case "share":
        return <Send size={20} color="#111111" strokeWidth={2.0} />;
      case "like":
        return <Heart size={20} color="#111111" strokeWidth={2.0} />;
      case "save":
        return <Bookmark size={20} color="#111111" strokeWidth={2.0} />;
      case "repost":
        return <RepostIcon size={20} color="#111111" />;
      case "comment":
        return (
          <View style={{ transform: [{ scaleX: -1 }] }}>
            <MessageCircle size={20} color="#111111" strokeWidth={2.0} />
          </View>
        );
      default:
        return <Heart size={20} color="#111111" strokeWidth={2.0} />;
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: state.isEditing ? 80 : 40 }
      ]}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={24}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary */}
      <View style={styles.section}>
        {!hideTopHeading && <SectionHeading title="Summary" />}
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <View style={[styles.card, state.isEditing && styles.editableCard]}>
              <Text style={styles.cardLabel}>Views</Text>
              <EditableNumber
                value={state.views}
                onSave={(val) => {
                  const num = parseInt(val) || 0;
                  dispatch({ type: "UPDATE_FIELD", field: "views", value: num });
                }}
                style={styles.cardValue}
                formatDisplay={formatNumber}
              />
            </View>
            <View style={[styles.card, state.isEditing && styles.editableCard]}>
              <Text style={styles.cardLabel}>Accounts reached</Text>
              <EditableNumber
                value={state.accountsReached}
                onSave={(val) => {
                  const num = parseInt(val) || 0;
                  dispatch({ type: "UPDATE_FIELD", field: "accountsReached", value: num });
                }}
                style={styles.cardValue}
                formatDisplay={formatNumber}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={[styles.card, state.isEditing && styles.editableCard]}>
              <Text style={styles.cardLabel}>Average watch time</Text>
              <EditableText
                value={state.avgWatchTime}
                onSave={(val) => {
                  dispatch({ type: "UPDATE_FIELD", field: "avgWatchTime", value: val });
                }}
                style={styles.cardValue}
              />
            </View>
            <View style={[styles.card, state.isEditing && styles.editableCard]}>
              <Text style={styles.cardLabel}>Follows</Text>
              <EditableNumber
                value={state.follows}
                onSave={(val) => {
                  const num = parseInt(val) || 0;
                  dispatch({ type: "UPDATE_FIELD", field: "follows", value: num });
                }}
                style={styles.cardValue}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Views over time */}
      {showViewsChart ? (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <SectionHeading title="Views over time" />
            {state.isEditing && (
              <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => setShowViewsChart(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.toggleBtnText}>Hide</Text>
              </TouchableOpacity>
            )}
          </View>
          <SegmentedControl
            options={["All", "Followers", "Non-followers"]}
            selected={viewsFilter}
            onChange={setViewsFilter}
          />
          <View style={styles.chartGap} />
          {state.isEditing && (
            <TouchableOpacity
              style={styles.editGraphBtn}
              onPress={() => setGraphEditorVisible(true)}
              activeOpacity={0.7}
            >
              <PenLine size={16} color="#DD2A7B" strokeWidth={2} />
              <Text style={styles.editGraphText}>Edit graph</Text>
            </TouchableOpacity>
          )}
          <View style={[
            styles.chartContainer,
            graphEditorVisible && state.isEditing && styles.chartHighlighted
          ]}>
            <DualLineChart data={state.viewsOverTime} />
          </View>
        </View>
      ) : (
        state.isEditing && (
          <View style={styles.hiddenSectionPlaceholder}>
            <Text style={styles.hiddenSectionText}>Views over time (hidden)</Text>
            <TouchableOpacity
              style={styles.showBtn}
              onPress={() => setShowViewsChart(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.showBtnText}>Show</Text>
            </TouchableOpacity>
          </View>
        )
      )}

      {/* What affects your views */}
      <View style={styles.section}>
        <SectionHeading
          title="What affects your views"
          subtext="Rates are listed in order of importance to reach."
        />
        {state.rates.map((row, i) => (
          <RateRow
            key={i}
            icon={getIconForRate(row.key)}
            label={row.label}
            value={row.value}
            index={i}
            onDelete={state.rates.length > 1 ? () => {} : null}
          />
        ))}
      </View>

      {/* How long people watched */}
      <View style={styles.section}>
        <SectionHeading title="How long people watched your reel" />
        {state.isEditing && (
          <TouchableOpacity
            style={styles.editGraphBtn}
            onPress={() => setRetentionEditorVisible(true)}
            activeOpacity={0.7}
          >
            <PenLine size={16} color="#DD2A7B" strokeWidth={2} />
            <Text style={styles.editGraphText}>Edit retention</Text>
          </TouchableOpacity>
        )}
        <View style={[
          styles.chartContainer,
          retentionEditorVisible && state.isEditing && styles.chartHighlighted
        ]}>
          <RetentionChart
            data={state.retentionPoints.map(p => p / 100)}
            yLabels={["100%", "50%", "0"]}
            xStart="0:00"
            xEnd={`0:${state.videoDuration.toString().padStart(2, '0')}`}
          />
        </View>
      </View>

      {/* Top sources of views */}
      <View style={[styles.section, styles.lastSection]}>
        <SectionHeading title="Top sources of views" />
        {state.topSources.map((src, i) => (
          <HorizontalBarRow
            key={i}
            label={src.name}
            percent={src.value}
            color="#d500ca"
            editable={true}
            compact
            labelFontSize={12}
            valueFontSize={12}
            wrapperMarginBottom={8}
            labelMarginBottom={3}
            trackHeight={7}
            trackMarginRight={6}
            valueWidth={42}
            paddingVertical={2}
            paddingHorizontal={2}
            onUpdateLabel={(newLabel) =>
              dispatch({
                type: "UPDATE_TOP_SOURCE",
                index: i,
                updates: { name: newLabel },
              })
            }
            onUpdateValue={(newVal) => {
              const num = parseFloat(newVal) || 0;
              dispatch({
                type: "UPDATE_TOP_SOURCE",
                index: i,
                updates: { value: num },
              });
            }}
            onDelete={
              state.topSources.length > 1
                ? () => dispatch({ type: "DELETE_TOP_SOURCE", index: i })
                : null
            }
            />
        ))}
        <Text style={styles.adHeading}>Ad</Text>
        <TouchableOpacity activeOpacity={0.75} style={styles.boostRow}>
          <TrendingUp size={18} color="#111111" strokeWidth={2.1} style={styles.boostIcon} />
          <Text style={styles.boostText}>Boost this Reel</Text>
          <ChevronRight size={14} color="#111111" strokeWidth={2} style={styles.boostArrow} />
        </TouchableOpacity>
        {state.isEditing && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => dispatch({ type: "ADD_TOP_SOURCE" })}
            activeOpacity={0.7}
          >
            <Plus size={16} color="#8E8E8E" strokeWidth={2} />
            <Text style={styles.addBtnText}>Add source</Text>
          </TouchableOpacity>
        )}
      </View>

      <GraphEditorSheet
        visible={graphEditorVisible}
        onClose={() => setGraphEditorVisible(false)}
      />

      <RetentionEditorSheet
        visible={retentionEditorVisible}
        onClose={() => setRetentionEditorVisible(false)}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  loadingContainer: {
    paddingBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleBtn: {
    backgroundColor: "#DD2A7B",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 99,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  hiddenSectionPlaceholder: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
    borderStyle: "dashed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hiddenSectionText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "#8E8E8E",
  },
  showBtn: {
    backgroundColor: "#DD2A7B",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 99,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  showBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  grid: {
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: "#F2F2F4",
    borderRadius: 12,
    padding: 14,
    minHeight: 80,
    justifyContent: "space-between",
  },
  editableCard: {
    backgroundColor: "#FFF8FD",
  },
  cardLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#7A7A7A",
    marginBottom: 6,
  },
  skeletonBlock: {
    backgroundColor: "#F2F2F4",
    borderRadius: 8,
  },
  skeletonLabel: {
    width: "44%",
    height: 11,
    marginBottom: 14,
  },
  skeletonValueWide: {
    width: "58%",
    height: 18,
  },
  skeletonValueTall: {
    width: "72%",
    height: 18,
  },
  skeletonValueShort: {
    width: "36%",
    height: 18,
  },
  cardValue: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
  },
  editGraphBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#DD2A7B",
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 6,
    height: 32,
    gap: 6,
    marginTop: 12,
    marginBottom: 8,
  },
  editGraphText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#DD2A7B",
    fontFamily: "Inter_500Medium",
  },
  chartContainer: {
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 8,
    marginTop: 4,
  },
  chartGap: {
    height: 14,
  },
  skeletonSegmentRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  skeletonChipActive: {
    width: 48,
    height: 32,
    borderRadius: 16,
  },
  skeletonChip: {
    width: 88,
    height: 32,
    borderRadius: 16,
  },
  skeletonChipWide: {
    width: 116,
    height: 32,
    borderRadius: 16,
  },
  skeletonChart: {
    width: "100%",
    height: 192,
    borderRadius: 12,
  },
  loadingSpinnerRow: {
    width: "100%",
    minHeight: 112,
    paddingTop: 22,
    paddingBottom: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  chartHighlighted: {
    borderWidth: 1.5,
    borderColor: "#DD2A7B",
  },
  lastSection: {
    paddingBottom: 60,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  addBtnText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#8E8E8E",
    marginLeft: 6,
  },
  adHeading: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
    marginTop: 6,
    marginBottom: 8,
  },
  boostRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  boostIcon: {
    marginRight: 8,
  },
  boostText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#111111",
    flex: 1,
  },
  boostArrow: {
    marginLeft: 6,
  },
});
