'use client';

import { Box, Flex, Container, Text } from '@radix-ui/themes';
import { useRouter, usePathname } from 'next/navigation';

interface Props {
  menus: { label: string; href: string }[];
}

export const DesktopSubNav = ({ menus }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box
      style={{
        borderTop: '1px solid var(--gray-6)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <Container size='4' px={{ initial: '4', md: '0' }}>
        <Flex align='center' gap='4' py='2'>
          {menus.map((menu) => {
            const active = pathname === menu.href;

            return (
              <Text
                key={menu.href}
                size='2'
                weight={active ? 'bold' : 'regular'}
                style={{
                  cursor: 'pointer',
                  color: active
                    ? 'var(--indigo-9)'
                    : 'var(--gray-11)',
                }}
                onClick={() => router.push(menu.href)}
              >
                {menu.label}
              </Text>
            );
          })}
        </Flex>
      </Container>
    </Box>
  );
};
