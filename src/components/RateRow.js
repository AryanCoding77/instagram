import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";
import EditableText from "./EditableText";
import EditableNumber from "./EditableNumber";

/**
 * RateRow – icon bubble + label + % value
 * Props:
 *   icon     – React element (lucide icon)
 *   label    – string
 *   value    – number (0-100)
 *   index    – index in rates array
 *   onDelete – callback for deletion
 */
export default function RateRow({ icon, label, value, index, onDelete }) {
  const { state, dispatch } = useReelData();
  const editableRowBg = state.isEditing ? { backgroundColor: "#FFF8FD" } : {};

  return (
    <View style={[styles.row, editableRowBg]}>
      {state.isEditing && onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Trash2 size={16} color="#FF3B30" strokeWidth={2} />
        </TouchableOpacity>
      )}
      <View style={styles.bubble}>{icon}</View>
      <EditableText
        value={label}
        onSave={(newLabel) =>
          dispatch({
            type: "UPDATE_RATE",
            index,
            updates: { label: newLabel },
          })
        }
        style={styles.label}
      />
      <EditableNumber
        value={value}
        onSave={(newVal) => {
          const num = parseFloat(newVal) || 0;
          dispatch({
            type: "UPDATE_RATE",
            index,
            updates: { value: num },
          });
        }}
        style={styles.value}
        suffix="%"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  deleteBtn: {
    marginRight: 8,
    padding: 4,
  },
  bubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F2F2F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "#111111",
  },
  value: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
    minWidth: 54,
    textAlign: "right",
  },
});
