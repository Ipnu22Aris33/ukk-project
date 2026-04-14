// app/riwayat/components/PeminjamanSection.tsx
"use client";

import { 
  Card,
  Flex,
  Grid,
  Text,
  Heading,
  Badge,
  Box,
  DataList,
  Button,
  Spinner,
} from '@radix-ui/themes';

import {
  CalendarIcon,
  TimerIcon,
  UpdateIcon,
} from '@radix-ui/react-icons';

import { useLoans } from '@/hooks/useLoans';

export function LoanSection() {
  const loans = useLoans();
  const { data, isLoading } = loans.list({
    page: 1,
    limit: 10,
  });

  const activeLoans = data?.data?.filter((loan: any) => loan.status === 'borrowed') || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <Badge color="red">{Math.abs(diffDays)} hari terlambat</Badge>;
    } else if (diffDays <= 3) {
      return <Badge color="amber">{diffDays} hari lagi</Badge>;
    } else {
      return <Badge color="green">{diffDays} hari lagi</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card size="3">
        <Flex justify="center" py="8">
          <Spinner size="3" />
        </Flex>
      </Card>
    );
  }

  return (
    <Card size="3">
      <Flex direction="column" gap="4">
        <Heading size="4">Peminjaman Aktif</Heading>

        <Grid columns={{ initial: '1', md: '2' }} gap="4">
          {activeLoans.map((loan: any) => (
            <Card key={loan.id} size="2">
              <Flex gap="3">
                {loan.book?.coverUrl ? (
                  <img 
                    src={loan.book.coverUrl} 
                    alt={loan.book.title}
                    style={{ 
                      width: 70,
                      height: 90,
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-3)',
                      flexShrink: 0
                    }}
                  />
                ) : (
                  <Box 
                    style={{ 
                      width: 70,
                      height: 90,
                      background: 'var(--gray-9)',
                      borderRadius: 'var(--radius-3)',
                      flexShrink: 0
                    }}
                  />
                )}
                
                <Box style={{ flex: 1 }}>
                  <Flex align="center" justify="between" mb="1">
                    <Text size="3" weight="bold">{loan.book?.title}</Text>
                    <Badge color="blue">Dipinjam</Badge>
                  </Flex>
                  
                  <Text size="2" style={{ color: 'var(--gray-11)' }} mb="2">
                    {loan.book?.author}
                  </Text>
                  
                  <DataList.Root size="1">
                    <DataList.Item>
                      <DataList.Label minWidth="70px">
                        <Flex align="center" gap="1">
                          <CalendarIcon />
                          Dipinjam
                        </Flex>
                      </DataList.Label>
                      <DataList.Value>
                        {formatDate(loan.loanDate)}
                      </DataList.Value>
                    </DataList.Item>
                    
                    <DataList.Item>
                      <DataList.Label minWidth="70px">
                        <Flex align="center" gap="1">
                          <TimerIcon />
                          Jatuh Tempo
                        </Flex>
                      </DataList.Label>
                      <DataList.Value>
                        <Flex align="center" gap="1">
                          {formatDate(loan.dueDate)}
                          {getDaysLeft(loan.dueDate)}
                        </Flex>
                      </DataList.Value>
                    </DataList.Item>

                    {loan.quantity > 1 && (
                      <DataList.Item>
                        <DataList.Label>Jumlah</DataList.Label>
                        <DataList.Value>{loan.quantity} buku</DataList.Value>
                      </DataList.Item>
                    )}
                  </DataList.Root>

                  <Flex gap="2" mt="3">
                    <Button size="1" variant="soft" style={{ flex: 1 }}>
                      <UpdateIcon />
                      Perpanjang
                    </Button>
                    <Button size="1" style={{ flex: 1 }}>
                      Kembalikan
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Card>
          ))}
        </Grid>

        {activeLoans.length === 0 && (
          <Flex justify="center" py="8">
            <Text style={{ color: 'var(--gray-11)' }}>Tidak ada peminjaman aktif</Text>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}