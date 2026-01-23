'use client';

import { useState, useEffect } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import NextLink from 'next/link';
import { Icon } from '@iconify/react';
import { ThemeSwitch } from '@/components/ui/ThemeSwitcher';
import { Box, Container, Flex, Text, Link, IconButton, Button } from '@radix-ui/themes';

export function Header() {
  const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [open]);

  return (
    <>
      {/* HEADER */}
      <Box asChild style={{ borderBottom: '1px solid var(--gray-a6)' }}>
        <header>
          <Container size='4'>
            <Flex height='72px' align='center' justify='between'>
              {/* LEFT */}
              <Flex align='center' gap='8'>
                {/* BURGER – MOBILE */}
                <Box display={{ initial: 'block', md: 'none' }}>
                  <IconButton variant='ghost' size='3' onClick={() => setOpen(true)}>
                    <Icon icon='carbon:menu' width={24} />
                  </IconButton>
                </Box>

                {/* LOGO */}
                <Link asChild underline='none'>
                  <NextLink href='/'>
                    <Flex align='center' gap='2'>
                      <Box display={{ initial: 'none', md: 'block' }}>
                        <Text size='5' weight='bold'>
                          MyApp
                        </Text>
                      </Box>
                    </Flex>
                  </NextLink>
                </Link>

                {/* NAV – DESKTOP */}
                <Box display={{ initial: 'none', md: 'block' }} style={{ marginLeft: '32px' }}>
                  <NavigationMenu.Root>
                    <NavigationMenu.List
                      style={{
                        display: 'flex',
                        gap: '8px',
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      {NAV_ITEMS.map((item) => (
                        <NavigationMenu.Item key={item.href}>
                          <Link asChild underline='none'>
                            <NextLink href={item.href}>
                              <Box style={{ padding: '8px 16px' }}>
                                <Text size='2' weight='medium'>
                                  {item.label}
                                </Text>
                              </Box>
                            </NextLink>
                          </Link>
                        </NavigationMenu.Item>
                      ))}
                    </NavigationMenu.List>
                  </NavigationMenu.Root>
                </Box>
              </Flex>

              {/* RIGHT */}
              <Flex align='center' gap='3'>
                <Box display={{ initial: 'none', md: 'block' }}>
                  <ThemeSwitch />
                </Box>

                <Box display={{ initial: 'none', md: 'block' }}>
                  <Button size='2' variant='solid'>
                    Get Started
                  </Button>
                </Box>
              </Flex>
            </Flex>
          </Container>
        </header>
      </Box>

      {/* OVERLAY – MOBILE */}
      {open && (
        <Box
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--black-a9)',
            zIndex: 999,
          }}
        />
      )}

      {/* SIDEBAR – MOBILE */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '280px',
          backgroundColor: 'var(--color-panel)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1000,
          padding: '24px',
          boxShadow: '2px 0 8px var(--black-a6)',
        }}
        display={{ initial: 'block', md: 'none' }}
      >
        <Flex direction='column' gap='6' height='100%'>
          {/* HEADER SIDEBAR */}
          <Flex justify='between' align='center'>
            <Flex align='center' gap='2'>
              <Box
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, var(--accent-9), var(--accent-10))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon='carbon:application' width='18' color='white' />
              </Box>
              <Text weight='bold' size='4'>
                MyApp
              </Text>
            </Flex>
            <IconButton variant='ghost' size='3' onClick={() => setOpen(false)}>
              <Icon icon='mdi:close' width='24' />
            </IconButton>
          </Flex>

          {/* DIVIDER */}
          <Box style={{ height: '1px', backgroundColor: 'var(--gray-a4)' }} />

          {/* NAV LINKS */}
          <Flex direction='column' gap='2'>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} asChild underline='none' onClick={() => setOpen(false)}>
                <NextLink href={item.href}>
                  <Box style={{ padding: '12px 16px' }}>
                    <Text size='3' weight='medium'>
                      {item.label}
                    </Text>
                  </Box>
                </NextLink>
              </Link>
            ))}
          </Flex>

          {/* DIVIDER */}
          <Box style={{ height: '1px', backgroundColor: 'var(--gray-a4)' }} />

          {/* THEME SWITCH */}
          <Flex align='center' justify='between' style={{ padding: '8px 16px' }}>
            <Text size='3' weight='medium'>
              Theme
            </Text>
            <ThemeSwitch />
          </Flex>

          {/* SPACER */}
          <Box style={{ flex: 1 }} />

          {/* CTA BUTTON */}
          <Button size='3' variant='solid' style={{ width: '100%' }}>
            Get Started
          </Button>
        </Flex>
      </Box>
    </>
  );
}
