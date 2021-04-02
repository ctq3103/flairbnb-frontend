import React from "react";

interface Style {
  className?: string;
}

export const Divider = ({ className }: Style) => {
  return <div className={`h-px w-full bg-gray-300 ${className}`}></div>;
};
