import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * SegmentedControl
 * Props:
 *   options  – array of string labels
 *   selected – currently selected label
 *   onChange – callback(label)
 */
export default function SegmentedControl({ options, selected, onChange }) {
  return (
    <View style={styles.wrapper}>
      {options.map((opt) => {
        const isSelected = opt === selected;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.pill, isSelected ? styles.pillSelected : styles.pillOutline]}
            onPress={() => onChange(opt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelOutline]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    marginBottom: 14,
  },
  pill: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 50,
  },
  pillSelected: {
    backgroundColor: "#F0F0F0",
    borderWidth: 0,
  },
  pillOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  label: {
    fontSize: 11,
  },
  labelSelected: {
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
  },
  labelOutline: {
    fontFamily: "Inter_500Medium",
    color: "#111111",
  },
});
