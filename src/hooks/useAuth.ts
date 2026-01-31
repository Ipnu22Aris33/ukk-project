// hooks/useAuth.ts
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from './useSession';

type LoginPayload = {
  email: string;
  password: string;
};

export function useAuth() {
  const queryClient = useQueryClient();
  const session = useSession();

  const login = async (payload: LoginPayload) => {
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

    // refresh session setelah login
    await queryClient.invalidateQueries({ queryKey: ['session'] });
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    // langsung clear cache
    queryClient.setQueryData(['session'], null);
  };

  return {
    user: session.data,
    isLoading: session.isLoading,
    isAuthenticated: !!session.data,
    login,
    logout,
    refetchSession: session.refetch,
  };
}
