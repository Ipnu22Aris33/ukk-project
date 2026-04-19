'use client';

import { DataList, Button } from '@radix-ui/themes';
import type { CategoryResponse } from '@/lib/schema/category';

interface ViewCategoryContentProps {
  category: CategoryResponse;
  onClose: () => void;
}

export function ViewCategoryContent({ category, onClose }: ViewCategoryContentProps) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Name</DataList.Label>
          <DataList.Value>{category.name}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Description</DataList.Label>
          <DataList.Value>{category.description || '-'}</DataList.Value>
        </DataList.Item>
      </DataList.Root>

      <Button mt='4' variant='soft' onClick={onClose}>
        Close
      </Button>
    </>
  );
}
