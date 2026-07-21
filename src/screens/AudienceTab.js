/**
 * AudienceTab - Displays audience demographics with editable data
 * 
 * BUG FIX (2024):
 * Previous issue: Audience details sub-tabs (Age/Country/Gender) were showing wrong datasets
 * - Age tab showed countries data (India, Brazil, etc.)
 * - Country tab showed age groups data (13-17, 18-24, etc.)
 * - Gender tab showed ageGroups[0].value instead of genderMen
 * 
 * Root causes fixed:
 * 1. KEY COLLISION: HorizontalBarRow used key={i} causing React to reuse nodes across different datasets
 *    Fix: Use stable unique keys per dataset - `age-${label}`, `country-${name}`, `gender-${label}`
 * 
 * 2. COMPONENT REMOUNTING: Added key={state.isEditing ? 'edit' : 'view'} to detailsContent
 *    to force clean remount when toggling edit mode
 * 
 * 3. GENDER TAB ISOLATION: Gender is now rendered separately from the shared list renderer
 *    to prevent it from accidentally pulling from ageGroups/countries arrays
 */

import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SectionHeading from "../components/SectionHeading";
import EditableNumber from "../components/EditableNumber";
import HorizontalBarRow from "../components/HorizontalBarRow";
import SegmentedControl from "../components/SegmentedControl";
import { useReelData } from "../context/ReelDataContext";

export default function AudienceTab({ hideTopHeading = false }) {
  const { state, dispatch } = useReelData();
  const [detailFilter, setDetailFilter] = useState("Age");

  const nonFollowersPercent = parseFloat((100 - state.followersPercent).toFixed(1));
  const womenPercent = parseFloat((100 - state.genderMen).toFixed(1));

  const VIEWER_SPLIT = [
    { label: "Followers", percent: state.followersPercent, color: "#d500ca", field: "followersPercent" },
    { label: "Non-followers", percent: nonFollowersPercent, color: "#7A2DBD", autoComputed: true },
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
      {/* Who viewed your reel */}
      <View style={styles.section}>
        {!hideTopHeading && <SectionHeading title="Who viewed your reel" />}
        <View style={styles.contentSpacing}>
          {VIEWER_SPLIT.map((row, i) => (
            <HorizontalBarRow
              key={`viewer-${row.label}`}
              label={row.label}
              percent={row.percent}
              color={row.color}
              layout="top"
              editable={!row.autoComputed}
              autoComputed={row.autoComputed}
              compact
              labelFontSize={12}
              labelMarginBottom={3}
              valueFontSize={12}
              valueWidth={42}
              trackHeight={7}
              trackMarginRight={6}
              wrapperMarginBottom={8}
              paddingVertical={2}
              paddingHorizontal={2}
              onUpdateValue={
                row.field
                  ? (newVal) => {
                      const num = parseFloat(newVal) || 0;
                      dispatch({ type: "UPDATE_FIELD", field: row.field, value: num });
                    }
                  : null
              }
            />
          ))}
        </View>
      </View>

      {/* Audience details */}
      <View style={[styles.section, styles.lastSection]}>
        <SectionHeading title="Audience details" />
        <SegmentedControl
          options={["Age", "Country", "Gender"]}
          selected={detailFilter}
          onChange={setDetailFilter}
        />
        
        {/* Force remount when edit mode toggles */}
        <View 
          key={state.isEditing ? 'edit' : 'view'} 
          style={styles.detailsContent}
        >
          {/* AGE TAB */}
          {detailFilter === "Age" && (
            <>
              {state.ageGroups.map((ageGroup, index) => (
              <HorizontalBarRow
                key={`age-${ageGroup.label}-${index}`}
                label={ageGroup.label}
                percent={ageGroup.value}
                color="#d500ca"
                layout="top"
                editable={true}
                compact
                labelFontSize={12}
                labelMarginBottom={1}
                valueFontSize={12}
                valueWidth={42}
                trackHeight={7}
                trackMarginRight={6}
                trackRadius={1}
                fillRadius={1}
                wrapperMarginBottom={4}
                paddingVertical={0}
                paddingHorizontal={2}
                onUpdateLabel={(newLabel) =>
                  dispatch({
                    type: "UPDATE_AGE_GROUP",
                      index: index,
                      updates: { label: newLabel },
                    })
                  }
                  onUpdateValue={(newVal) => {
                    const num = parseFloat(newVal) || 0;
                    dispatch({
                      type: "UPDATE_AGE_GROUP",
                      index: index,
                      updates: { value: num },
                    });
                  }}
                  onDelete={
                    state.ageGroups.length > 1
                      ? () => dispatch({ type: "DELETE_AGE_GROUP", index })
                      : null
                  }
                />
              ))}
              {state.isEditing && (
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => dispatch({ type: "ADD_AGE_GROUP" })}
                  activeOpacity={0.7}
                >
                  <Plus size={16} color="#8E8E8E" strokeWidth={2} />
                  <Text style={styles.addBtnText}>Add age group</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* COUNTRY TAB */}
          {detailFilter === "Country" && (
            <>
              {state.countries.map((country, index) => (
              <HorizontalBarRow
                key={`country-${country.name}-${index}`}
                label={country.name}
                percent={country.value}
                color="#d500ca"
                layout="top"
                editable={true}
                compact
                labelFontSize={12}
                labelMarginBottom={3}
                valueFontSize={12}
                valueWidth={42}
                trackHeight={7}
                trackMarginRight={6}
                wrapperMarginBottom={8}
                paddingVertical={2}
                paddingHorizontal={2}
                onUpdateLabel={(newLabel) =>
                  dispatch({
                    type: "UPDATE_COUNTRY",
                      index: index,
                      updates: { name: newLabel },
                    })
                  }
                  onUpdateValue={(newVal) => {
                    const num = parseFloat(newVal) || 0;
                    dispatch({
                      type: "UPDATE_COUNTRY",
                      index: index,
                      updates: { value: num },
                    });
                  }}
                  onDelete={
                    state.countries.length > 1
                      ? () => dispatch({ type: "DELETE_COUNTRY", index })
                      : null
                  }
                />
              ))}
              {state.isEditing && (
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => dispatch({ type: "ADD_COUNTRY" })}
                  activeOpacity={0.7}
                >
                  <Plus size={16} color="#8E8E8E" strokeWidth={2} />
                  <Text style={styles.addBtnText}>Add country</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* GENDER TAB - Isolated from shared list renderer */}
          {detailFilter === "Gender" && (
            <>
              <GenderMetricRow label="Women" percent={womenPercent} color="#D500CA" editable={false} />
              <GenderMetricRow
                label="Men"
                percent={state.genderMen}
                color="#9D1090"
                editable={true}
                onUpdateValue={(newVal) => {
                  const num = parseFloat(newVal) || 0;
                  dispatch({ type: "UPDATE_FIELD", field: "genderMen", value: num });
                }}
              />
            </>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

function GenderMetricRow({ label, percent, color, editable, onUpdateValue }) {
  return (
    <View style={styles.genderMetricRow}>
      <Text style={styles.genderMetricLabel}>{label}</Text>
      <View style={styles.genderMetricBarRow}>
        <View style={styles.genderMetricTrack}>
          <View style={[styles.genderMetricFill, { width: `${percent}%`, backgroundColor: color }]} />
        </View>
        {editable ? (
          <EditableNumber
            value={percent}
            onSave={onUpdateValue}
            style={styles.genderMetricValue}
            suffix="%"
            formatDisplay={(v) => parseFloat(v).toFixed(1)}
          />
        ) : (
          <Text style={styles.genderMetricValue}>{percent.toFixed(1)}%</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  contentSpacing: {
    marginTop: -8,
  },
  detailsContent: {
    marginTop: 16,
  },
  genderMetricRow: {
    marginBottom: 4,
  },
  genderMetricLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#111111",
    marginBottom: 0,
  },
  genderMetricBarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  genderMetricTrack: {
    flex: 1,
    height: 6,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "#EAEAEA",
    marginRight: 10,
  },
  genderMetricFill: {
    height: "100%",
    borderRadius: 2,
  },
  genderMetricValue: {
    width: 42,
    textAlign: "right",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#111111",
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
  lastSection: {
    paddingBottom: 60,
  },
});
