// app/riwayat/page.tsx
"use client";

import { 
  Container,
  Flex,
  Tabs,
  Badge,
  Box,
} from '@radix-ui/themes';

import {
  BookmarkIcon,
  DownloadIcon,
  UploadIcon,
} from '@radix-ui/react-icons';

import { ReservationSection } from './ReservationSection';
import { LoanSection } from './LoanSection';
import { ReturnSection } from './ReturnSection';

export default function RiwayatPage() {
  return (
    <Box style={{ background: 'var(--gray-2)', minHeight: '100vh' }}>
      <Container size="4" px="4" py="6">
        <Tabs.Root defaultValue="reservations">
          <Tabs.List size="2" mb="5">
            <Tabs.Trigger value="reservations">
              <Flex align="center" gap="2">
                <BookmarkIcon />
                Reservasi
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="loans">
              <Flex align="center" gap="2">
                <DownloadIcon />
                Peminjaman Aktif
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="returns">
              <Flex align="center" gap="2">
                <UploadIcon />
                Riwayat Pengembalian
              </Flex>
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="reservations">
            <ReservationSection />
          </Tabs.Content>

          <Tabs.Content value="loans">
            <LoanSection />
          </Tabs.Content>

          <Tabs.Content value="returns">
            <ReturnSection />
          </Tabs.Content>
        </Tabs.Root>
      </Container>
    </Box>
  );
}