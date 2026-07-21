import React, { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useReelData } from "../context/ReelDataContext";

export default function EditableText({ value, onSave, style }) {
  const { state } = useReelData();
  const [localValue, setLocalValue] = useState(String(value));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  if (!state.isEditing) {
    return <Text style={style}>{value || "—"}</Text>;
  }

  // If field is empty and not currently being edited, show as clickable text
  if (!isEditing && !localValue) {
    return (
      <TouchableOpacity onPress={() => setIsEditing(true)}>
        <Text style={[style, styles.placeholder]}>Tap to edit</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TextInput
      style={[style, styles.input]}
      value={localValue}
      onChangeText={setLocalValue}
      onFocus={() => setIsEditing(true)}
      onBlur={() => {
        setIsEditing(false);
        if (localValue.trim()) {
          onSave(localValue);
        }
      }}
      onEndEditing={() => {
        if (localValue.trim()) {
          onSave(localValue);
        }
      }}
      onSubmitEditing={() => {
        if (localValue.trim()) {
          onSave(localValue);
        }
      }}
      keyboardType="default"
      selectTextOnFocus={true}
      placeholder="Enter text"
      placeholderTextColor="#BDBDBD"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#DD2A7B",
    paddingVertical: 0,
    paddingHorizontal: 0,
    minWidth: 60,
  },
  placeholder: {
    color: "#BDBDBD",
    fontStyle: "italic",
  },
});
