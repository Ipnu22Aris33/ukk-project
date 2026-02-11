import { ReactNode } from 'react';
import {
  Flex,
  Box,
  Text,
  Heading,
  Container,
  Button,
  Card,
  Grid,
  Separator,
  IconButton,
  Badge,
} from '@radix-ui/themes';
import {
  PlusIcon,
  ChevronDownIcon,
  ClockIcon,
  UpdateIcon,
  DotsVerticalIcon,
  MagnifyingGlassIcon,
  ReaderIcon,
  HeartIcon,
  StarIcon,
  CounterClockwiseClockIcon,
  ArchiveIcon,
} from '@radix-ui/react-icons';

interface MainContentProps {
  children: ReactNode;
  userName?: string;
  stats?: Array<{
    label: string;
    value: string;
    color: string;
    icon: any;
  }>;
  borrowedBooks?: Array<{
    id: number;
    title: string;
    author: string;
    dueDate: string;
    daysLeft: number;
    status: string;
    category: string;
  }>;
}

export  function UserContent({
  children,
  userName = 'Ahmad Fauzi',
  stats = [],
  borrowedBooks = [],
}: MainContentProps) {
  return (
    <Box style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
      <Container size='4'>
        {/* Welcome Section */}
        <Box mb='6'>
          <Flex justify='between' align='start' mb='2'>
            <Box>
              <Heading size='7' mb='1'>
                Halo, {userName.split(' ')[0]}! 👋
              </Heading>
              <Text size='3' color='gray'>
                Semangat membaca hari ini
              </Text>
            </Box>
            <Button size='3' variant='solid'>
              <PlusIcon /> Pinjam Buku
            </Button>
          </Flex>
        </Box>

        {/* Stats Grid */}
        <Grid columns={{ initial: '2', md: '4' }} gap='4' mb='6'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                style={{
                  background: 'white',
                  border: '1px solid var(--gray-6)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <Flex direction='column' gap='3'>
                  <Flex align='center' justify='between'>
                    <Box
                      style={{
                        background: `var(--${stat.color}-3)`,
                        padding: '10px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon width='20' height='20' style={{ color: `var(--${stat.color}-11)` }} />
                    </Box>
                  </Flex>
                  <Box>
                    <Heading size='6' mb='1'>
                      {stat.value}
                    </Heading>
                    <Text size='2' color='gray'>
                      {stat.label}
                    </Text>
                  </Box>
                </Flex>
              </Card>
            );
          })}
        </Grid>

        {/* Borrowed Books Section */}
        <Card mb='6' style={{ background: 'white' }}>
          <Flex justify='between' align='center' mb='4'>
            <Box>
              <Heading size='5' mb='1'>
                Buku yang Sedang Dipinjam
              </Heading>
              <Text size='2' color='gray'>
                Kelola peminjaman bukumu
              </Text>
            </Box>
            <Button variant='soft' size='2'>
              Lihat Semua <ChevronDownIcon />
            </Button>
          </Flex>

          <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap='4'>
            {borrowedBooks.map((book) => (
              <Card
                key={book.id}
                variant='classic'
                style={{
                  borderLeft: `4px solid var(--${book.status === 'warning' ? 'orange' : 'green'}-9)`,
                  background: 'var(--gray-1)',
                }}
              >
                <Flex direction='column' gap='3'>
                  <Flex justify='between' align='start'>
                    <Badge color={book.status === 'warning' ? 'orange' : 'green'} variant='soft' size='1'>
                      {book.status === 'warning' ? `${book.daysLeft} hari lagi` : 'Aktif'}
                    </Badge>
                    <Badge color='gray' variant='surface' size='1'>
                      {book.category}
                    </Badge>
                  </Flex>

                  <Box>
                    <Heading size='3' mb='1'>
                      {book.title}
                    </Heading>
                    <Text size='2' color='gray'>
                      {book.author}
                    </Text>
                  </Box>

                  <Separator size='4' />

                  <Flex align='center' gap='2'>
                    <ClockIcon width='14' height='14' color='gray' />
                    <Text size='1' color='gray'>
                      Kembali: {book.dueDate}
                    </Text>
                  </Flex>

                  <Flex gap='2'>
                    <Button size='2' variant='soft' style={{ flex: 1 }}>
                      <UpdateIcon /> Perpanjang
                    </Button>
                    <IconButton size='2' variant='soft' color='gray'>
                      <DotsVerticalIcon />
                    </IconButton>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Grid>
        </Card>

        {/* Children Content */}
        <Box mb='6'>{children}</Box>

        {/* Quick Actions */}
        <Card style={{ background: 'white' }}>
          <Heading size='4' mb='4'>
            Aksi Cepat
          </Heading>
          <Grid columns={{ initial: '2', sm: '3', md: '6' }} gap='3'>
            <QuickActionCard icon={MagnifyingGlassIcon} color='blue' label='Cari Buku' />
            <QuickActionCard icon={PlusIcon} color='green' label='Pinjam' />
            <QuickActionCard icon={ReaderIcon} color='purple' label='Baca' />
            <QuickActionCard icon={HeartIcon} color='pink' label='Favorit' />
            <QuickActionCard icon={StarIcon} color='amber' label='Rating' />
            <QuickActionCard icon={CounterClockwiseClockIcon} color='orange' label='Riwayat' />
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}

function QuickActionCard({ icon: Icon, color, label }: { icon: any; color: string; label: string }) {
  return (
    <Card variant='classic' style={{ cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
      <Flex direction='column' align='center' gap='2' py='2'>
        <Box
          style={{
            background: `var(--${color}-3)`,
            padding: '12px',
            borderRadius: '12px',
          }}
        >
          <Icon width='20' height='20' color={`var(--${color}-11)`} />
        </Box>
        <Text size='2' weight='medium'>
          {label}
        </Text>
      </Flex>
    </Card>
  );
}