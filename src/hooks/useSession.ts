// hooks/useSession.ts
import { useQuery } from '@tanstack/react-query';

type SessionUser = {
  id_user: string;
  email: string;
  role: string;
};

export function useSession() {
  return useQuery<SessionUser | null>({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch('/api/auth/session', {
        credentials: 'include', // WAJIB
      });

      if (!res.ok) {
        return null;
      }

      const json = await res.json();
      return json.data ?? null;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
}
