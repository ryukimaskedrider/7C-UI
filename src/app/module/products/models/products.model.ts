export interface IProduct {
  id?: number;
  name: string;
  personal_points: number;
  upline_points: number;
}

export interface IStatus {
  label: string,
  value: number
}

export enum STATUS {
  AVAILABLE = 'available',
  USED = 'used',
}

export const STATUS_LIST: IStatus[] = [
  {
    label: STATUS.AVAILABLE,
    value: 0
  },
  {
    label: STATUS.USED,
    value: 1
  }
];
