'use client';

import { Box, Container, Flex, Grid, Text, Separator } from '@radix-ui/themes';
import { ArchiveIcon, EnvelopeClosedIcon, HomeIcon, ClockIcon } from '@radix-ui/react-icons';

interface FooterProps {
  schoolName?: string;
}

export function UserFooter({ schoolName = 'SMA Negeri 1' }: FooterProps) {
  const quickMenuItems = ['Tentang Perpustakaan', 'Syarat & Ketentuan', 'Panduan Peminjaman', 'FAQ'];

  const contactItems = [
    { icon: EnvelopeClosedIcon, label: 'library@school.edu' },
    { icon: HomeIcon, label: 'Gedung Perpustakaan Lt.2' },
    { icon: ClockIcon, label: 'Senin - Jumat, 07:00 - 16:00' },
  ];

  return (
    <Box
      style={{
        borderTop: '1px solid var(--gray-6)',
        backgroundColor: 'var(--color-panel-solid)',
      }}
      py='5'
    >
      <Container size='4' px={{ initial: '4', md: '0' }}>
        <Grid columns={{ initial: '1', md: '3' }} gap={{ initial: '5', md: '6' }}>
          {/* Brand Section */}
          <Box>
            <Flex align='center' gap='2' mb='3'>
              <Box
                style={{
                  background: 'linear-gradient(135deg, var(--indigo-9) 0%, var(--purple-9) 100%)',
                  padding: '8px',
                  borderRadius: 'var(--radius-3)',
                }}
              >
                <ArchiveIcon width='18' height='18' color='white' />
              </Box>
              <Text size={{ initial: '2', sm: '3' }} weight='bold'>
                Perpustakaan Digital
              </Text>
            </Flex>
            <Text size={{ initial: '1', sm: '2' }} color='gray' style={{ lineHeight: 'var(--line-height-4)' }}>
              {schoolName} - Membangun generasi cerdas melalui budaya literasi
            </Text>
          </Box>

          {/* Quick Menu */}
          <Box>
            <Text size={{ initial: '2', sm: '2' }} weight='bold' mb='3' as='div'>
              Menu Cepat
            </Text>
            <Flex direction='column' gap='2'>
              {quickMenuItems.map((item) => (
                <Text
                  key={item}
                  size={{ initial: '1', sm: '2' }}
                  color='gray'
                  style={{
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gray-12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-11)')}
                >
                  {item}
                </Text>
              ))}
            </Flex>
          </Box>

          {/* Contact Section */}
          <Box>
            <Text size={{ initial: '2', sm: '2' }} weight='bold' mb='3' as='div'>
              Hubungi Kami
            </Text>
            <Flex direction='column' gap='2'>
              {contactItems.map(({ icon: Icon, label }) => (
                <Flex key={label} align='center' gap='2'>
                  <Box
                    style={{
                      color: 'var(--gray-11)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Icon width='14' height='14' />
                  </Box>
                  <Text size={{ initial: '1', sm: '2' }} color='gray'>
                    {label}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Box>
        </Grid>

        <Separator size='4' my={{ initial: '3', sm: '4' }} />

        {/* Bottom Bar */}
        <Flex justify='between' align='center' direction={{ initial: 'column', sm: 'row' }} gap={{ initial: '3', sm: '0' }}>
          <Text size={{ initial: '1', sm: '1' }} color='gray'>
            © 2026 {schoolName}. Hak Cipta Dilindungi.
          </Text>
          <Flex gap='3' align='center'>
            <Text
              size={{ initial: '1', sm: '1' }}
              color='gray'
              style={{
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gray-12)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-11)')}
            >
              Kebijakan Privasi
            </Text>

            {/* Desktop Vertical Separator */}
            <Box display={{ initial: 'none', sm: 'block' }}>
              <Separator orientation='vertical' size='1' />
            </Box>

            {/* Mobile Dot Separator - Menggunakan Box dengan text */}
            <Box
              display={{ initial: 'block', sm: 'none' }}
              style={{
                color: 'var(--gray-8)',
                fontSize: '14px',
                lineHeight: 1,
              }}
            >
              •
            </Box>

            <Text
              size={{ initial: '1', sm: '1' }}
              color='gray'
              style={{
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gray-12)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-11)')}
            >
              Bantuan
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
