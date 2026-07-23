import React from "react";
import Svg, { Polygon } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function SaveIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <Polygon
        fill="none"
        points="20 21 12 13.44 4 21 4 3 20 3 20 21"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Svg>
  );
}
