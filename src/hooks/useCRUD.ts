'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
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
  [key: string]: any; // extra filters
};

type CRUDMessages = {
  create?: string;
  update?: string;
  delete?: string;
};

export type CRUDOptions<TListResponse = any, TSingleResponse = any> = {
  /** Nama query key utama, default dari `baseApi` */
  resourceName?: string;

  /** Param nama untuk search, default: 'search' */
  searchParam?: string;

  /** Custom success messages */
  messages?: CRUDMessages;

  /** Matikan semua toast */
  disableToasts?: boolean;

  /** staleTime dalam ms, default: 5 menit */
  staleTime?: number;

  /** gcTime dalam ms, default: 10 menit */
  gcTime?: number;

  /** Extra headers untuk setiap request */
  headers?: Record<string, string>;

  /** Callback setelah berhasil create */
  onCreateSuccess?: (data: ApiResponse) => void;

  /** Callback setelah berhasil update */
  onUpdateSuccess?: (data: ApiResponse, id: string | number) => void;

  /** Callback setelah berhasil delete */
  onDeleteSuccess?: (data: ApiResponse, id: string | number) => void;
};

/* =======================
 * CORE FETCH HELPER
 * ======================= */

function buildFetcher(extraHeaders: Record<string, string> = {}) {
  return async function fetchApi<T = any>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
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

    if (!res.ok || !data.success) {
      throw new HttpError(data.status ?? res.status, data.message ?? 'Request failed');
    }

    return data;
  };
}

/* =======================
 * useCRUD
 * ======================= */

/**
 * Hook CRUD generik.
 *
 * @example
 * const users = useCRUD<UserPayload, UserListResponse, UserDetail>('/api/users', {
 *   resourceName: 'users',
 *   messages: { delete: 'User dihapus!' },
 * });
 *
 * // List dengan pagination & search
 * const { data } = users.list({ page: 1, limit: 10, search: query });
 *
 * // Ambil satu
 * const { data } = users.getOne(userId);
 *
 * // Mutasi
 * users.create.mutate({ name: 'John' });
 * users.update.mutate({ id: '1', name: 'Jane' });
 * users.remove.mutate('1');
 */
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
  const fetchApi = buildFetcher(headers);

  // ---------------------------
  // Query key helpers
  // ---------------------------
  const keys = {
    all: [resourceName] as const,
    lists: () => [resourceName, 'list'] as const,
    list: (params: ListParams) => [resourceName, 'list', params] as const,
    details: () => [resourceName, 'detail'] as const,
    detail: (id: string) => [resourceName, 'detail', id] as const,
  };

  // ---------------------------
  // LIST (dengan debounce search)
  // ---------------------------
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

        // Extra filters
        Object.entries(extraFilters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
        });

        return fetchApi<TListResponse>(`${baseApi}?${qs}`);
      },
      placeholderData: keepPreviousData,
      staleTime,
      gcTime,
    });
  }

  // ---------------------------
  // GET ONE
  // ---------------------------
  function useGetOne(id: string | null | undefined, enabled = true) {
    return useQuery<ApiResponse<TSingleResponse>, HttpError>({
      queryKey: keys.detail(id ?? ''),
      queryFn: () => fetchApi<TSingleResponse>(`${baseApi}/${id}`),
      enabled: !!id && enabled,
      staleTime,
      gcTime,
    });
  }

  // ---------------------------
  // CREATE
  // ---------------------------
  const create = useMutation<ApiResponse, HttpError, TPayload>({
    mutationFn: (payload) => fetchApi(baseApi, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: (data) => {
      if (!disableToasts) toast.success(messages.create ?? data.message ?? 'Created successfully');
      qc.invalidateQueries({ queryKey: keys.lists() });
      onCreateSuccess?.(data);
    },
    onError: (err) => {
      if (!disableToasts) toast.error(err.message);
    },
  });

  // ---------------------------
  // UPDATE (PATCH)
  // ---------------------------
  const update = useMutation<ApiResponse, HttpError, TPayload & { id: string | number }>({
    mutationFn: ({ id, ...payload }) => fetchApi(`${baseApi}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    onSuccess: (data, variables) => {
      if (!disableToasts) toast.success(messages.update ?? data.message ?? 'Updated successfully');
      qc.invalidateQueries({ queryKey: keys.lists() });
      qc.invalidateQueries({ queryKey: keys.detail(String(variables.id)) });
      onUpdateSuccess?.(data, variables.id);
    },
    onError: (err) => {
      if (!disableToasts) toast.error(err.message);
    },
  });

  // ---------------------------
  // UPDATE (PUT — full replace)
  // ---------------------------
  const replace = useMutation<ApiResponse, HttpError, TPayload & { id: string | number }>({
    mutationFn: ({ id, ...payload }) => fetchApi(`${baseApi}/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    onSuccess: (data, variables) => {
      if (!disableToasts) toast.success(messages.update ?? data.message ?? 'Updated successfully');
      qc.invalidateQueries({ queryKey: keys.lists() });
      qc.invalidateQueries({ queryKey: keys.detail(String(variables.id)) });
      onUpdateSuccess?.(data, variables.id);
    },
    onError: (err) => {
      if (!disableToasts) toast.error(err.message);
    },
  });

  // ---------------------------
  // DELETE
  // ---------------------------
  const remove = useMutation<ApiResponse, HttpError, string | number>({
    mutationFn: (id) => fetchApi(`${baseApi}/${id}`, { method: 'DELETE' }),
    onSuccess: (data, id) => {
      if (!disableToasts) toast.success(messages.delete ?? data.message ?? 'Deleted successfully');
      qc.invalidateQueries({ queryKey: keys.lists() });
      qc.removeQueries({ queryKey: keys.detail(String(id)) });
      onDeleteSuccess?.(data, id);
    },
    onError: (err) => {
      if (!disableToasts) toast.error(err.message);
    },
  });

  // ---------------------------
  // Invalidation helpers
  // ---------------------------
  const invalidate = {
    all: () => qc.invalidateQueries({ queryKey: keys.all }),
    list: () => qc.invalidateQueries({ queryKey: keys.lists() }),
    one: (id: string) => qc.invalidateQueries({ queryKey: keys.detail(id) }),
  };

  return {
    /** useList(params) — query list dengan pagination, search, sort */
    list: useList,

    /** useGetOne(id) — query satu record */
    getOne: useGetOne,

    /** Mutation: create */
    create,

    /** Mutation: update (PATCH) */
    update,

    /** Mutation: replace (PUT) */
    replace,

    /** Mutation: delete */
    remove,

    /** Helpers untuk invalidate cache */
    invalidate,

    /** Query keys (untuk kebutuhan custom useQuery) */
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
