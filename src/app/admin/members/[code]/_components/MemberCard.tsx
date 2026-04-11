'use client';

import {
  Card,
  Heading,
  DataList,
  Skeleton,
} from '@radix-ui/themes';
import { useMembers } from '@/hooks/useMembers';

export function MemberCard({ code }: { code: string }) {
  const members = useMembers();
  const { data, isLoading } = members.getBy('code', code);

  const member = data?.data;

  return (
    <Card>
      <Heading size="4" mb="4">
        Member
      </Heading>

      <DataList.Root>

        <DataList.Item>
          <DataList.Label>Code</DataList.Label>
          <DataList.Value >
            <Skeleton loading={isLoading} style={{ width: 140 }}>
              {member?.memberCode || '-'}
            </Skeleton>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Name</DataList.Label>
          <DataList.Value>
            <Skeleton loading={isLoading} style={{ width: 140 }}>
              {member?.fullName || '-'}
            </Skeleton>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Class</DataList.Label>
          <DataList.Value>
            <Skeleton loading={isLoading} style={{ width: 140 }}>
              {member?.memberClass || '-'}
            </Skeleton>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Major</DataList.Label>
          <DataList.Value>
            <Skeleton loading={isLoading} style={{ width: 140 }}>
              {member?.major || '-'}
            </Skeleton>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Status</DataList.Label>
          <DataList.Value>
            <Skeleton loading={isLoading} style={{ width: 140 }}>
              {member?.isActive ? 'Active' : 'Inactive'}
            </Skeleton>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Phone</DataList.Label>
          <DataList.Value >
            <Skeleton loading={isLoading} style={{ width: 140 }}>
              {member?.phone || '-'}
            </Skeleton>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Address</DataList.Label>
          <DataList.Value>
            <Skeleton loading={isLoading} style={{ width: 140 }}>
              {member?.address || '-'}
            </Skeleton>
          </DataList.Value>
        </DataList.Item>

      </DataList.Root>
    </Card>
  );
}