'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { InternalServerError } from '@/lib/httpErrors';

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
};

/* =======================
 * FACTORY HOOK
 * ======================= */

export function createResourceHook<TPayload extends BasePayload = any, TListResponse = any>(
  resourceName: string,
  baseApi: string,
  options: ResourceOptions = {}
) {
  const { searchParam = 'search' } = options;

  return function useResource({ page, limit, search = '', orderBy, orderDir = 'asc', debounceMs = 400 }: ListParams) {
    const qc = useQueryClient();

    /**
     * De
     */
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
    const list = useQuery<TListResponse>({
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

        if (!res.ok) {
          throw new InternalServerError(`Failed fetch ${resourceName}`);
        }

        return res.json();
      },
      placeholderData: keepPreviousData,
    });

    /* =======================
     * CREATE
     * ======================= */
    const create = useMutation({
      mutationFn: async (payload: TPayload) => {
        const res = await fetch(baseApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });

        if (!res.ok) {
          throw new InternalServerError(`Create ${resourceName} failed`);
        }

        return res.json();
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [resourceName] });
      },
    });

    /* =======================
     * UPDATE
     * ======================= */
    const update = useMutation({
      mutationFn: async ({ id, ...payload }: TPayload & { id: string }) => {
        const res = await fetch(`${baseApi}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });

        if (!res.ok) {
          throw new InternalServerError(`Update ${resourceName} failed`);
        }

        return res.json();
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [resourceName] });
      },
    });

    /* =======================
     * DELETE
     * ======================= */
    const remove = useMutation({
      mutationFn: async (id: string) => {
        const res = await fetch(`${baseApi}/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new InternalServerError(`Delete ${resourceName} failed`);
        }
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [resourceName] });
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
