import React from "react";

interface IFormErrorProps {
  errorMessage: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => (
  <span role="alert" className="font-medium text-rose-500">
    {errorMessage}
  </span>
);
