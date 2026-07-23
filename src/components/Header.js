import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Keyboard } from "react-native";
import { TrendingUp, MoreVertical } from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";
import EditModeBadge from "./EditModeBadge";
import BackArrowIcon from "./icons/BackArrowIcon";

export default function Header({ onTitlePress, onAIPress, disableTitlePress = false }) {
  const { state, dispatch } = useReelData();

  const handleMenuPress = () => {
    Alert.alert(
      "Reset data",
      "Are you sure you want to reset to sample data?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            dispatch({ type: "RESET" });
            Alert.alert("Reset complete", "Data reset to sample data");
          },
        },
      ]
    );
  };

  const handleDone = () => {
    Keyboard.dismiss();
    // Small delay so keyboard animation completes before state update
    setTimeout(() => {
      dispatch({ type: "SET_EDITING", value: false });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.7}
          onPress={() => dispatch({ type: "GO_BACK" })}
        >
          <BackArrowIcon size={28} color="#111111" />
        </TouchableOpacity>

        {state.isEditing ? (
          <EditModeBadge />
        ) : (
          <TouchableOpacity
            style={styles.titleContainer}
            onPress={() => {
              if (disableTitlePress) {
                return;
              }
              if (typeof onTitlePress === "function") {
                onTitlePress();
                return;
              }
              dispatch({ type: "SET_EDITING", value: true });
            }}
            activeOpacity={0.7}
            disabled={disableTitlePress}
          >
            <Text style={styles.title}>Reel insights</Text>
          </TouchableOpacity>
        )}

        <View style={styles.rightIcons}>
          {state.isEditing ? (
            <>
              <TouchableOpacity onPress={onAIPress} activeOpacity={0.7} style={styles.aiBtn}>
                <Text style={styles.aiBtnText}>AI</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDone} activeOpacity={0.7}>
                <Text style={styles.doneBtn}>Done</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                <TrendingUp size={24} color="#111111" strokeWidth={2.25} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconBtn, { marginLeft: 4 }]}
                activeOpacity={0.7}
                onPress={handleMenuPress}
              >
                <MoreVertical size={24} color="#111111" strokeWidth={2.25} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 4,
  },
  row: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  title: {
    fontSize: 19,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
  },
  doneBtn: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#DD2A7B",
    paddingHorizontal: 12,
  },
  aiBtn: {
    minHeight: 30,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  aiBtnText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
