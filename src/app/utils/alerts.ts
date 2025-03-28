import Swal from 'sweetalert2';

export enum ALERT_COLORS {
  BG_DARK = '#020409',
  BG_MID = '#0D1117',
  BG_LIGHT = '#151B23',
  BORDER = '#9198A1',
  PRIMARY_DARK = '#131D2F',
  PRIMARY_MID = '#3984EA',
  PRIMARY_LIGHT = '#99C8FD',
  SECONDARY_DARK = '#23132f',
  SECONDARY_MID = '#6b39ea',
  SECONDARY_LIGHT = '#e199fd',
  SUCCESS_DARK = '#228636',
  SUCCESS_LIGHT = '#99fd9e',
  WARNING = '#F1E05A',
  DANGER_DARK = '#BD3839',
  DANGER_LIGHT = '#fdaa99'
}

export enum ALERT_ICONS {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
  QUESTION = 'question'
}

export async function requestConfirmationAlert(title: string, text: string, icon: ALERT_ICONS,
  confirmButtonColor: ALERT_COLORS, confirmButtonText: string) {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
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

export async function getInputAlert(title: string, text: string) {
  return Swal.fire({
    title,
    text,
    input: "text",
    showCancelButton: true,
  }).then((result) => [result.isConfirmed as boolean, result.value || ''])
  .catch(() => [false, '']);
}
