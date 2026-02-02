// hooks/createResourceHook.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { InternalServerError } from '@/lib/httpErrors';

type ListParams = {
  page: number;
  limit: number;
  search?: string;
  debounceMs?: number;
};

type BasePayload = Record<string, any>;

export function createResourceHook<TPayload extends BasePayload = any>(resourceName: string, baseApi: string) {
  return function useResource({ page, limit, search = '', debounceMs = 400 }: ListParams) {
    const qc = useQueryClient();
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
      const timer = setTimeout(() => setDebouncedSearch(search), debounceMs);
      return () => clearTimeout(timer);
    }, [search, debounceMs]);

    const list = useQuery({
      queryKey: [resourceName, page, limit, debouncedSearch],
      queryFn: async () => {
        const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (debouncedSearch) qs.append('search', debouncedSearch);

        const res = await fetch(`${baseApi}?${qs}`, { credentials: 'include' });
        if (!res.ok) throw new InternalServerError(`Failed fetch ${resourceName}`);
        return res.json();
      },
    });

    const create = useMutation({
      mutationFn: async (payload: TPayload) => {
        const res = await fetch(baseApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) throw new InternalServerError(`Create ${resourceName} failed`);
        return res.json();
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: [resourceName] }),
    });

    const update = useMutation({
      mutationFn: async ({ id, ...payload }: TPayload & { id: string }) => {
        const res = await fetch(`${baseApi}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) throw new InternalServerError(`Update ${resourceName} failed`);
        return res.json();
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: [resourceName] }),
    });

    const remove = useMutation({
      mutationFn: async (id: string) => {
        const res = await fetch(`${baseApi}/${id}`, { method: 'DELETE', credentials: 'include' });
        if (!res.ok) throw new InternalServerError(`Delete ${resourceName} failed`);
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: [resourceName] }),
    });

    return { list, create, update, remove };
  };
}
