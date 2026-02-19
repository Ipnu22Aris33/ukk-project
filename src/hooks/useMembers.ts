// hooks/useMembers.ts
import { createCRUD } from '@/hooks/useCRUD';
import { Member, CreateMemberInput } from '@/lib/models/member';

export const useMembers = createCRUD<CreateMemberInput, Member[], Member>('/api/members', {
  resourceName: 'Members',
  messages: {
    create: 'Buku berhasil ditambahkan!',
    update: 'Buku berhasil diperbarui!',
    delete: 'Buku berhasil dihapus!',
  },
});
