import React from "react";

interface NavigationButtonProps
  extends React.SVGProps<SVGSVGElement> {
  text: string;
  symbol: string;
  symbolFirst?: boolean; // New prop to control order
}

export const NavigationButton = ({
  text,
  symbol,
  symbolFirst = false,
  ...props
}: NavigationButtonProps) => {
  const content = symbolFirst ? (
    <>
      <tspan fontSize="16" fontWeight="bold">
        {symbol}
      </tspan>{" "}
      {text}
    </>
  ) : (
    <>
      {text}{" "}
      <tspan fontSize="16" fontWeight="bold">
        {symbol}
      </tspan>
    </>
  );

  return (
    <svg
      width="90"
      height="30"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect rx="10" ry="10" width="90" height="30" fill="#000000" />
      <text
        x="50%"
        y="50%"
        dy=".35em"
        fill="white"
        fontFamily="Arial"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
      >
        {content}
      </text>
    </svg>
  );
};

export default NavigationButton;
