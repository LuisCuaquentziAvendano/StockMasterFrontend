import Swal from 'sweetalert2';

export enum ALERT_ICONS {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
  QUESTION = 'question'
}

export async function requestConfirmationAlert(title: string, text: string, icon: ALERT_ICONS,
  confirmButtonColor: string, cancelButtonColor: string, confirmButtonText: string) {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
  }).then((result) => result.isConfirmed)
  .catch(() => false);
}

export async function showMessageAlert(title: string, text: string, icon: ALERT_ICONS) {
  return Swal.fire({
    title,
    text,
    icon,
  }).then(() => {})
  .catch(() => {});
}
