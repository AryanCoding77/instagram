import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Keyboard } from "react-native";
import Svg, { Path } from "react-native-svg";
import { TrendingUp, MoreVertical } from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";
import EditModeBadge from "./EditModeBadge";

function BackArrowIcon({ size = 28, color = "#111111" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <Path
        d="M27 15H7.8M7.8 15L14.6 9.1M7.8 15L14.6 20.9"
        stroke={color}
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function Header({ onTitlePress, disableTitlePress = false }) {
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
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
