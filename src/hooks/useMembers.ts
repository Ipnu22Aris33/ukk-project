// hooks/members/useMembers.ts
import { InternalServerError } from '@/lib/httpErrors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type MemberPayload = {
  name: string;
  class: string;
  major: string;
  phone: string;
};

export function useMembers() {
  const qc = useQueryClient();

  const list = (params?: { page?: number; limit: number; q?: string }) =>
    useQuery({
      queryKey: ['members', params],
      queryFn: async () => {
        const qs = new URLSearchParams({
          page: String(params?.page ?? 1),
          limit: String(params?.limit ?? 10),
          q: params?.q ?? '',
        });

        const res = await fetch(`/api/members?${qs}`, {
          credentials: 'include',
        });

        if (!res.ok) throw new InternalServerError('Failed fetch members');
        return res.json();
      },
      placeholderData: (previousData) => previousData,
    });

  const detail = (id?: string) =>
    useQuery({
      queryKey: ['member', id],
      enabled: !!id,
      queryFn: async () => {
        const res = await fetch(`/api/members/${id}`, {
          credentials: 'include',
        });

        if (!res.ok) throw new InternalServerError('Member not found');
        return res.json();
      },
    });

  const create = useMutation({
    mutationFn: async (payload: MemberPayload) => {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) throw new InternalServerError('Create member failed');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, ...payload }: Partial<MemberPayload> & { id: string }) => {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) throw new InternalServerError('Update member failed');
      return res.json();
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['members'] });
      qc.invalidateQueries({ queryKey: ['member', vars.id] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new InternalServerError('Delete member failed');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] });
    },
  });

  return {
    list,
    detail,
    create,
    update,
    remove,
  };
}
