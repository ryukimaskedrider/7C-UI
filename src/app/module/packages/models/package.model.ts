export interface IPackage {
  id?: number;
  name: string;
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
