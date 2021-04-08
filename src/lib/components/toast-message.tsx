import { toast } from "react-toastify";

export const displaySuccessMessage = (message: string) => {
  return toast(`🥳  SUCCESS! ${message}`, {
    position: "top-left",
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const displayErrorMessage = (message: string) => {
  return toast.error(`😣  ${message}`, {
    position: "top-left",
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
