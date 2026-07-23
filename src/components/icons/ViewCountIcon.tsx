import React from "react";
import Svg, { Path } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
};

export default function ViewCountIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <Path
        d="M23.441 11.819C23.413 11.74 20.542 4 12 4S.587 11.74.559 11.819a1 1 0 0 0 1.881.677 10.282 10.282 0 0 1 19.12 0 1 1 0 0 0 1.881-.677Zm-7.124 2.368a3.359 3.359 0 0 1-1.54-.1 3.56 3.56 0 0 1-2.365-2.362 3.35 3.35 0 0 1-.103-1.542.99.99 0 0 0-1.134-1.107 5.427 5.427 0 0 0-3.733 2.34 5.5 5.5 0 0 0 8.446 6.97 5.402 5.402 0 0 0 1.536-3.09.983.983 0 0 0-1.107-1.109Z"
        fillRule="evenodd"
      />
    </Svg>
  );
}
