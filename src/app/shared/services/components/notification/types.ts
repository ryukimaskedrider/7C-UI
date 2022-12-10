export interface INotification {
  title?: string;
  message: string;
  color: "success" | "info" | "warn" | "default" | "danger",
  icon: {
    show: boolean,
    name?: string;
  },
  duration: number;
}

export interface IActionNotification {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info'
}

export const ActionType = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info'
};
