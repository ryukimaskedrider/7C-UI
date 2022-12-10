export interface MetaInterface {
  total: number;
  page: number;
  limit: number;
}

export interface IPageState {
  meta: MetaInterface;
  data: any[];
}

export interface PageState {
  page: number;
  limit: number;
  filters?: any;
  sort: any;
  sortDirection: 'asc' | 'desc';
}

export interface IPageEvent {
  pageIndex: number;
  pageSize: number;
  length?: number;
}
