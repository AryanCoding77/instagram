import React from "react";
import Svg, { Path } from "react-native-svg";

export default function BackArrowIcon({ size = 28, color = "#111111" }) {
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
