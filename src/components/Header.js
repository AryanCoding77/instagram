import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Keyboard } from "react-native";
import { ArrowLeft, TrendingUp, MoreVertical } from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";
import EditModeBadge from "./EditModeBadge";

export default function Header() {
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
          onPress={() => dispatch({ type: "SET_SCREEN", value: "home" })}
        >
          <ArrowLeft size={28} color="#111111" strokeWidth={2.0} />
        </TouchableOpacity>

        {state.isEditing ? (
          <EditModeBadge />
        ) : (
          <TouchableOpacity
            style={styles.titleContainer}
            onPress={() => dispatch({ type: "SET_EDITING", value: true })}
            activeOpacity={0.7}
          >
            <Text style={styles.title}>Reel insights</Text>
          </TouchableOpacity>
        )}

        <View style={styles.rightIcons}>
          {state.isEditing ? (
            <TouchableOpacity
              onPress={handleDone}
              activeOpacity={0.7}
            >
              <Text style={styles.doneBtn}>Done</Text>
            </TouchableOpacity>
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
    borderBottomWidth: 0.5,
    borderBottomColor: "#EFEFEF",
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
    marginLeft: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#111111",
  },
  doneBtn: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#DD2A7B",
    paddingHorizontal: 12,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
