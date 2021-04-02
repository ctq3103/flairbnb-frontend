import { toast } from "react-toastify";

export const displaySuccessMessage = (message: string) => {
  return toast.success(`🥳 ${message}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const displayErrorMessage = (message: string) => {
  return toast.error(`🤔 ${message}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
