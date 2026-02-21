// components/ui/Breadcrumb.tsx
import { Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { ChevronRightIcon } from '@radix-ui/react-icons';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <Flex align='center' gap='2' mb='4'>
      {items.map((item, index) => (
        <Flex key={index} align='center' gap='2'>
          {index > 0 && <ChevronRightIcon width={14} height={14} color='var(--gray-8)' />}
          {item.href ? (
            <Link href={item.href} passHref>
              <Text
                size='2'
                style={{
                  cursor: 'pointer',
                  color: 'var(--gray-11)',
                }}
                className='hover:text-gray-900 transition-colors'
              >
                {item.label}
              </Text>
            </Link>
          ) : (
            <Text size='2' weight='medium' style={{ color: 'var(--gray-12)' }}>
              {item.label}
            </Text>
          )}
        </Flex>
      ))}
    </Flex>
  );
}
