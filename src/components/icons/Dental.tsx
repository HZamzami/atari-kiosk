import * as React from "react";

// By: tabler
// See: https://v0.app/icon/tabler/dental
// Example: <Dental width="24px" height="24px" style={{color: "#000000"}} />

export const Dental = ({
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
    <path
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M12 5.5C10.926 4.914 9.417 4 8 4C5.9 4 4 5.247 4 9c0 4.899 1.056 8.41 2.671 10.537c.573.756 1.97.521 2.567-.236c.398-.505.819-1.439 1.262-2.801c.292-.771.892-1.504 1.5-1.5c.602 0 1.21.737 1.5 1.5c.443 1.362.864 2.295 1.262 2.8c.597.759 2 .993 2.567.237C18.944 17.41 20 13.9 20 9c0-3.74-1.908-5-4-5c-1.423 0-2.92.911-4 1.5m0 0L15 7"
    />
  </svg>
);
export default Dental;
