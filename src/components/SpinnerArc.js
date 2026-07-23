import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedView = Animated.createAnimatedComponent(View);
const SEGMENT_FRACTIONS = [0.12, 0.12, 0.12, 0.12, 0.11, 0.11, 0.1, 0.1, 0.1];

export default function SpinnerArc({
  size = 30,
  color = "#E1E5EA",
  strokeWidth = 2.1,
  duration = 950,
  segmentColors,
}) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loop.start();

    return () => {
      loop.stop();
      rotation.stopAnimation();
    };
  }, [duration, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const viewBoxSize = 36;
  const center = viewBoxSize / 2;
  const radius = center - strokeWidth - 1;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.88;
  const gapLength = circumference - arcLength;
  const colors = segmentColors?.length
    ? segmentColors
    : [color, color, color, color, color];

  return (
    <AnimatedView
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ rotate: spin }],
        },
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        {SEGMENT_FRACTIONS.map((fraction, index) => {
          const segmentLength = arcLength * fraction;
          const consumedLength = arcLength * SEGMENT_FRACTIONS.slice(0, index).reduce((sum, value) => sum + value, 0);
          return (
            <Circle
              key={`spinner-segment-${index}`}
              cx={center}
              cy={center}
              r={radius}
              stroke={colors[Math.min(index, colors.length - 1)]}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${segmentLength} ${circumference}`}
              strokeDashoffset={gapLength / 2 - consumedLength}
              fill="none"
            />
          );
        })}
      </Svg>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
