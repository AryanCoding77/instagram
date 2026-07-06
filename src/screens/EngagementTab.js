import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { PenLine } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SectionHeading from "../components/SectionHeading";
import RetentionChart from "../components/RetentionChart";
import EditableNumber from "../components/EditableNumber";
import EngagementEditorSheet from "../components/EngagementEditorSheet";
import { useReelData } from "../context/ReelDataContext";

function SimpleRow({ label, value, field }) {
  const { state, dispatch } = useReelData();
  const editableRowBg = state.isEditing ? { backgroundColor: "#FFF8FD" } : {};

  return (
    <View style={[styles.row, editableRowBg]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <EditableNumber
        value={value}
        onSave={(val) => {
          const num = parseInt(val) || 0;
          dispatch({ type: "UPDATE_FIELD", field, value: num });
        }}
        style={styles.rowValue}
      />
    </View>
  );
}

export default function EngagementTab() {
  const { state } = useReelData();
  const [engagementEditorVisible, setEngagementEditorVisible] = useState(false);

  const ACTION_ROWS = [
    { label: "Profile visits", field: "profileVisits", value: state.profileVisits },
    { label: "Follows", field: "follows", value: state.follows },
  ];

  const INTERACTION_ROWS = [
    { label: "Likes", field: "likes", value: state.likes },
    { label: "Comments", field: "comments", value: state.comments },
    { label: "Reposts", field: "reposts", value: state.reposts },
    { label: "Shares", field: "shares", value: state.shares },
    { label: "Saves", field: "saves", value: state.saves },
  ];

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
      {/* Actions after viewing */}
      <View style={styles.section}>
        <SectionHeading title="Actions after viewing" />
        {ACTION_ROWS.map((r, i) => (
          <SimpleRow key={i} label={r.label} value={r.value} field={r.field} />
        ))}
      </View>

      {/* Interactions */}
      <View style={styles.section}>
        <SectionHeading title="Interactions" />
        {INTERACTION_ROWS.map((r, i) => (
          <SimpleRow key={i} label={r.label} value={r.value} field={r.field} />
        ))}
      </View>

      {/* When people liked */}
      <View style={[styles.section, styles.lastSection]}>
        <SectionHeading title="When people liked your reel" />
        {state.isEditing && (
          <TouchableOpacity
            style={styles.editGraphBtn}
            onPress={() => setEngagementEditorVisible(true)}
            activeOpacity={0.7}
          >
            <PenLine size={16} color="#DD2A7B" strokeWidth={2} />
            <Text style={styles.editGraphText}>Edit graph</Text>
          </TouchableOpacity>
        )}
        <View style={[
          styles.chartWrapper,
          engagementEditorVisible && state.isEditing && styles.chartHighlighted
        ]}>
          <RetentionChart
            data={state.engagementPoints.map(v => v / 20)} // Normalize to 0-1 for display
            yLabels={["20%", "10%", "0"]}
            xStart="0:00"
            xEnd={`0:${state.videoDuration.toString().padStart(2, '0')}`}
          />
        </View>
      </View>

      {/* Engagement Editor Sheet */}
      <EngagementEditorSheet
        visible={engagementEditorVisible}
        onClose={() => setEngagementEditorVisible(false)}
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#111111",
  },
  rowValue: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
  },
  chartWrapper: {
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "transparent",
  },
  chartHighlighted: {
    borderWidth: 1.5,
    borderColor: "#DD2A7B",
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
    marginTop: 8,
    marginBottom: 8,
  },
  editGraphText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#DD2A7B",
    fontFamily: "Inter_500Medium",
  },
  lastSection: {
    paddingBottom: 60,
  },
});
