import React from "react";
import Svg, { Path } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function CommentIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <Path
        d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
        fill="none"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Svg>
  );
}
