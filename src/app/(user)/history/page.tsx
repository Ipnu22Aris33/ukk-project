// app/riwayat/page.tsx
import { 
  Container,
  Flex,
  Grid,
  Card,
  Text,
  Heading,
  Tabs,
  Badge,
  Box,
  Section,
  Separator,
  Strong,
  DataList,
  Avatar,
  Inset,
  Button,
  Table,
  Tooltip,
  Select
} from '@radix-ui/themes';

import {
  BookmarkIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  UpdateIcon,
  UploadIcon,
  DownloadIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  ReaderIcon,
  FileTextIcon,
  HeartIcon,
  StarFilledIcon,
  StarIcon,
  EyeOpenIcon,
  DotsHorizontalIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  RocketIcon,
  LapTimerIcon,
  StopwatchIcon,
  TimerIcon,
  CounterClockwiseClockIcon,
  CircleIcon,
  CheckIcon,
  Cross2Icon,
  PlusIcon,
  MinusIcon,
  HomeIcon,
  Share1Icon,
  BookmarkFilledIcon,
  EnvelopeOpenIcon
} from '@radix-ui/react-icons';

// Data dummy untuk user profile
const userProfile = {
  name: "Budi Santoso",
  email: "budi.santoso@email.com",
  memberId: "MBR-2024-0123",
  joinDate: "15 Januari 2024",
  totalBooks: 24,
  currentlyBorrowed: 3,
  totalReservations: 2,
  totalReturns: 19,
  fines: 0
};

// Data dummy untuk reservasi aktif
const activeReservations = [
  {
    id: "RSV-001",
    bookTitle: "Atomic Habits",
    bookAuthor: "James Clear",
    bookCover: "green",
    reservationDate: "2024-01-15",
    expiryDate: "2024-01-22",
    status: "ready",
    queuePosition: 0,
    pickupLocation: "Perpustakaan Pusat"
  },
  {
    id: "RSV-002",
    bookTitle: "The Psychology of Money",
    bookAuthor: "Morgan Housel",
    bookCover: "purple",
    reservationDate: "2024-01-14",
    expiryDate: "2024-01-21",
    status: "waiting",
    queuePosition: 3,
    pickupLocation: "Perpustakaan Pusat"
  },
  {
    id: "RSV-003",
    bookTitle: "Sapiens",
    bookAuthor: "Yuval Noah Harari",
    bookCover: "indigo",
    reservationDate: "2024-01-10",
    expiryDate: "2024-01-17",
    status: "expired",
    queuePosition: 0,
    pickupLocation: "Perpustakaan Pusat"
  }
];

// Data dummy untuk peminjaman aktif
const activeLoans = [
  {
    id: "L-001",
    bookTitle: "Laskar Pelangi",
    bookAuthor: "Andrea Hirata",
    bookCover: "red",
    borrowDate: "2024-01-01",
    dueDate: "2024-01-15",
    returnDate: null,
    status: "on-time",
    fine: 0,
    renewable: true
  },
  {
    id: "L-002",
    bookTitle: "The Silent Patient",
    bookAuthor: "Alex Michaelides",
    bookCover: "blue",
    borrowDate: "2023-12-20",
    dueDate: "2024-01-03",
    returnDate: null,
    status: "overdue",
    fine: 15000,
    renewable: false
  },
  {
    id: "L-003",
    bookTitle: "Bumi Manusia",
    bookAuthor: "Pramoedya Ananta Toer",
    bookCover: "amber",
    borrowDate: "2024-01-05",
    dueDate: "2024-01-19",
    returnDate: null,
    status: "on-time",
    fine: 0,
    renewable: true
  },
  {
    id: "L-004",
    bookTitle: "The Alchemist",
    bookAuthor: "Paulo Coelho",
    bookCover: "bronze",
    borrowDate: "2024-01-10",
    dueDate: "2024-01-24",
    returnDate: null,
    status: "on-time",
    fine: 0,
    renewable: true
  }
];

// Data dummy untuk riwayat pengembalian
const returnHistory = [
  {
    id: "R-001",
    bookTitle: "Pulang",
    bookAuthor: "Tere Liye",
    bookCover: "orange",
    borrowDate: "2023-12-01",
    returnDate: "2023-12-15",
    status: "on-time",
    fine: 0,
    rating: 4
  },
  {
    id: "R-002",
    bookTitle: "Hujan",
    bookAuthor: "Tere Liye",
    bookCover: "cyan",
    borrowDate: "2023-11-15",
    returnDate: "2023-12-05",
    status: "overdue",
    fine: 10000,
    rating: 5
  },
  {
    id: "R-003",
    bookTitle: "The Psychology of Money",
    bookAuthor: "Morgan Housel",
    bookCover: "purple",
    borrowDate: "2023-12-10",
    returnDate: "2023-12-20",
    status: "on-time",
    fine: 0,
    rating: null
  },
  {
    id: "R-004",
    bookTitle: "Atomic Habits",
    bookAuthor: "James Clear",
    bookCover: "green",
    borrowDate: "2023-11-20",
    returnDate: "2023-12-04",
    status: "on-time",
    fine: 0,
    rating: 5
  },
  {
    id: "R-005",
    bookTitle: "Sapiens",
    bookAuthor: "Yuval Noah Harari",
    bookCover: "indigo",
    borrowDate: "2023-10-01",
    returnDate: "2023-10-20",
    status: "on-time",
    fine: 0,
    rating: 4
  },
  {
    id: "R-006",
    bookTitle: "The Silent Patient",
    bookAuthor: "Alex Michaelides",
    bookCover: "blue",
    borrowDate: "2023-12-05",
    returnDate: "2023-12-15",
    status: "on-time",
    fine: 0,
    rating: 3
  }
];

// Statistik untuk chart (dummy)
const monthlyStats = [
  { month: "Jan", borrowed: 5, returned: 3 },
  { month: "Feb", borrowed: 7, returned: 6 },
  { month: "Mar", borrowed: 4, returned: 5 },
  { month: "Apr", borrowed: 8, returned: 7 },
  { month: "Mei", borrowed: 6, returned: 4 },
  { month: "Jun", borrowed: 9, returned: 8 }
];

export default function RiwayatPage() {
  return (
    <Box style={{ background: 'var(--gray-2)', minHeight: '100vh' }}>
      {/* Header Section dengan Profile */}
      <Section size="2" style={{ background: 'var(--gray-1)', borderBottom: '1px solid var(--gray-4)' }}>
        <Container size="4">
          <Flex direction="column" gap="6">
            {/* Profile Header */}
            <Flex align="center" gap="5" wrap="wrap">
              <Avatar
                size="6"
                radius="full"
                fallback="BS"
                color="violet"
              />
              
              <Box>
                <Flex align="center" gap="2" mb="1">
                  <Heading size="7">{userProfile.name}</Heading>
                  <Badge color="green" variant="soft" highContrast>
                    <Flex align="center" gap="1">
                      <CheckCircledIcon />
                      Aktif
                    </Flex>
                  </Badge>
                </Flex>
                
                <Flex align="center" gap="4" wrap="wrap">
                  <Flex align="center" gap="1">
                    <PersonIcon />
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>{userProfile.memberId}</Text>
                  </Flex>
                  <Flex align="center" gap="1">
                    <CalendarIcon />
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>Bergabung {userProfile.joinDate}</Text>
                  </Flex>
                  <Flex align="center" gap="1">
                    <EnvelopeOpenIcon />
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>{userProfile.email}</Text>
                  </Flex>
                </Flex>
              </Box>
            </Flex>

            {/* Stats Cards */}
            <Grid columns={{ initial: '2', sm: '4' }} gap="4">
              <Card size="2">
                <Flex direction="column">
                  <Text size="6" weight="bold">{userProfile.totalBooks}</Text>
                  <Text size="2" style={{ color: 'var(--gray-11)' }}>Total Buku</Text>
                </Flex>
              </Card>
              <Card size="2">
                <Flex direction="column">
                  <Text size="6" weight="bold" style={{ color: 'var(--blue-11)' }}>
                    {userProfile.currentlyBorrowed}
                  </Text>
                  <Text size="2" style={{ color: 'var(--gray-11)' }}>Sedang Dipinjam</Text>
                </Flex>
              </Card>
              <Card size="2">
                <Flex direction="column">
                  <Text size="6" weight="bold" style={{ color: 'var(--amber-11)' }}>
                    {userProfile.totalReservations}
                  </Text>
                  <Text size="2" style={{ color: 'var(--gray-11)' }}>Reservasi Aktif</Text>
                </Flex>
              </Card>
              <Card size="2">
                <Flex direction="column">
                  <Text size="6" weight="bold" style={{ color: userProfile.fines > 0 ? 'var(--red-11)' : 'var(--green-11)' }}>
                    {userProfile.fines > 0 ? `Rp ${userProfile.fines.toLocaleString()}` : 'Rp 0'}
                  </Text>
                  <Text size="2" style={{ color: 'var(--gray-11)' }}>Total Denda</Text>
                </Flex>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Flex gap="3" wrap="wrap">
              <Button size="3">
                <PlusIcon />
                Reservasi Buku
              </Button>
              <Button size="3" variant="soft">
                <UpdateIcon />
                Perpanjang Semua
              </Button>
              <Button size="3" variant="soft">
                <DownloadIcon />
                Unduh Riwayat
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Section>

      {/* Main Content */}
      <Container size="4" px="4" py="6">
        {/* Tabs Navigation */}
        <Tabs.Root defaultValue="reservations">
          <Tabs.List size="2" mb="5">
            <Tabs.Trigger value="reservations">
              <Flex align="center" gap="2">
                <BookmarkIcon />
                Reservasi
                <Badge color="violet" variant="soft" radius="full">
                  {activeReservations.length}
                </Badge>
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="loans">
              <Flex align="center" gap="2">
                <DownloadIcon />
                Peminjaman Aktif
                <Badge color="blue" variant="soft" radius="full">
                  {activeLoans.length}
                </Badge>
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="returns">
              <Flex align="center" gap="2">
                <UploadIcon />
                Riwayat Pengembalian
                <Badge color="green" variant="soft" radius="full">
                  {returnHistory.length}
                </Badge>
              </Flex>
            </Tabs.Trigger>
          </Tabs.List>

          {/* Reservations Tab */}
          <Tabs.Content value="reservations">
            <Flex direction="column" gap="4">
              {/* Active Reservations */}
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Flex align="center" justify="between">
                    <Heading size="4">Reservasi Aktif</Heading>
                    <Button variant="ghost" size="2">
                      Lihat Semua
                      <ChevronRightIcon />
                    </Button>
                  </Flex>

                  <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
                    {activeReservations.map((reservation) => (
                      <Card key={reservation.id} size="2">
                        <Flex gap="3">
                          <Box 
                            style={{ 
                              width: 60,
                              height: 80,
                              background: `linear-gradient(135deg, var(--${reservation.bookCover}-9), var(--${reservation.bookCover}-11))`,
                              borderRadius: 'var(--radius-3)',
                              flexShrink: 0
                            }}
                          />
                          
                          <Box style={{ flex: 1 }}>
                            <Flex align="center" justify="between" mb="1">
                              <Text size="3" weight="bold">{reservation.bookTitle}</Text>
                              <Badge 
                                color={
                                  reservation.status === 'ready' ? 'green' :
                                  reservation.status === 'waiting' ? 'amber' : 'red'
                                }
                                variant="soft"
                                size="1"
                              >
                                {reservation.status === 'ready' && 'Siap Diambil'}
                                {reservation.status === 'waiting' && `Antrian ke-${reservation.queuePosition}`}
                                {reservation.status === 'expired' && 'Kadaluarsa'}
                              </Badge>
                            </Flex>
                            
                            <Text size="2" style={{ color: 'var(--gray-11)' }} mb="2">
                              {reservation.bookAuthor}
                            </Text>
                            
                            <DataList.Root size="1">
                              <DataList.Item>
                                <DataList.Label minWidth="60px">
                                  <Flex align="center" gap="1">
                                    <CalendarIcon />
                                    Reservasi
                                  </Flex>
                                </DataList.Label>
                                <DataList.Value>
                                  {new Date(reservation.reservationDate).toLocaleDateString('id-ID')}
                                </DataList.Value>
                              </DataList.Item>
                              
                              <DataList.Item>
                                <DataList.Label minWidth="60px">
                                  <Flex align="center" gap="1">
                                    <TimerIcon />
                                    Expiry
                                  </Flex>
                                </DataList.Label>
                                <DataList.Value>
                                  {new Date(reservation.expiryDate).toLocaleDateString('id-ID')}
                                </DataList.Value>
                              </DataList.Item>
                            </DataList.Root>

                            {reservation.status === 'ready' && (
                              <Flex gap="2" mt="3">
                                <Button size="1" style={{ flex: 1 }}>
                                  Ambil Buku
                                </Button>
                                <Button size="1" variant="soft" color="red">
                                  Batalkan
                                </Button>
                              </Flex>
                            )}

                            {reservation.status === 'waiting' && (
                              <Flex gap="2" mt="3">
                                <Button size="1" variant="soft" disabled style={{ flex: 1 }}>
                                  Menunggu Tersedia
                                </Button>
                                <Tooltip content="Batalkan reservasi">
                                  <Button size="1" variant="ghost" color="red">
                                    <Cross2Icon />
                                  </Button>
                                </Tooltip>
                              </Flex>
                            )}
                          </Box>
                        </Flex>
                      </Card>
                    ))}
                  </Grid>
                </Flex>
              </Card>

              {/* Reservation History */}
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Heading size="4">Riwayat Reservasi</Heading>
                  
                  <Table.Root variant="surface">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Buku</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Tanggal Reservasi</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Tanggal Diambil</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>
                          <Flex align="center" gap="2">
                            <Box style={{ width: 32, height: 40, background: 'var(--green-9)', borderRadius: 'var(--radius-2)' }} />
                            <Box>
                              <Text size="2" weight="bold">Atomic Habits</Text>
                              <Text size="1" style={{ color: 'var(--gray-11)' }}>James Clear</Text>
                            </Box>
                          </Flex>
                        </Table.Cell>
                        <Table.Cell>10 Jan 2024</Table.Cell>
                        <Table.Cell>
                          <Badge color="green">Selesai</Badge>
                        </Table.Cell>
                        <Table.Cell>12 Jan 2024</Table.Cell>
                        <Table.Cell>
                          <Button variant="ghost" size="1">
                            <EyeOpenIcon />
                          </Button>
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell>
                          <Flex align="center" gap="2">
                            <Box style={{ width: 32, height: 40, background: 'var(--purple-9)', borderRadius: 'var(--radius-2)' }} />
                            <Box>
                              <Text size="2" weight="bold">The Psychology of Money</Text>
                              <Text size="1" style={{ color: 'var(--gray-11)' }}>Morgan Housel</Text>
                            </Box>
                          </Flex>
                        </Table.Cell>
                        <Table.Cell>5 Jan 2024</Table.Cell>
                        <Table.Cell>
                          <Badge color="red">Dibatalkan</Badge>
                        </Table.Cell>
                        <Table.Cell>-</Table.Cell>
                        <Table.Cell>
                          <Button variant="ghost" size="1">
                            <EyeOpenIcon />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                </Flex>
              </Card>
            </Flex>
          </Tabs.Content>

          {/* Loans Tab */}
          <Tabs.Content value="loans">
            <Flex direction="column" gap="4">
              {/* Active Loans */}
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Flex align="center" justify="between">
                    <Heading size="4">Peminjaman Aktif</Heading>
                    <Flex gap="2">
                      <Button variant="ghost" size="2">
                            <DownloadIcon />
                            Perpanjang Semua
                          </Button>
                      <Button variant="ghost" size="2">
                        <MagnifyingGlassIcon />
                        Cari
                      </Button>
                    </Flex>
                  </Flex>

                  <Grid columns={{ initial: '1', md: '2' }} gap="4">
                    {activeLoans.map((loan) => {
                      const daysLeft = Math.ceil((new Date(loan.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <Card key={loan.id} size="2">
                          <Flex gap="3">
                            <Box 
                              style={{ 
                                width: 70,
                                height: 90,
                                background: `linear-gradient(135deg, var(--${loan.bookCover}-9), var(--${loan.bookCover}-11))`,
                                borderRadius: 'var(--radius-3)',
                                flexShrink: 0
                              }}
                            />
                            
                            <Box style={{ flex: 1 }}>
                              <Flex align="center" justify="between" mb="1">
                                <Text size="3" weight="bold">{loan.bookTitle}</Text>
                                <Badge 
                                  color={loan.status === 'on-time' ? 'green' : 'red'}
                                  variant="soft"
                                >
                                  {loan.status === 'on-time' ? 'Tepat Waktu' : 'Terlambat'}
                                </Badge>
                              </Flex>
                              
                              <Text size="2" style={{ color: 'var(--gray-11)' }} mb="2">
                                {loan.bookAuthor}
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
                                    {new Date(loan.borrowDate).toLocaleDateString('id-ID')}
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
                                      {new Date(loan.dueDate).toLocaleDateString('id-ID')}
                                      {loan.status === 'on-time' && (
                                        <Badge color={daysLeft <= 3 ? 'amber' : 'green'} size="1">
                                          {daysLeft <= 0 ? 'Hari ini' : `${daysLeft} hari lagi`}
                                        </Badge>
                                      )}
                                    </Flex>
                                  </DataList.Value>
                                </DataList.Item>

                                {loan.fine > 0 && (
                                  <DataList.Item>
                                    <DataList.Label minWidth="70px">
                                      <Flex align="center" gap="1">
                                        <ExclamationTriangleIcon />
                                        Denda
                                      </Flex>
                                    </DataList.Label>
                                    <DataList.Value style={{ color: 'var(--red-11)' }}>
                                      Rp {loan.fine.toLocaleString()}
                                    </DataList.Value>
                                  </DataList.Item>
                                )}
                              </DataList.Root>

                              <Flex gap="2" mt="3">
                                {loan.renewable && loan.status === 'on-time' && (
                                  <Button size="1" variant="soft" style={{ flex: 1 }}>
                                    <UpdateIcon />
                                    Perpanjang
                                  </Button>
                                )}
                                <Button size="1" style={{ flex: 1 }}>
                                  Kembalikan
                                </Button>
                                {loan.fine > 0 && (
                                  <Button size="1" variant="soft" color="red">
                                    Bayar Denda
                                  </Button>
                                )}
                              </Flex>
                            </Box>
                          </Flex>
                        </Card>
                      );
                    })}
                  </Grid>
                </Flex>
              </Card>

              {/* Summary Card */}
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Heading size="4">Ringkasan Peminjaman</Heading>
                  
                  <Grid columns={{ initial: '2', md: '4' }} gap="4">
                    <Box>
                      <Text size="2" style={{ color: 'var(--gray-11)' }}>Total Dipinjam</Text>
                      <Text size="6" weight="bold">12</Text>
                      <Text size="1" style={{ color: 'var(--gray-11)' }}>Bulan ini</Text>
                    </Box>
                    
                    <Box>
                      <Text size="2" style={{ color: 'var(--gray-11)' }}>Rata-rata</Text>
                      <Text size="6" weight="bold">8.5</Text>
                      <Text size="1" style={{ color: 'var(--gray-11)' }}>Hari/buku</Text>
                    </Box>
                    
                    <Box>
                      <Text size="2" style={{ color: 'var(--gray-11)' }}>Tepat Waktu</Text>
                      <Text size="6" weight="bold" style={{ color: 'var(--green-11)' }}>85%</Text>
                      <Text size="1" style={{ color: 'var(--gray-11)' }}>Dari total 20</Text>
                    </Box>
                    
                    <Box>
                      <Text size="2" style={{ color: 'var(--gray-11)' }}>Total Denda</Text>
                      <Text size="6" weight="bold" style={{ color: 'var(--red-11)' }}>Rp 45k</Text>
                      <Text size="1" style={{ color: 'var(--gray-11)' }}>Tahun ini</Text>
                    </Box>
                  </Grid>

                  {/* Monthly Stats Chart (simplified) */}
                  <Box mt="2">
                    <Text size="2" weight="medium" mb="2">Aktivitas Bulanan</Text>
                    <Flex gap="2" align="end" style={{ height: 100 }}>
                      {monthlyStats.map((stat) => (
                        <Tooltip key={stat.month} content={`${stat.borrowed} dipinjam, ${stat.returned} dikembalikan`}>
                          <Box style={{ flex: 1 }}>
                            <Flex direction="column" align="center" gap="1">
                              <Flex gap="1" align="end" style={{ height: 80 }}>
                                <Box 
                                  style={{ 
                                    width: 20, 
                                    height: `${stat.borrowed * 8}px`, 
                                    background: 'var(--blue-9)',
                                    borderRadius: 'var(--radius-2) var(--radius-2) 0 0'
                                  }} 
                                />
                                <Box 
                                  style={{ 
                                    width: 20, 
                                    height: `${stat.returned * 8}px`, 
                                    background: 'var(--green-9)',
                                    borderRadius: 'var(--radius-2) var(--radius-2) 0 0'
                                  }} 
                                />
                              </Flex>
                              <Text size="1">{stat.month}</Text>
                            </Flex>
                          </Box>
                        </Tooltip>
                      ))}
                    </Flex>
                  </Box>
                </Flex>
              </Card>
            </Flex>
          </Tabs.Content>

          {/* Returns Tab */}
          <Tabs.Content value="returns">
            <Flex direction="column" gap="4">
              {/* Return History */}
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Flex align="center" justify="between">
                    <Heading size="4">Riwayat Pengembalian</Heading>
                    <Flex gap="2">
                      <Select.Root defaultValue="2024">
                        <Select.Trigger placeholder="Tahun" />
                        <Select.Content>
                          <Select.Item value="2024">2024</Select.Item>
                          <Select.Item value="2023">2023</Select.Item>
                          <Select.Item value="2022">2022</Select.Item>
                        </Select.Content>
                      </Select.Root>
                      
                      <Button variant="ghost" size="2">
                        <DownloadIcon />
                        Ekspor
                      </Button>
                    </Flex>
                  </Flex>

                  <Table.Root variant="surface">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Buku</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Tanggal Pinjam</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Tanggal Kembali</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Denda</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Rating</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {returnHistory.map((returned) => (
                        <Table.Row key={returned.id}>
                          <Table.Cell>
                            <Flex align="center" gap="2">
                              <Box 
                                style={{ 
                                  width: 32, 
                                  height: 40, 
                                  background: `var(--${returned.bookCover}-9)`, 
                                  borderRadius: 'var(--radius-2)' 
                                }} 
                              />
                              <Box>
                                <Text size="2" weight="bold">{returned.bookTitle}</Text>
                                <Text size="1" style={{ color: 'var(--gray-11)' }}>{returned.bookAuthor}</Text>
                              </Box>
                            </Flex>
                          </Table.Cell>
                          <Table.Cell>{new Date(returned.borrowDate).toLocaleDateString('id-ID')}</Table.Cell>
                          <Table.Cell>{new Date(returned.returnDate).toLocaleDateString('id-ID')}</Table.Cell>
                          <Table.Cell>
                            <Badge color={returned.status === 'on-time' ? 'green' : 'amber'}>
                              {returned.status === 'on-time' ? 'Tepat Waktu' : 'Terlambat'}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell>
                            {returned.fine > 0 ? (
                              <Text style={{ color: 'var(--red-11)' }}>Rp {returned.fine.toLocaleString()}</Text>
                            ) : '-'}
                          </Table.Cell>
                          <Table.Cell>
                            {returned.rating ? (
                              <Flex align="center" gap="1">
                                {[...Array(5)].map((_, i) => (
                                  i < returned.rating ? 
                                    <StarFilledIcon key={i} style={{ color: 'var(--amber-9)' }} /> : 
                                    <StarIcon key={i} style={{ color: 'var(--gray-7)' }} />
                                ))}
                              </Flex>
                            ) : (
                              <Button variant="ghost" size="1">
                                Beri Rating
                              </Button>
                            )}
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

                  {/* Pagination */}
                  <Flex align="center" justify="between" mt="4">
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>
                      Menampilkan <Strong>1-6</Strong> dari <Strong>24</Strong> riwayat
                    </Text>

                    <Flex align="center" gap="2">
                      <Button variant="soft" size="2" disabled>
                        <ChevronLeftIcon />
                      </Button>
                      <Button variant="solid" size="2">1</Button>
                      <Button variant="soft" size="2">2</Button>
                      <Button variant="soft" size="2">3</Button>
                      <Text size="2">...</Text>
                      <Button variant="soft" size="2">10</Button>
                      <Button variant="soft" size="2">
                        <ChevronRightIcon />
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>

              {/* Favorite Categories */}
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Heading size="4">Kategori Favorit</Heading>
                  
                  <Grid columns={{ initial: '2', md: '4' }} gap="4">
                    <Box>
                      <Flex align="center" gap="2" mb="1">
                        <Box style={{ width: 8, height: 8, background: 'var(--blue-9)', borderRadius: '50%' }} />
                        <Text size="2">Fiksi Sastra</Text>
                      </Flex>
                      <Text size="6" weight="bold">8</Text>
                      <Text size="1" style={{ color: 'var(--gray-11)' }}>buku</Text>
                    </Box>
                    
                    <Box>
                      <Flex align="center" gap="2" mb="1">
                        <Box style={{ width: 8, height: 8, background: 'var(--green-9)', borderRadius: '50%' }} />
                        <Text size="2">Self-Improvement</Text>
                      </Flex>
                      <Text size="6" weight="bold">6</Text>
                      <Text size="1" style={{ color: 'var(--gray-11)' }}>buku</Text>
                    </Box>
                    
                    <Box>
                      <Flex align="center" gap="2" mb="1">
                        <Box style={{ width: 8, height: 8, background: 'var(--purple-9)', borderRadius: '50%' }} />
                        <Text size="2">Thriller</Text>
                      </Flex>
                      <Text size="6" weight="bold">4</Text>
                      <Text size="1" style={{ color: 'var(--gray-11)' }}>buku</Text>
                    </Box>
                    
                    <Box>
                      <Flex align="center" gap="2" mb="1">
                        <Box style={{ width: 8, height: 8, background: 'var(--amber-9)', borderRadius: '50%' }} />
                        <Text size="2">Sejarah</Text>
                      </Flex>
                      <Text size="6" weight="bold">3</Text>
                      <Text size="1" style={{ color: 'var(--gray-11)' }}>buku</Text>
                    </Box>
                  </Grid>
                </Flex>
              </Card>
            </Flex>
          </Tabs.Content>
        </Tabs.Root>
      </Container>
    </Box>
  );
}