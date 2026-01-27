export type ApiResponse<T = any, M = any> = {
  success: boolean;
  message?: string;
  status?: number;
  meta?: M;
  data?: T;
};

type OkOptions<M = any> = {
  message?: string;
  status?: number;
  meta?: M;
};

export const ok = <T, M = undefined>(data?: T, options?: OkOptions<M>): ApiResponse<T, M> => ({
  success: true,
  message: options?.message ?? 'OK',
  status: options?.status ?? 200,
  meta: options?.meta,
  data,
});

export const created = <T>(data?: T, message = 'Created'): ApiResponse<T> => ({
  success: true,
  message,
  status: 201,
  data,
});

export const noContent = (): ApiResponse => ({
  success: true,
  status: 204,
});

export const fail = (message: string, status = 400): ApiResponse => ({
  success: false,
  message,
  status,
});
