'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ApiResponse } from '@/lib/apiResponse';
import { toast } from 'sonner';

/* =======================
 * TYPES
 * ======================= */

export type OrderDir = 'asc' | 'desc';

export type ListParams = {
  page: number;
  limit: number;
  search?: string;
  orderBy?: string;
  orderDir?: OrderDir;
  debounceMs?: number;
};

type BasePayload = Record<string, any>;

type ResourceOptions = {
  searchParam?: string;
  messages?: {
    create?: {
      success?: string;
      error?: string;
    };
    update?: {
      success?: string;
      error?: string;
    };
    delete?: {
      success?: string;
      error?: string;
    };
  };
};

/* =======================
 * FACTORY HOOK
 * ======================= */

export function createResourceHook<TPayload extends BasePayload = any, TListResponse = any>(
  resourceName: string,
  baseApi: string,
  options: ResourceOptions = {}
) {
  const { searchParam = 'search', messages = {} } = options;

  return function useResource({ page, limit, search = '', orderBy, orderDir = 'asc', debounceMs = 400 }: ListParams) {
    const qc = useQueryClient();

    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(search);
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [search, debounceMs]);

    /* =======================
     * LIST QUERY
     * ======================= */
    const list = useQuery<ApiResponse<TListResponse>>({
      queryKey: [resourceName, page, limit, debouncedSearch, orderBy, orderDir],
      queryFn: async () => {
        const qs = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (debouncedSearch) {
          qs.append(searchParam, debouncedSearch);
        }

        if (orderBy) {
          qs.append('orderBy', orderBy);
          qs.append('orderDir', orderDir);
        }

        const res = await fetch(`${baseApi}?${qs.toString()}`, {
          credentials: 'include',
        });

        const data: ApiResponse<TListResponse> = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || `Failed fetch ${resourceName}`);
        }

        return data;
      },
      placeholderData: keepPreviousData,
    });

    /* =======================
     * CREATE
     * ======================= */
    const create = useMutation<ApiResponse, Error, TPayload>({
      mutationFn: async (payload: TPayload) => {
        const res = await fetch(baseApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });

        const data: ApiResponse = await res.json();

        if (!res.ok || !data.success) {
          // Buat error dengan data dari response
          const error = new Error(data.message || messages.create?.error || `Create ${resourceName} failed`);
          (error as any).response = { data };
          throw error;
        }

        return data;
      },
      onSuccess: (data) => {
        const message = messages.create?.success || data?.message;
        if (message) {
          toast.success(message);
        }
        qc.invalidateQueries({ queryKey: [resourceName] });
      },
      onError: (error: any) => {
        // Handle validation errors
        if (error?.response?.data?.errors) {
          const validationErrors = error.response.data.errors;
          if (Array.isArray(validationErrors)) {
            // Tampilkan semua error validation
            validationErrors.forEach((err: any) => {
              toast.error(err.message || 'Validation error');
            });
          } else {
            toast.error('Validation error');
          }
        } else {
          toast.error(error.message);
        }
      },
    });

    /* =======================
     * UPDATE
     * ======================= */
    const update = useMutation<ApiResponse, Error, TPayload & { id: string }>({
      mutationFn: async ({ id, ...payload }) => {
        const res = await fetch(`${baseApi}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });

        const data: ApiResponse = await res.json();

        if (!res.ok || !data.success) {
          const error = new Error(data.message || messages.update?.error || `Update ${resourceName} failed`);
          (error as any).response = { data };
          throw error;
        }

        return data;
      },
      onSuccess: (data) => {
        const message = messages.update?.success || data?.message;
        if (message) {
          toast.success(message);
        }
        qc.invalidateQueries({ queryKey: [resourceName] });
      },
      onError: (error: any) => {
        if (error?.response?.data?.errors) {
          const validationErrors = error.response.data.errors;
          if (Array.isArray(validationErrors)) {
            validationErrors.forEach((err: any) => {
              toast.error(err.message || 'Validation error');
            });
          } else {
            toast.error('Validation error');
          }
        } else {
          toast.error(error.message);
        }
      },
    });

    /* =======================
     * DELETE
     * ======================= */
    const remove = useMutation<ApiResponse, Error, string>({
      mutationFn: async (id: string) => {
        const res = await fetch(`${baseApi}/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        // Untuk DELETE, mungkin return 204 No Content
        if (res.status === 204) {
          return { success: true, message: 'Deleted successfully' };
        }

        const data: ApiResponse = await res.json();

        if (!res.ok || !data.success) {
          const error = new Error(data.message || messages.delete?.error || `Delete ${resourceName} failed`);
          (error as any).response = { data };
          throw error;
        }

        return data;
      },
      onSuccess: (data) => {
        const message = messages.delete?.success || data?.message;
        if (message) {
          toast.success(message);
        }
        qc.invalidateQueries({ queryKey: [resourceName] });
      },
      onError: (error: any) => {
        if (error?.response?.data?.errors) {
          const validationErrors = error.response.data.errors;
          if (Array.isArray(validationErrors)) {
            validationErrors.forEach((err: any) => {
              toast.error(err.message || 'Validation error');
            });
          } else {
            toast.error('Validation error');
          }
        } else {
          toast.error(error.message);
        }
      },
    });

    /* =======================
     * RETURN
     * ======================= */
    return {
      list,
      create,
      update,
      remove,
    };
  };
}
