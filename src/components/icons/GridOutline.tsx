import React from "react";
import Svg, { Path } from "react-native-svg";

export interface IconProps {
  size?: number;
  color?: string;
}

export default function GridOutline({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <Path d="M20 1H4a1 1 0 0 0-1 1v20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Zm-9.654 13.32V9.68h3.307v4.64h-3.307Zm3.307 2V21h-3.307v-4.68h3.307ZM5 9.68h3.346v4.64H5V9.68Zm5.346-2V3h3.307v4.68h-3.307Zm5.307 2H19v4.64h-3.347V9.68Zm3.347-2h-3.347V3H19v4.68ZM8.346 3v4.68H5V3h3.346ZM5 16.32h3.346V21H5v-4.68ZM15.653 21v-4.68H19V21h-3.347Z" />
    </Svg>
  );
}
