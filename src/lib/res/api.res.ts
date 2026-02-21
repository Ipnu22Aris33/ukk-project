export type ApiMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ApiListResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  meta: ApiMeta;
};

export type ApiSingleResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
