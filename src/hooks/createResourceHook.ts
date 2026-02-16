'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ApiResponse } from '@/lib/apiResponse';
import { HttpError } from '@/lib/httpErrors';
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

  // Custom messages (opsional)
  messages?: {
    create?: string;
    update?: string;
    delete?: string;
  };

  // Matikan toast jika tidak ingin
  disableToasts?: boolean;

  // Query options
  staleTime?: number;
  gcTime?: number;
};

/* =======================
 * FACTORY HOOK
 * ======================= */

export function createResourceHook<TPayload extends BasePayload = any, TListResponse = any, TSingleResponse = any>(
  resourceName: string,
  baseApi: string,
  options: ResourceOptions = {}
) {
  const {
    searchParam = 'search',
    messages = {},
    disableToasts = false,
    staleTime = 1000 * 60 * 5, // 5 menit
    gcTime = 1000 * 60 * 10, // 10 menit
  } = options;

  return function useResource(params: ListParams) {
    const { page, limit, search = '', orderBy, orderDir = 'asc', debounceMs = 400 } = params;
    const qc = useQueryClient();
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
      const timer = setTimeout(() => setDebouncedSearch(search), debounceMs);
      return () => clearTimeout(timer);
    }, [search, debounceMs]);

    // Helper fetch
    const fetchApi = async <T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
      const res = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Throw HttpError dengan message dari API
        throw new HttpError(data.status || res.status, data.message || 'Request failed');
      }

      return data;
    };

    // Query keys
    const queryKeys = {
      list: [resourceName, 'list', { page, limit, search: debouncedSearch, orderBy, orderDir }],
      detail: (id: string) => [resourceName, 'detail', id],
    };

    // LIST
    const list = useQuery<ApiResponse<TListResponse>>({
      queryKey: queryKeys.list,
      queryFn: async () => {
        const qs = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (debouncedSearch) qs.append(searchParam, debouncedSearch);
        if (orderBy) {
          qs.append('orderBy', orderBy);
          qs.append('orderDir', orderDir);
        }

        return fetchApi<TListResponse>(`${baseApi}?${qs}`);
      },
      placeholderData: keepPreviousData,
      staleTime,
      gcTime,
    });

    // GET ONE
    const getOne = (id: string, enabled = true) =>
      useQuery<ApiResponse<TSingleResponse>>({
        queryKey: queryKeys.detail(id),
        queryFn: () => fetchApi<TSingleResponse>(`${baseApi}/${id}`),
        enabled: !!id && enabled,
        staleTime,
        gcTime,
      });

    // CREATE
    const create = useMutation<ApiResponse, HttpError, TPayload>({
      mutationFn: (payload) =>
        fetchApi(baseApi, {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      onSuccess: (data) => {
        if (!disableToasts) {
          toast.success(messages.create || data.message || 'Created successfully');
        }
        qc.invalidateQueries({ queryKey: [resourceName] });
      },
      onError: (error) => {
        if (!disableToasts) {
          toast.error(error.message);
        }
      },
    });

    // UPDATE
    const update = useMutation<ApiResponse, HttpError, TPayload & { id: string }>({
      mutationFn: ({ id, ...payload }) =>
        fetchApi(`${baseApi}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }),
      onSuccess: (data, variables) => {
        if (!disableToasts) {
          toast.success(messages.update || data.message || 'Updated successfully');
        }
        qc.invalidateQueries({ queryKey: [resourceName] });
        qc.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });
      },
      onError: (error) => {
        if (!disableToasts) {
          toast.error(error.message);
        }
      },
    });

    // DELETE
    const remove = useMutation<ApiResponse, HttpError, string>({
      mutationFn: (id) =>
        fetchApi(`${baseApi}/${id}`, {
          method: 'DELETE',
        }),
      onSuccess: (data, id) => {
        if (!disableToasts) {
          toast.success(messages.delete || data.message || 'Deleted successfully');
        }
        qc.invalidateQueries({ queryKey: [resourceName] });
        qc.removeQueries({ queryKey: queryKeys.detail(id) });
      },
      onError: (error) => {
        if (!disableToasts) {
          toast.error(error.message);
        }
      },
    });

    return {
      list,
      getOne,
      create,
      update,
      remove,

      // Helper
      invalidateList: () => qc.invalidateQueries({ queryKey: [resourceName, 'list'] }),
    };
  };
}
