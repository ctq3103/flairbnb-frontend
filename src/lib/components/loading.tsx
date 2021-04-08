import React from "react";

interface Props {
  message?: string;
}

export const Loading = ({ message = "Loading..." }: Props) => {
  return (
    <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50 space-y-2">
      <span className="w-full text-rose-500 opacity-75 top-1/2 my-0 mx-auto block relative text-center">
        <i className="fas fa-circle-notch fa-spin fa-3x"></i>
        <br />
        <span className="font-medium text-lg">{message}</span>
      </span>
    </div>
  );
};
