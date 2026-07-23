import React from "react";
import Svg, { Rect } from "react-native-svg";

export interface IconProps {
  size?: number;
  color?: string;
}

export default function GridFilled({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <Rect x="3" y="1" width="4.667" height="6" rx="1" ry="1" />
      <Rect x="9.667" y="1" width="4.667" height="6" rx="1" ry="1" />
      <Rect x="16.333" y="1" width="4.667" height="6" rx="1" ry="1" />
      <Rect x="3" y="9" width="4.667" height="6" rx="1" ry="1" />
      <Rect x="9.667" y="9" width="4.667" height="6" rx="1" ry="1" />
      <Rect x="16.333" y="9" width="4.667" height="6" rx="1" ry="1" />
      <Rect x="3" y="17" width="4.667" height="6" rx="1" ry="1" />
      <Rect x="9.667" y="17" width="4.667" height="6" rx="1" ry="1" />
      <Rect x="16.333" y="17" width="4.667" height="6" rx="1" ry="1" />
    </Svg>
  );
}
