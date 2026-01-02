import { toast, ToastPosition, Theme } from 'react-toastify';

export interface ToastOptions {
  position?: ToastPosition;
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: Theme;
}

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light' as Theme,
      ...options,
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light' as Theme,
      ...options,
    });
  };

  const warning = (message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light' as Theme,
      ...options,
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light' as Theme,
      ...options,
    });
  };

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };
};

export default useToast;