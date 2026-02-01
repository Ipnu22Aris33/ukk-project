'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { InternalServerError } from '@/lib/httpErrors';
import { useEffect, useState } from 'react';

type ListParams = {
  page: number;
  limit: number;
  search?: string;
  debounceMs?: number;
};

type LoanPayload = {
  book_id: string;
  member_id: string;
  count: number;
  loan_date: Date;
  due_date: Date;
  status: string;
};

const LOANS_API_URL = '/api/loans';

export function useLoans({ page, limit, search = '', debounceMs = 400 }: ListParams) {
  const qc = useQueryClient();

  // =========================
  // DEBOUNCED SEARCH
  // =========================
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [search, debounceMs]);

  // =========================
  // LIST
  // =========================
  const list = useQuery({
    queryKey: ['loans', page, limit, debouncedSearch],
    queryFn: async () => {
      const qs = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (debouncedSearch) {
        qs.append('search', debouncedSearch);
      }

      const res = await fetch(`${LOANS_API_URL}?${qs}`, {
        credentials: 'include',
      });

      if (!res.ok) throw new InternalServerError('Failed fetch loans');
      return res.json();
    },
    placeholderData: (keepPreviousData) => keepPreviousData,
  });

  // =========================
  // CREATE
  // =========================
  const create = useMutation({
    mutationFn: async (payload: LoanPayload) => {
      const res = await fetch(LOANS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) throw new InternalServerError('Create loan failed');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] });
    },
  });

  // =========================
  // UPDATE
  // =========================
  const update = useMutation({
    mutationFn: async ({ id, ...payload }: Partial<LoanPayload> & { id: string }) => {
      const res = await fetch(`${LOANS_API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) throw new InternalServerError('Update loan failed');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] });
    },
  });

  // =========================
  // REMOVE
  // =========================
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${LOANS_API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new InternalServerError('Delete loan failed');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] });
    },
  });

  return {
    list,
    create,
    update,
    remove,
  };
}
