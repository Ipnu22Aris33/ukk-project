// hooks/useMembers.ts
import { createCRUD } from '@/hooks/useCRUD';
import { Member, CreateMemberInput, UpdateMemberInput, MemberResponse } from '@/lib/schema/member';

export const useMembers = createCRUD<CreateMemberInput | UpdateMemberInput, MemberResponse[], Member>('/api/members', {
  resourceName: 'Members',
  messages: {
    create: 'Member berhasil ditambahkan!',
    update: 'Member berhasil diperbarui!',
    delete: 'Member berhasil dihapus!',
  },
});
