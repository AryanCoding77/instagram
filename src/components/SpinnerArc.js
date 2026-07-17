import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function SpinnerArc() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 850,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loop.start();

    return () => {
      loop.stop();
      rotation.stopAnimation();
    };
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <AnimatedView style={[styles.container, { transform: [{ rotate: spin }] }]}>
      <Svg width={34} height={34} viewBox="0 0 34 34">
        <Circle
          cx="17"
          cy="17"
          r="12"
          stroke="#111111"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="56 24"
          fill="none"
        />
      </Svg>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
});
