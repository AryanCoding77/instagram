import React from "react";
import Svg, { Line, Path } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function ShareIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <Path
        d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
        fill="none"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <Line
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="7.488"
        x2="15.515"
        y1="12.208"
        y2="7.641"
      />
    </Svg>
  );
}
