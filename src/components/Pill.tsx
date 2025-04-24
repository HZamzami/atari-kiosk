import React from "react";
interface PillProps {
  labelKey: string;
  labelValue: string;
}
export default function Pill({ labelKey, labelValue }: PillProps) {
  return (
    <div className="flex items-center bg-white rounded-full border border-blue-100 overflow-hidden">
      <div className="bg-white px-3 py-1 border-r border-blue-100">
        <span className="text-gray-500">{labelKey}</span>
      </div>
      <div className="px-3 py-1">
        <span className="text- font-medium">{labelValue}</span>
      </div>
    </div>
  );
}
