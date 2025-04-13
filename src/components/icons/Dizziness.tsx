import React from "react";

export const Dizziness = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    {...props}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0" />
      <path d="M14.5 16.05a3.5 3.5 0 0 0-5 0M8 9l2 2m0-2l-2 2m6-2l2 2m0-2l-2 2" />
    </g>
  </svg>
);

export default Dizziness;
