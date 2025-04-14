import * as React from "react";

// By: tabler
// See: https://v0.app/icon/tabler/heartbeat
// Example: <Heartbeat width="24px" height="24px" style={{color: "#000000"}} />

export const Heartbeat = ({
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
      <path d="M19.5 13.572L12 21l-2.896-2.868m-6.117-8.104A5 5 0 0 1 12 7.006a5 5 0 1 1 7.5 6.572" />
      <path d="M3 13h2l2 3l2-6l1 3h3" />
    </g>
  </svg>
);
export default Heartbeat;
