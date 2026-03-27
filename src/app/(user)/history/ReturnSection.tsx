// app/riwayat/components/PengembalianSection.tsx
"use client";

import { 
  Card,
  Flex,
  Text,
  Heading,
  Badge,
  Box,
  Table,
  Button,
  Spinner,
} from '@radix-ui/themes';

import {
  EyeOpenIcon,
} from '@radix-ui/react-icons';

import { useReturns } from '@/hooks/useReturns';

export function ReturnSection() {
  const returns = useReturns();
  const { data, isLoading } = returns.list({
    page: 1,
    limit: 10,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const getFineStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge color="green">Lunas</Badge>;
      default:
        return <Badge color="red">Belum Dibayar</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'good':
        return <Badge color="green">Baik</Badge>;
      case 'damaged':
        return <Badge color="orange">Rusak</Badge>;
      case 'lost':
        return <Badge color="red">Hilang</Badge>;
      default:
        return <Badge>{condition}</Badge>;
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
        <Heading size="4">Riwayat Pengembalian</Heading>

        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Buku</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Tanggal Pinjam</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Tanggal Kembali</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Denda</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Kondisi</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data?.data?.map((returnItem: any) => (
              <Table.Row key={returnItem.id}>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    {returnItem.loan?.book?.coverUrl ? (
                      <img 
                        src={returnItem.loan.book.coverUrl} 
                        alt={returnItem.loan.book.title}
                        style={{ 
                          width: 32, 
                          height: 40, 
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-2)' 
                        }} 
                      />
                    ) : (
                      <Box 
                        style={{ 
                          width: 32, 
                          height: 40, 
                          background: 'var(--gray-9)', 
                          borderRadius: 'var(--radius-2)' 
                        }} 
                      />
                    )}
                    <Box>
                      <Text size="2" weight="bold">{returnItem.loan?.book?.title}</Text>
                      <Text size="1" style={{ color: 'var(--gray-11)' }}>{returnItem.loan?.book?.author}</Text>
                    </Box>
                  </Flex>
                </Table.Cell>
                <Table.Cell>{formatDate(returnItem.loan?.loanDate)}</Table.Cell>
                <Table.Cell>{formatDateTime(returnItem.returnedAt)}</Table.Cell>
                <Table.Cell>
                  {returnItem.fineAmount > 0 ? (
                    <Box>
                      <Text style={{ color: 'var(--red-11)' }}>Rp {returnItem.fineAmount.toLocaleString()}</Text>
                      {getFineStatusBadge(returnItem.fineStatus)}
                    </Box>
                  ) : '-'}
                </Table.Cell>
                <Table.Cell>
                  {getConditionBadge(returnItem.condition)}
                </Table.Cell>
                <Table.Cell>
                  <Button variant="ghost" size="1">
                    <EyeOpenIcon />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {data?.data?.length === 0 && (
          <Flex justify="center" py="8">
            <Text style={{ color: 'var(--gray-11)' }}>Tidak ada riwayat pengembalian</Text>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}