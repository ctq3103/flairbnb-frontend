import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
  styling?: string;
  onClick?: () => void;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
  styling,
  onClick,
}) => (
  <button
    className={`text-lg font-medium focus:outline-none text-white py-2 px-2 transition-colors rounded-md ${styling} ${
      canClick
        ? "bg-rose-500 hover:bg-rose-600"
        : "bg-gray-300 pointer-events-none"
    }`}
    onClick={onClick}
  >
    {loading ? (
      <span className="w-full text-white my-0 mx-auto block relative text-center">
        <i className="fas fa-circle-notch fa-spin fa-lg"></i>
      </span>
    ) : (
      actionText
    )}
  </button>
);

export const ButtonSecondary: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
  styling,
  onClick,
}) => (
  <button
    className={`btn-secondary font-medium ${styling} ${
      canClick
        ? "bg-indigo-600 hover:bg-indigo-700"
        : "bg-gray-300 pointer-events-none"
    }`}
    onClick={onClick}
  >
    {loading ? "Loading..." : actionText}
  </button>
);
