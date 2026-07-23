import React from "react";
import { View, StyleSheet } from "react-native";
import SpinnerArc from "./SpinnerArc";

export default function SkeletonLoader() {
  return (
    <View style={styles.container}>
      <View style={styles.spinnerWrap}>
        <SpinnerArc size={96} color="#D4D9DF" strokeWidth={2.2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerWrap: {
    width: 132,
    height: 132,
    alignItems: "center",
    justifyContent: "center",
  },
});
