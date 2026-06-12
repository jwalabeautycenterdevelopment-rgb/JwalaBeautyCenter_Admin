import { toast } from "react-toastify";

export const successAlert = (message) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};

export const errorAlert = (message) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};

export const infoAlert = (message) => {
  toast.info(message, {
    position: "bottom-right",
    autoClose: 3000,
    theme: "colored",
  });
};

export const warningAlert = (message) => {
  toast.warning(message, {
    position: "bottom-right",
    autoClose: 3000,
    theme: "colored",
  });
};
