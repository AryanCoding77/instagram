import React from "react";
import GridFilled, { IconProps } from "./GridFilled";
import GridOutline from "./GridOutline";

type GridIconProps = IconProps & {
  active?: boolean;
};

export default function GridIcon({ active = false, size = 24, color = "currentColor" }: GridIconProps) {
  return active ? <GridFilled size={size} color={color} /> : <GridOutline size={size} color={color} />;
}
