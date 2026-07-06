import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";
import EditableText from "./EditableText";
import EditableNumber from "./EditableNumber";

/**
 * HorizontalBarRow
 * Props:
 *   label    – row label string
 *   percent  – number 0–100
 *   color    – fill bar color (default ig.pink)
 *   trackColor – track color (default ig.graytrack)
 *   editable – whether this row is editable
 *   onUpdateLabel – callback for label change
 *   onUpdateValue – callback for value change
 *   onDelete – callback for deletion
 */
export default function HorizontalBarRow({
  label,
  percent,
  color = "#d500ca",
  trackColor = "#EAEAEA",
  layout = "top",
  editable = false,
  onUpdateLabel,
  onUpdateValue,
  onDelete,
  autoComputed = false,
}) {
  const { state } = useReelData();
  const editableRowBg = state.isEditing && editable ? { backgroundColor: "#FFF8FD" } : {};

  if (layout === "side") {
    return (
      <View style={[styles.sideWrapper, editableRowBg]}>
        {state.isEditing && editable && onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Trash2 size={16} color="#FF3B30" strokeWidth={2} />
          </TouchableOpacity>
        )}
        {editable && onUpdateLabel ? (
          <EditableText
            value={label}
            onSave={onUpdateLabel}
            style={styles.sideLabel}
          />
        ) : (
          <Text style={styles.sideLabel} numberOfLines={1} ellipsizeMode="tail">
            {label}
          </Text>
        )}
        <View style={styles.sideBarRow}>
          <View style={[styles.track, { backgroundColor: trackColor }]}>
            <View
              style={[
                styles.fill,
                {
                  width: `${percent}%`,
                  backgroundColor: color,
                },
              ]}
            />
          </View>
          {autoComputed ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.value, { color: "#111111" }]}>
                {percent.toFixed(1)}%
              </Text>
              {state.isEditing && <Text style={styles.autoBadge}>auto</Text>}
            </View>
          ) : editable && onUpdateValue ? (
            <EditableNumber
              value={percent}
              onSave={onUpdateValue}
              style={styles.value}
              suffix="%"
              formatDisplay={(v) => parseFloat(v).toFixed(1)}
            />
          ) : (
            <Text style={styles.value}>{percent.toFixed(1)}%</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, editableRowBg]}>
      <View style={styles.labelRow}>
        {state.isEditing && editable && onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Trash2 size={16} color="#FF3B30" strokeWidth={2} />
          </TouchableOpacity>
        )}
        {editable && onUpdateLabel ? (
          <EditableText
            value={label}
            onSave={onUpdateLabel}
            style={styles.label}
          />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </View>
      <View style={styles.barRow}>
        <View style={[styles.track, { backgroundColor: trackColor }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${percent}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        {autoComputed ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.value, { color: "#111111" }]}>
              {percent.toFixed(1)}%
            </Text>
            {state.isEditing && <Text style={styles.autoBadge}>auto</Text>}
          </View>
        ) : editable && onUpdateValue ? (
          <EditableNumber
            value={percent}
            onSave={onUpdateValue}
            style={styles.value}
            suffix="%"
            formatDisplay={(v) => parseFloat(v).toFixed(1)}
          />
        ) : (
          <Text style={styles.value}>{percent.toFixed(1)}%</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  labelRow: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteBtn: {
    marginRight: 8,
    padding: 4,
  },
  label: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#111111",
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sideWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  sideLabel: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#111111",
    width: 100,
  },
  sideBarRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 10,
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
  value: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
    width: 50,
    textAlign: "right",
  },
  autoBadge: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: "#8E8E8E",
    marginLeft: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: "#F2F2F4",
    borderRadius: 4,
  },
});
