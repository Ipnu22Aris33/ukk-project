// types/resource-hook.ts
export type OrderDir = 'asc' | 'desc';

export type ListParams = {
  page: number;
  limit: number;
  search?: string;
  orderBy?: string;
  orderDir?: OrderDir;
  debounceMs?: number;
};

export type BasePayload = Record<string, any>;

export type ResourceOptions = {
  searchParam?: string;
  successMessages?: Partial<SuccessMessages>;
  errorMessages?: Partial<ErrorMessages>;
  disableToasts?: boolean;
};

export type SuccessMessages = {
  create: string;
  update: string;
  delete: string;
  list: string;
};

export type ErrorMessages = {
  create: string;
  update: string;
  delete: string;
  list: string;
};
