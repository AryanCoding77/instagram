import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useReelData } from "../context/ReelDataContext";

/**
 * StatCard – reusable metric card
 * Props: label, value, field (for editing), onSave
 */
export default function StatCard({ label, value, field, onSave, isEditable = false }) {
  const { state } = useReelData();
  const editableRowBg = state.isEditing && isEditable ? { backgroundColor: "#FFF8FD" } : {};

  return (
    <View style={[styles.card, editableRowBg]}>
      <Text style={styles.label}>{label}</Text>
      {isEditable ? (
        onSave ? (
          <Text style={styles.value}>{value}</Text>
        ) : (
          <Text style={styles.value}>{value}</Text>
        )
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#F2F2F4",
    borderRadius: 14,
    padding: 16,
    minHeight: 88,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#8E8E8E",
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
  },
});
