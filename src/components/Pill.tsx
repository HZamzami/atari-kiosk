import React from "react";
interface PillProps {
  labelKey: string;
  labelValue: string;
}
export default function Pill({ labelKey, labelValue }: PillProps) {
  return (
    <div className="flex items-center rounded-full  border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-[#61c9b7] px-3 py-1 text-sm font-medium text-white border-r border-gray-300">
        {labelKey}
      </div>
      <div className="bg-white px-3 py-1 text-sm font-semibold text-gray-800">
        {labelValue}
      </div>
    </div>
  );
}
