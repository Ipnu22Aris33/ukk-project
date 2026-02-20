export type ApiResponse<T = any, M = any> = {
  success: boolean;
  message?: string;
  status?: number;
  meta?: M;
  data?: T;
  errors?: Record<string, string[]>; // Untuk validasi errors
  timestamp?: string; // Untuk tracking waktu
  path?: string; // Untuk debugging (opsional)
};

type OkOptions<M = any> = {
  message?: string;
  status?: number;
  meta?: M;
  errors?: Record<string, string[]>;
  timestamp?: boolean;
};

export const ok = <T, M = undefined>(
  data?: T, 
  options?: OkOptions<M>
): ApiResponse<T, M> => ({
  success: true,
  message: options?.message ?? 'OK',
  status: options?.status ?? 200,
  meta: options?.meta,
  data,
  ...(options?.errors && { errors: options.errors }),
  ...(options?.timestamp && { timestamp: new Date().toISOString() }),
});

// Tambah helper untuk validation error
export const validationError = (
  errors: Record<string, string[]>,
  message = 'Validation Error'
): ApiResponse => ({
  success: false,
  message,
  status: 400,
  errors,
  timestamp: new Date().toISOString(),
});

// Enhanced fail dengan opsi
type FailOptions = {
  status?: number;
  data?: any;
  errors?: Record<string, string[]>;
  timestamp?: boolean;
};

export const fail = (
  message: string, 
  options?: FailOptions
): ApiResponse => ({
  success: false,
  message,
  status: options?.status ?? 500,
  ...(options?.data && { data: options.data }),
  ...(options?.errors && { errors: options.errors }),
  ...(options?.timestamp && { timestamp: new Date().toISOString() }),
});