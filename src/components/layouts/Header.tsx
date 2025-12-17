'use client';

import { Box, Container, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navItems = [
    { label: 'Docs', href: '/docs', icon: 'mdi:book-open' },
    { label: 'Blog', href: '/blog', icon: 'mdi:pencil' },
    { label: 'About', href: '/about', icon: 'mdi:information' },
  ];

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen, isMobile]);

  return (
    <Box
      asChild
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--gray-a6)',
        backgroundColor: 'var(--color-background)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <header>
        <Container size='4'>
          <Flex height='64px' align='center' justify='between'>
            {/* Logo - LEFT */}
            <Link 
              href='/' 
              onClick={() => setMobileOpen(false)}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <Flex align='center' gap='2'>
                <Icon
                  icon='mdi:cube'
                  width='24'
                  height='24'
                  style={{ color: 'var(--accent-9)' }}
                />
                <Box>
                  <Text weight='bold' size='4' style={{ color: 'var(--gray-12)' }}>
                    MyApp
                  </Text>
                  <Text size='1' color='gray' className='hidden sm:block'>
                    Modern Solutions
                  </Text>
                </Box>
              </Flex>
            </Link>

            {/* Desktop Navigation - CENTER */}
            <Box 
              style={{ 
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              className='hidden md:flex'
            >
              <Flex gap='4' align='center'>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                    className='hover:bg-gray-a3'
                  >
                    <Icon
                      icon={item.icon}
                      width='16'
                      height='16'
                      style={{ color: 'var(--gray-10)' }}
                    />
                    <Text
                      size='2'
                      weight='medium'
                      style={{ color: 'var(--gray-11)' }}
                    >
                      {item.label}
                    </Text>
                  </Link>
                ))}
              </Flex>
            </Box>

            {/* Right Side Actions */}
            <Flex align='center' gap='3'>
              <ThemeSwitch />

              {/* Desktop Get Started Button */}
              <Link
                href='/get-started'
                className='hidden md:block'
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--accent-9)',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none'
                }}
              >
                Get Started
              </Link>

              {/* Mobile Menu Button */}
              <Box
                className='md:hidden'
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  backgroundColor: mobileOpen ? 'var(--gray-a3)' : 'transparent',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '8px',
                }}
              >
                <Icon
                  icon={mobileOpen ? 'mdi:close' : 'mdi:menu'}
                  width='20'
                  height='20'
                  style={{ color: 'var(--gray-11)' }}
                />
              </Box>
            </Flex>
          </Flex>

          {/* Mobile Menu */}
          {mobileOpen && (
            <Box
              className='md:hidden'
              style={{
                position: 'fixed',
                top: '64px',
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'var(--color-background)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                borderTop: '1px solid var(--gray-a6)',
                overflowY: 'auto',
              }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textDecoration: 'none'
                  }}
                  className='hover:bg-gray-a3'
                >
                  <Icon
                    icon={item.icon}
                    width='20'
                    height='20'
                    style={{ color: 'var(--accent-9)' }}
                  />
                  <Text size='3' weight='medium' style={{ color: 'var(--gray-12)' }}>
                    {item.label}
                  </Text>
                </Link>
              ))}
              
              <Link
                href='/get-started'
                onClick={() => setMobileOpen(false)}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--accent-9)',
                  color: 'white',
                  fontWeight: '500',
                  textAlign: 'center',
                  fontSize: '14px',
                  transition: 'background-color 0.2s ease',
                  textDecoration: 'none'
                }}
                className='hover:bg-accent-10'
              >
                Get Started
              </Link>
            </Box>
          )}
        </Container>
      </header>
    </Box>
  );
}