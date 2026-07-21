import React, { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useReelData } from "../context/ReelDataContext";

export default function EditableNumber({
  value,
  onSave,
  style,
  suffix = "",
  formatDisplay,
}) {
  const { state } = useReelData();
  const [localValue, setLocalValue] = useState(String(value));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const displayValue = formatDisplay
    ? formatDisplay(String(value))
    : String(value);

  if (!state.isEditing) {
    return <Text style={style}>{displayValue}{suffix}</Text>;
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
      style={[
        style,
        styles.input,
      ]}
      value={localValue}
      onChangeText={setLocalValue}
      onFocus={() => setIsEditing(true)}
      onBlur={() => {
        setIsEditing(false);
        if (localValue.trim()) {
          onSave(localValue);
        } else {
          // If empty, reset to 0
          setLocalValue("0");
          onSave("0");
        }
      }}
      onEndEditing={() => {
        if (localValue.trim()) {
          onSave(localValue);
        } else {
          setLocalValue("0");
          onSave("0");
        }
      }}
      onSubmitEditing={() => {
        if (localValue.trim()) {
          onSave(localValue);
        } else {
          setLocalValue("0");
          onSave("0");
        }
      }}
      keyboardType="numeric"
      selectTextOnFocus={true}
      placeholder="0"
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
    minWidth: 40,
  },
  placeholder: {
    color: "#BDBDBD",
    fontStyle: "italic",
  },
});
