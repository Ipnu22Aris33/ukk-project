'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HttpError } from '@/lib/utils/httpErrors';
import { ApiResponse } from '@/lib/utils/apiResponse';
import { LoginInput, ActivateInput } from '@/lib/schema/auth';

/* =======================
 * CORE FETCH HELPER
 * ======================= */
async function fetchApi<T = any>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const data: ApiResponse<T> = await res.json();

  if (!res.ok || !data.success) {
    throw new HttpError(data.status ?? res.status, data.message ?? 'Request failed');
  }

  return data;
}

export function useAuth() {
  const queryClient = useQueryClient();

  /**
   * ======================
   * SESSION (QUERY)
   * ======================
   */
  const sessionQuery = useQuery({
    queryKey: ['session'],
    queryFn: () => fetchApi('/api/auth/session'),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 menit
    // Kita memetakan data.data karena ApiResponse membungkus payload di property 'data'
    select: (res) => res.data, 
  });

  /**
   * ======================
   * LOGIN (MUTATION)
   * ======================
   */
  const loginMutation = useMutation<ApiResponse, HttpError, LoginInput>({
    mutationFn: (payload) =>
      fetchApi('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (res) => {
      toast.success(res.message ?? 'Berhasil masuk');
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  /**
   * ======================
   * ACTIVATE (MUTATION) 
   * Menggantikan Register
   * ======================
   */
  const activateMutation = useMutation<ApiResponse, HttpError, ActivateInput>({
    mutationFn: (payload) =>
      fetchApi('/api/auth/activate', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (res) => {
      toast.success(res.message ?? 'Akun berhasil diaktifkan!');
      // Otomatis mendapatkan sesi karena API memberikan token/cookie
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  /**
   * ======================
   * LOGOUT (MUTATION)
   * ======================
   */
  const logoutMutation = useMutation<ApiResponse, HttpError, void>({
    mutationFn: () =>
      fetchApi('/api/auth/logout', {
        method: 'POST',
      }),
    onSuccess: (res) => {
      toast.success(res.message ?? 'Berhasil keluar');
      queryClient.setQueryData(['session'], null);
      queryClient.removeQueries(); // Membersihkan semua cache saat logout
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return {
    /* ===== STATE ===== */
    session: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    isAuthenticated: !!sessionQuery.data,

    /* ===== ACTIONS ===== */
    login: loginMutation.mutateAsync,
    activate: activateMutation.mutateAsync, // Nama method diubah sesuai konteks
    logout: logoutMutation.mutateAsync,

    /* ===== STATUS ===== */
    isLoginLoading: loginMutation.isPending,
    isActivateLoading: activateMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,

    refetchSession: sessionQuery.refetch,
  };
}