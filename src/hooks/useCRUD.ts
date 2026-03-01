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
 * const books = useCRUD<BookPayload, BookListResponse, BookDetail>('/api/books', {
 *   resourceName: 'books',
 * });
 *
 * // List
 * const { data } = books.list({ page: 1, limit: 10, search: query });
 *
 * // Get by ID
 * const { data } = books.getOne('123');
 *
 * // Get by slug
 * const { data } = books.getBy('slug', 'bahasa-jepang-untuk-pro');
 *
 * // Get by custom path: /api/books/user/42
 * const { data } = books.getBy('user', '42');
 *
 * // Get by multiple segments: /api/books/category/fiksi/featured
 * const { data } = books.getByPath(['category', 'fiksi', 'featured']);
 */
export function useCRUD<
  TPayload extends Record<string, any> = any,
  TListResponse = any,
  TSingleResponse = any,
>(baseApi: string, options: CRUDOptions<TListResponse, TSingleResponse> = {}) {
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
    // Key untuk getBy: [resourceName, 'by', field, value]
    by: (field: string, value: string) => [resourceName, 'by', field, value] as const,
    // Key untuk getByPath: [resourceName, 'path', ...segments]
    byPath: (segments: string[]) => [resourceName, 'path', ...segments] as const,
  };

  // ---------------------------
  // LIST (dengan debounce search)
  // ---------------------------
  function useList(params: ListParams = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      orderBy,
      orderDir = 'asc',
      debounceMs = 400,
      ...extraFilters
    } = params;

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

        return fetchApi<TListResponse>(`${baseApi}?${qs}`);
      },
      placeholderData: keepPreviousData,
      staleTime,
      gcTime,
    });
  }

  // ---------------------------
  // GET ONE (by id)
  // Fetch: GET /baseApi/:id
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
  // GET BY (by field + value)
  // Fetch: GET /baseApi/:field/:value
  //
  // Contoh:
  //   getBy('slug', 'bahasa-jepang')  → GET /api/books/slug/bahasa-jepang
  //   getBy('username', 'budi')       → GET /api/users/username/budi
  //
  // Kalau API-mu pakai path /api/books/:slug langsung (tanpa prefix 'slug'),
  // gunakan getBy('', 'bahasa-jepang') atau getOne() saja.
  // ---------------------------
  function useGetBy(
    field: string,
    value: string | null | undefined,
    enabled = true,
  ) {
    const path = field ? `${baseApi}/${field}/${value}` : `${baseApi}/${value}`;

    return useQuery<ApiResponse<TSingleResponse>, HttpError>({
      queryKey: keys.by(field, value ?? ''),
      queryFn: () => fetchApi<TSingleResponse>(path),
      enabled: !!value && enabled,
      staleTime,
      gcTime,
    });
  }

  // ---------------------------
  // GET BY PATH (multi-segment)
  // Fetch: GET /baseApi/:seg1/:seg2/...
  //
  // Contoh:
  //   getByPath(['category', 'fiksi'])         → GET /api/books/category/fiksi
  //   getByPath(['author', '42', 'popular'])   → GET /api/books/author/42/popular
  // ---------------------------
  function useGetByPath(
    segments: (string | null | undefined)[],
    enabled = true,
  ) {
    const resolvedSegments = segments.filter(Boolean) as string[];
    const path = `${baseApi}/${resolvedSegments.join('/')}`;
    const allFilled = segments.every(Boolean);

    return useQuery<ApiResponse<TSingleResponse>, HttpError>({
      queryKey: keys.byPath(resolvedSegments),
      queryFn: () => fetchApi<TSingleResponse>(path),
      enabled: allFilled && enabled,
      staleTime,
      gcTime,
    });
  }

  // ---------------------------
  // CREATE
  // ---------------------------
  const create = useMutation<ApiResponse, HttpError, TPayload>({
    mutationFn: (payload) =>
      fetchApi(baseApi, { method: 'POST', body: JSON.stringify(payload) }),
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
  const update = useMutation<ApiResponse, HttpError, { id: string | number; data: TPayload }>({
    mutationFn: ({ id, data }) =>
      fetchApi(`${baseApi}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
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
  // REPLACE (PUT)
  // ---------------------------
  const replace = useMutation<ApiResponse, HttpError, { id: string | number; data: TPayload }>({
    mutationFn: ({ id, data }) =>
      fetchApi(`${baseApi}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
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
    by: (field: string, value: string) =>
      qc.invalidateQueries({ queryKey: keys.by(field, value) }),
    byPath: (segments: string[]) =>
      qc.invalidateQueries({ queryKey: keys.byPath(segments) }),
  };

  return {
    /** useList(params) — query list dengan pagination, search, sort */
    list: useList,

    /** useGetOne(id) — GET /baseApi/:id */
    getOne: useGetOne,

    /**
     * useGetBy(field, value) — GET /baseApi/:field/:value
     * @example books.getBy('slug', 'bahasa-jepang-untuk-pro')
     * @example users.getBy('username', 'budi')
     */
    getBy: useGetBy,

    /**
     * useGetByPath(segments) — GET /baseApi/:seg1/:seg2/...
     * @example books.getByPath(['category', 'fiksi', 'featured'])
     */
    getByPath: useGetByPath,

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

export function createCRUD<
  TPayload extends Record<string, any> = any,
  TListResponse = any,
  TSingleResponse = any,
>(baseApi: string, options: CRUDOptions<TListResponse, TSingleResponse> = {}) {
  return function useBoundCRUD() {
    return useCRUD<TPayload, TListResponse, TSingleResponse>(baseApi, options);
  };
}