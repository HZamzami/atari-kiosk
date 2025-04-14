import * as React from "react";

// By: tabler
// See: https://v0.app/icon/tabler/heart-broken
// Example: <HeartBroken width="24px" height="24px" style={{color: "#000000"}} />

export const HeartBroken = ({
  height = "1em",
  strokeWidth = "2",
  fill = "none",
  focusable = "false",
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, "children">) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={height}
    focusable={focusable}
    {...props}
  >
    <g
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
      <path d="m12 6l-2 4l4 3l-2 4v3" />
    </g>
  </svg>
);
export default HeartBroken;
