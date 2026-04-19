'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { HttpError } from '@/lib/utils/httpErrors';
import { ApiResponse } from '@/lib/utils/apiResponse';

/* =======================
 * TYPES
 * ======================= */

export type OrderDir = 'asc' | 'desc';

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
  orderDir?: OrderDir;
  debounceMs?: number;
  [key: string]: any;
};

type CRUDMessages = {
  create?: string;
  update?: string;
  delete?: string;
};

export type CRUDOptions<TListResponse = any, TSingleResponse = any> = {
  resourceName?: string;
  searchParam?: string;
  messages?: CRUDMessages;
  disableToasts?: boolean;
  staleTime?: number;
  gcTime?: number;
  headers?: Record<string, string>;
  onCreateSuccess?: (data: ApiResponse) => void;
  onUpdateSuccess?: (data: ApiResponse, id: string | number) => void;
  onDeleteSuccess?: (data: ApiResponse, id: string | number) => void;
};

/* =======================
 * CORE FETCH HELPER (IMPROVED)
 * ======================= */

function buildFetcher(extraHeaders: Record<string, string> = {}, disableToasts?: boolean) {
  return async function fetchApi<T = any>(url: string, init?: RequestInit & { showToast?: boolean }): Promise<ApiResponse<T>> {
    const res = await fetch(url, {
      credentials: 'include',
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...extraHeaders,
        ...init?.headers,
      },
    });

    const data: ApiResponse<T> = await res.json();
    const showToast = init?.showToast ?? true;

    if (!res.ok || !data.success) {
      if (!disableToasts && showToast) {
        toast.error(data.message ?? 'Request failed');
      }
      throw new HttpError(data.status ?? res.status, data.message ?? 'Request failed');
    }

    if (!disableToasts && showToast && data.message) {
      const type = (data as any).toastType || 'success';
      // @ts-ignore
      toast[type](data.message);
    }

    return data;
  };
}

/* =======================
 * useCRUD
 * ======================= */

export function useCRUD<TPayload extends Record<string, any> = any, TListResponse = any, TSingleResponse = any>(
  baseApi: string,
  options: CRUDOptions<TListResponse, TSingleResponse> = {}
) {
  const {
    resourceName = baseApi,
    searchParam = 'search',
    messages = {},
    disableToasts = false,
    staleTime = 1000 * 60 * 5,
    gcTime = 1000 * 60 * 10,
    headers = {},
    onCreateSuccess,
    onUpdateSuccess,
    onDeleteSuccess,
  } = options;

  const qc = useQueryClient();
  const fetchApi = buildFetcher(headers, disableToasts);

  const keys = {
    all: [resourceName] as const,
    lists: () => [resourceName, 'list'] as const,
    list: (params: ListParams) => [resourceName, 'list', params] as const,
    details: () => [resourceName, 'detail'] as const,
    detail: (id: string) => [resourceName, 'detail', id] as const,
    by: (field: string, value: string) => [resourceName, 'by', field, value] as const,
    byPath: (segments: unknown[], params?: Record<string, any>) => [resourceName, 'path', segments, params] as const,
  };

  function useList(params: ListParams = {}) {
    const { page = 1, limit = 10, search = '', orderBy, orderDir = 'asc', debounceMs = 400, ...extraFilters } = params;

    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
      const t = setTimeout(() => setDebouncedSearch(search), debounceMs);
      return () => clearTimeout(t);
    }, [search, debounceMs]);

    const resolvedParams = {
      page,
      limit,
      search: debouncedSearch,
      orderBy,
      orderDir,
      ...extraFilters,
    };

    return useQuery<ApiResponse<TListResponse>, HttpError>({
      queryKey: keys.list(resolvedParams),
      queryFn: () => {
        const qs = new URLSearchParams({ page: String(page), limit: String(limit) });

        if (debouncedSearch) qs.append(searchParam, debouncedSearch);
        if (orderBy) {
          qs.append('orderBy', orderBy);
          qs.append('orderDir', orderDir);
        }

        Object.entries(extraFilters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
        });

        return fetchApi<TListResponse>(`${baseApi}?${qs}`, { showToast: false });
      },
      placeholderData: keepPreviousData,
      staleTime,
      gcTime,
    });
  }

  function useGetOne(id: string | null | undefined, enabled = true) {
    return useQuery<ApiResponse<TSingleResponse>, HttpError>({
      queryKey: keys.detail(id ?? ''),
      queryFn: () => fetchApi<TSingleResponse>(`${baseApi}/${id}`, { showToast: false }),
      enabled: !!id && enabled,
      staleTime,
      gcTime,
    });
  }

  function useGetBy(field: string, value: string | null | undefined, enabled = true) {
    const path = field ? `${baseApi}/${field}/${value}` : `${baseApi}/${value}`;

    return useQuery<ApiResponse<TSingleResponse>, HttpError>({
      queryKey: keys.by(field, value ?? ''),
      queryFn: () => fetchApi<TSingleResponse>(path),
      enabled: !!value && enabled,
      staleTime,
      gcTime,
      retry: false,
    });
  }

  function useGetByPath(segments: (string | null | undefined)[], params?: Record<string, any>, enabled = true) {
    const resolvedSegments = segments.filter(Boolean) as string[];
    const allFilled = segments.every(Boolean);

    return useQuery<ApiResponse<TSingleResponse>, HttpError>({
      queryKey: keys.byPath(resolvedSegments, params),
      queryFn: () => {
        const qs = new URLSearchParams();

        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
              qs.append(k, String(v));
            }
          });
        }

        const queryString = qs.toString();
        const path = `${baseApi}/${resolvedSegments.join('/')}${queryString ? `?${queryString}` : ''}`;

        return fetchApi<TSingleResponse>(path, { showToast: false });
      },
      enabled: allFilled && enabled,
      staleTime,
      gcTime,
    });
  }

  const create = useMutation<ApiResponse, HttpError, TPayload>({
    mutationFn: (payload) =>
      fetchApi(baseApi, {
        method: 'POST',
        body: JSON.stringify(payload),
        showToast: true,
      }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: keys.lists() });
      onCreateSuccess?.(data);
    },
  });

  const update = useMutation<ApiResponse, HttpError, { id: string | number; data: TPayload }>({
    mutationFn: ({ id, data }) =>
      fetchApi(`${baseApi}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        showToast: true,
      }),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: keys.lists() });
      qc.invalidateQueries({ queryKey: keys.detail(String(variables.id)) });
      onUpdateSuccess?.(data, variables.id);
    },
  });

  const replace = useMutation<ApiResponse, HttpError, { id: string | number; data: TPayload }>({
    mutationFn: ({ id, data }) =>
      fetchApi(`${baseApi}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        showToast: true,
      }),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: keys.lists() });
      qc.invalidateQueries({ queryKey: keys.detail(String(variables.id)) });
      onUpdateSuccess?.(data, variables.id);
    },
  });

  const remove = useMutation<ApiResponse, HttpError, string | number>({
    mutationFn: (id) =>
      fetchApi(`${baseApi}/${id}`, {
        method: 'DELETE',
        showToast: true,
      }),
    onSuccess: (data, id) => {
      qc.invalidateQueries({ queryKey: keys.lists() });
      qc.removeQueries({ queryKey: keys.detail(String(id)) });
      onDeleteSuccess?.(data, id);
    },
  });

  const invalidate = {
    all: () => qc.invalidateQueries({ queryKey: keys.all }),
    list: () => qc.invalidateQueries({ queryKey: keys.lists() }),
    one: (id: string) => qc.invalidateQueries({ queryKey: keys.detail(id) }),
    by: (field: string, value: string) => qc.invalidateQueries({ queryKey: keys.by(field, value) }),
    byPath: (segments: string[], params?: Record<string, any>) => qc.invalidateQueries({ queryKey: keys.byPath(segments, params) }),
  };

  const custom = useMutation<ApiResponse, HttpError, { id: string | number; action: string; method?: 'POST' | 'PATCH' | 'PUT'; body?: any }>({
    mutationFn: ({ id, action, method = 'POST', body }) =>
      fetchApi(`${baseApi}/${id}/${action}`, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        showToast: true,
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: keys.lists() });
      qc.invalidateQueries({ queryKey: keys.detail(String(variables.id)) });
    },
  });

  return {
    list: useList,
    getOne: useGetOne,
    getBy: useGetBy,
    getByPath: useGetByPath,
    create,
    update,
    replace,
    remove,
    invalidate,
    custom,
    keys,
  };
}

export function createCRUD<TPayload extends Record<string, any> = any, TListResponse = any, TSingleResponse = any>(
  baseApi: string,
  options: CRUDOptions<TListResponse, TSingleResponse> = {}
) {
  return function useBoundCRUD() {
    return useCRUD<TPayload, TListResponse, TSingleResponse>(baseApi, options);
  };
}
