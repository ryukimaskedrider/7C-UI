export interface IGeneralResponse {
  status: string;
  code?: number;
  message: string;
  data?: any;
  errors?: any;
}

export interface IPaginationResponse {
  data: any[];
  links: any;
  meta: IPaginationMeta;
}

interface IPaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: string|number;
  to: any;
  total: number;
}
