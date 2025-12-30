'use client';

import { useState } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import NextLink from 'next/link';
import { Icon } from '@iconify/react';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';
import {
  Box,
  Container,
  Flex,
  Text,
  Link,
  IconButton,
} from '@radix-ui/themes';
import { AppIcon } from '../ui/AppIcon';

const NAV_ITEMS = [
  { label: 'Home', href: '/' , icon: 'carbon:home'},
  { label: 'Blog', href: '/blog', icon: 'carbon:menu' },
  { label: 'About', href: '/about', icon: 'carbon:information' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <Box asChild style={{ borderBottom: '1px solid var(--gray-a6)' }}>
        <header>
          <Container size="4">
            <Flex height="64px" align="center" justify="between">
              {/* LEFT */}
              <Flex align="center" gap="3">
                {/* BURGER – MOBILE ONLY */}
                <Box display={{ initial: 'block', md: 'none' }}>
                  <IconButton
                    variant="ghost"
                    onClick={() => setOpen(true)}
                  >
                    <AppIcon icon="carbon:menu" width={20} />
                  </IconButton>
                </Box>

                {/* LOGO */}
                <Link asChild underline="none">
                  <NextLink href="/">
                    <Text size="4" weight="bold">
                      MyApp
                    </Text>
                  </NextLink>
                </Link>
              </Flex>

              {/* NAV – TABLET & DESKTOP */}
              <Box display={{ initial: 'none', md: 'block' }}>
                <NavigationMenu.Root>
                  <NavigationMenu.List
                    style={{
                      display: 'flex',
                      gap: '24px',
                      listStyle: 'none',
                    }}
                  >
                    {NAV_ITEMS.map((item) => (
                      <NavigationMenu.Item key={item.href}>
                        <Link asChild underline="none">
                          <NextLink href={item.href}>
                            <Text size="2" weight="medium">
                              <AppIcon icon={item.icon} />
                               {item.label}
                            </Text>
                          </NextLink>
                        </Link>
                      </NavigationMenu.Item>
                    ))}
                  </NavigationMenu.List>
                </NavigationMenu.Root>
              </Box>

              {/* RIGHT */}
              <ThemeSwitch />
            </Flex>
          </Container>
        </header>
      </Box>

      {/* OVERLAY – MOBILE ONLY */}
      {open && (
        <Box
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--black-a8)',
            zIndex: 40,
          }}
        />
      )}

      {/* SIDEBAR – MOBILE ONLY */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '260px',
          backgroundColor: 'var(--panel)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 200ms ease',
          zIndex: 50,
          padding: '16px',
        }}
        display={{ initial: 'block', md: 'none' }}
      >
        <Flex direction="column" gap="4">
          {/* HEADER SIDEBAR */}
          <Flex justify="between" align="center">
            <Text weight="bold">Menu</Text>
            <IconButton
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              <Icon icon="mdi:close" width="18" />
            </IconButton>
          </Flex>

          {/* LINKS */}
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              asChild
              underline="none"
              onClick={() => setOpen(false)}
            >
              <NextLink href={item.href}>
                <Text size="3">{item.label}</Text>
              </NextLink>
            </Link>
          ))}
        </Flex>
      </Box>
    </>
  );
}

