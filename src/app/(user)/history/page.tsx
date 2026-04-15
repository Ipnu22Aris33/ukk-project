// app/riwayat/page.tsx
'use client';

import { Container, Flex, Tabs, Box, Card, Text } from '@radix-ui/themes';

import { BookmarkIcon, DownloadIcon, UploadIcon } from '@radix-ui/react-icons';

import { ReservationSection } from './_components/ReservationSection';
import { LoanSection } from './_components/LoanSection';
import { ReturnSection } from './_components/ReturnSection';

export default function RiwayatPage() {
  return (
    <Box
      style={{
        background: 'linear-gradient(to bottom, var(--gray-1), var(--gray-3))',
        minHeight: '100vh',
      }}
    >
      <Container size='4' px='4' py='6'>
        <Flex direction='column' gap='5'>
          {/* Header */}
          <Box>
            <Text size='6' weight='bold'>
              Riwayat
            </Text>
            <Text size='2' color='gray'>
              Kelola dan lihat semua aktivitas perpustakaan kamu
            </Text>
          </Box>

          {/* Tabs */}
          <Card size='3' style={{ backdropFilter: 'blur(6px)' }}>
            <Tabs.Root defaultValue='reservations'>
              <Tabs.List
                size='2'
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  background: 'var(--gray-3)',
                  padding: '6px',
                  borderRadius: 'var(--radius-4)',
                }}
              >
                <Tabs.Trigger value='reservations'>
                  <Flex align='center' justify='center' gap='2' style={{ width: '100%' }}>
                    <BookmarkIcon />
                    Reservasi
                  </Flex>
                </Tabs.Trigger>

                <Tabs.Trigger value='loans'>
                  <Flex align='center' justify='center' gap='2' style={{ width: '100%' }}>
                    <DownloadIcon />
                    Peminjaman
                  </Flex>
                </Tabs.Trigger>

                <Tabs.Trigger value='returns'>
                  <Flex align='center' justify='center' gap='2' style={{ width: '100%' }}>
                    <UploadIcon />
                    Pengembalian
                  </Flex>
                </Tabs.Trigger>
              </Tabs.List>

              <Box mt='5'>
                <Tabs.Content value='reservations'>
                  <ReservationSection />
                </Tabs.Content>

                <Tabs.Content value='loans'>
                  <LoanSection />
                </Tabs.Content>

                <Tabs.Content value='returns'>
                  <ReturnSection />
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          </Card>
        </Flex>
      </Container>
    </Box>
  );
}
