'use client';

import { DataList, Button } from '@radix-ui/themes';
import type { MemberResponse } from '@/lib/schema/member';

interface ViewMemberContentProps {
  member: MemberResponse;
  onClose: () => void;
}

export function ViewMemberContent({ member, onClose }: ViewMemberContentProps) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Full Name</DataList.Label>
          <DataList.Value>{member.fullName}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>NIS</DataList.Label>
          <DataList.Value>{member.nis || '-'}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Phone</DataList.Label>
          <DataList.Value>{member.phone || '-'}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Class</DataList.Label>
          <DataList.Value>{member.memberClass || '-'}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Major</DataList.Label>
          <DataList.Value>{member.major || '-'}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Address</DataList.Label>
          <DataList.Value>{member.address}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Member Code</DataList.Label>
          <DataList.Value>{member.memberCode}</DataList.Value>
        </DataList.Item>
      </DataList.Root>

      <Button mt='4' variant='soft' onClick={onClose}>
        Close
      </Button>
    </>
  );
}
