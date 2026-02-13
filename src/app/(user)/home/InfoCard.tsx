import React from 'react';
import { Card, Flex, Avatar, Text, Badge, Box, Button } from '@radix-ui/themes';

// Data contoh anggota perpustakaan
const memberData = {
  id: 'LIB2024001',
  name: 'Budi Santoso',
  email: 'budi.santoso@email.com',
  memberSince: '15 Januari 2024',
  status: 'active',
  borrowedBooks: 3,
  maxBorrow: 5,
  dueDate: '20 Februari 2026',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
};

export function InfoCard() {
  const { id, name, email, memberSince, status, borrowedBooks, maxBorrow, dueDate, avatar } = memberData;

  return (
    <>
      <Card size='4' style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Flex direction='column' gap='4'>
          {/* Header dengan Avatar dan Info Dasar */}
          <Flex gap='3' align='center'>
            <Avatar size='6' src={avatar} fallback={name.substring(0, 2).toUpperCase()} radius='full' />
            <Box style={{ flex: 1 }}>
              <Flex align='center' gap='2' mb='1'>
                <Text size='5' weight='bold'>
                  {name}
                </Text>
                <Badge color={status === 'active' ? 'green' : 'gray'} radius='full'>
                  {status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </Flex>
              <Text size='2' color='gray'>
                {email}
              </Text>
              <Text size='1' color='gray'>
                ID: {id}
              </Text>
            </Box>
          </Flex>

          {/* Divider */}
          <Box style={{ height: '1px', background: '#e2e8f0' }} />

          {/* Informasi Keanggotaan */}
          <Flex direction='column' gap='3'>
            <Flex justify='between' align='center'>
              <Text size='2' color='gray'>
                Anggota Sejak
              </Text>
              <Text size='2' weight='medium'>
                {memberSince}
              </Text>
            </Flex>

            <Flex justify='between' align='center'>
              <Text size='2' color='gray'>
                Buku Dipinjam
              </Text>
              <Flex gap='1' align='center'>
                <Text size='2' weight='bold' color='blue'>
                  {borrowedBooks}
                </Text>
                <Text size='2' color='gray'>
                  / {maxBorrow}
                </Text>
              </Flex>
            </Flex>

            {borrowedBooks > 0 && (
              <Flex justify='between' align='center'>
                <Text size='2' color='gray'>
                  Jatuh Tempo
                </Text>
                <Badge color='amber' variant='soft'>
                  {dueDate}
                </Badge>
              </Flex>
            )}

            {/* Progress Bar */}
            <Box>
              <Flex justify='between' mb='1'>
                <Text size='1' color='gray'>
                  Kuota Peminjaman
                </Text>
                <Text size='1' color='gray'>
                  {borrowedBooks}/{maxBorrow}
                </Text>
              </Flex>
              <Box
                style={{
                  width: '100%',
                  height: '8px',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  style={{
                    width: `${(borrowedBooks / maxBorrow) * 100}%`,
                    height: '100%',
                    background: borrowedBooks >= maxBorrow ? '#ef4444' : '#3b82f6',
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
            </Box>
          </Flex>

          {/* Divider */}
          <Box style={{ height: '1px', background: '#e2e8f0' }} />

          {/* Action Buttons */}
          <Flex gap='2'>
            <Button style={{ flex: 1 }} variant='solid'>
              Lihat Riwayat
            </Button>
            <Button style={{ flex: 1 }} variant='outline'>
              Perpanjang
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Card Tambahan - Daftar Buku Dipinjam */}
      <Card size='3' style={{ maxWidth: '500px', margin: '1rem auto' }}>
        <Text size='4' weight='bold' mb='3' style={{ display: 'block' }}>
          Buku Sedang Dipinjam
        </Text>

        <Flex direction='column' gap='3'>
          {[
            { title: 'Laskar Pelangi', author: 'Andrea Hirata', due: '20 Feb 2026' },
            { title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', due: '20 Feb 2026' },
            { title: 'Sang Pemimpi', author: 'Andrea Hirata', due: '18 Feb 2026' },
          ].map((book, idx) => (
            <Flex
              key={idx}
              justify='between'
              align='start'
              p='2'
              style={{
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box style={{ flex: 1 }}>
                <Text size='2' weight='medium' style={{ display: 'block' }}>
                  {book.title}
                </Text>
                <Text size='1' color='gray'>
                  {book.author}
                </Text>
              </Box>
              <Text size='1' color='gray'>
                {book.due}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Card>
    </>
  );
}
