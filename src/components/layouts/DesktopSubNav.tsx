'use client';

import { Box, Flex, Container, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  menus: { label: string; href: string }[];
}

export const DesktopSubNav = ({ menus }: Props) => {
  const pathname = usePathname();

  return (
    <Box className="border-t border-(--gray-6) bg-(--color-surface)">
      <Container size="4" px={{ initial: '4', md: '0' }}>
        <Flex align="center" gap="4" py="2">
          {menus.map((menu) => {
            const active = pathname === menu.href;

            return (
              <Link 
                key={menu.href} 
                href={menu.href}
                className={[
                  'cursor-pointer pb-1 border-b-2 transition-colors duration-150',
                  active
                    ? 'text-(--indigo-9) border-(--indigo-9)'
                    : 'text-(--gray-11) border-transparent hover:text-(--gray-12)',
                ].join(' ')}
              >
                <Text size="2" weight={active ? 'bold' : 'regular'}>
                  {menu.label}
                </Text>
              </Link>
            );
          })}
        </Flex>
      </Container>
    </Box>
  );
};