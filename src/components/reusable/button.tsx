import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
  onClick?: () => void;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
  onClick,
}) => (
  <button
    className={`text-lg font-medium focus:outline-none text-white py-4  transition-colors rounded-md ${
      canClick
        ? "bg-rose-600 hover:bg-rose-700"
        : "bg-gray-300 pointer-events-none"
    }`}
    onClick={onClick}
  >
    {loading ? "Loading..." : actionText}
  </button>
);
