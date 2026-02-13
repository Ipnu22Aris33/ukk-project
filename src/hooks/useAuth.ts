// hooks/useAuth.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { LoginInput, RegisterInput } from '@/lib/schemas/auth';

export function useAuth() {
  const queryClient = useQueryClient();

  /**
   * ======================
   * SESSION (QUERY)
   * ======================
   */
  const sessionQuery = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      if (!res.ok) return null;

      const json = await res.json();
      return json.data ?? null;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  /**
   * ======================
   * LOGIN (MUTATION)
   * ======================
   */
  const loginMutation = useMutation({
    mutationFn: async (payload: LoginInput) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Login failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });

  /**
   * ======================
   * REGISTER (MUTATION)
   * ======================
   */
  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterInput) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Register failed');
      }
    },
    onSuccess: () => {
      // kalau register auto-login
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });

  /**
   * ======================
   * LOGOUT (MUTATION)
   * ======================
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(['session'], null);
    },
  });

  return {
    /* ===== STATE ===== */
    session: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    isAuthenticated: !!sessionQuery.data,

    /* ===== ACTIONS ===== */
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    /* ===== STATUS ===== */
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,

    refetchSession: sessionQuery.refetch,
  };
}
