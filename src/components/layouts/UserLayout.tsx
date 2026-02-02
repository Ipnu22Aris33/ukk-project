import {
  Theme,
  Flex,
  Box,
  Text,
  Heading,
  Container,
  Button,
  Card,
  Avatar,
  Badge,
  DropdownMenu,
  Tabs,
  Separator,
  ScrollArea,
  TextField,
  IconButton,
  Grid,
} from '@radix-ui/themes';
import {
  MagnifyingGlassIcon,
  HomeIcon,
  PersonIcon,
  BellIcon,
  HamburgerMenuIcon,
  ChevronDownIcon,
  GearIcon,
  ExitIcon,
  ClockIcon,
  HeartIcon,
  StarIcon,
  PlusIcon,
  CalendarIcon,
  CheckCircledIcon,
  FileTextIcon,
  ReaderIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  DashboardIcon,
  BookmarkIcon,
  RocketIcon,
  LightningBoltIcon,
  EyeOpenIcon,
  Pencil2Icon,
  TrashIcon,
  UpdateIcon,
  DownloadIcon,
  UploadIcon,
  Share2Icon,
  Link2Icon,
  ExternalLinkIcon,
  CopyIcon,
  ResetIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
  DotFilledIcon,
  DotIcon,
  CheckIcon,
  Cross1Icon,
  Cross2Icon,
  CheckboxIcon,
  MixerHorizontalIcon,
  MixerVerticalIcon,
  SpeakerLoudIcon,
  SpeakerModerateIcon,
  SpeakerOffIcon,
  SpeakerQuietIcon,
  ImageIcon,
  CameraIcon,
  VideoIcon,
  ArchiveIcon,
  FileIcon,
  FileTextIcon as FileText,
  FilePlusIcon,
  CounterClockwiseClockIcon,
  BackpackIcon,
} from '@radix-ui/react-icons';

interface UserLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  schoolName?: string;
  studentId?: string;
}

export default function UserLayout({
  children,
  userName = 'Ahmad Fauzi',
  userEmail = 'ahmad.fauzi@school.edu',
  userRole = 'Siswa',
  schoolName = 'SMA Negeri 1',
  studentId = '2024001234',
}: UserLayoutProps) {
  // Data statistik
  const stats = [
    { label: 'Buku Aktif', value: '5', color: 'blue', icon: ArchiveIcon },
    { label: 'Jatuh Tempo', value: '2', color: 'orange', icon: ClockIcon },
    { label: 'Favorit', value: '12', color: 'pink', icon: HeartIcon },
    { label: 'Poin Baca', value: '148', color: 'green', icon: StarIcon },
  ];

  // Buku yang sedang dipinjam
  const borrowedBooks = [
    {
      id: 1,
      title: 'Matematika Kelas XII',
      author: 'Drs. Sukino',
      dueDate: '15 Feb 2026',
      daysLeft: 15,
      status: 'active',
      category: 'Pelajaran',
    },
    {
      id: 2,
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      dueDate: '10 Feb 2026',
      daysLeft: 10,
      status: 'active',
      category: 'Fiksi',
    },
    {
      id: 3,
      title: 'Fisika untuk SMA',
      author: 'Marthen Kanginan',
      dueDate: '5 Feb 2026',
      daysLeft: 5,
      status: 'warning',
      category: 'Pelajaran',
    },
  ];

  // Kategori buku
  const categories = [
    { name: 'Pelajaran', count: 450, icon: BookmarkIcon, color: 'blue' },
    { name: 'Fiksi', count: 320, icon: ReaderIcon, color: 'purple' },
    { name: 'Non-Fiksi', count: 280, icon: FileTextIcon, color: 'orange' },
    { name: 'Referensi', count: 150, icon: ArchiveIcon, color: 'green' },
    { name: 'Majalah', count: 95, icon: FileIcon, color: 'pink' },
    { name: 'Komik', count: 180, icon: ImageIcon, color: 'red' },
  ];

  return (
    <Theme appearance='light' accentColor='indigo' radius='medium'>
      {/* <Flex direction='column' style={{ minHeight: '100vh', background: 'var(--gray-2)' }}> */}
        {/* Header */}
        <Box style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--gray-6)' }}>
          <Container size='4'>
            <Flex align='center' justify='between' py='3'>
              {/* Logo & School Info */}
              <Flex align='center' gap='3'>
                <IconButton size='3' variant='ghost' style={{ display: 'none' }} className='lg:hidden'>
                  <HamburgerMenuIcon />
                </IconButton>

                <Flex align='center' gap='3'>
                  <Box
                    style={{
                      background: 'linear-gradient(135deg, var(--indigo-9) 0%, var(--purple-9) 100%)',
                      padding: '10px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArchiveIcon width='24' height='24' color='white' />
                  </Box>
                  <Box>
                    <Text weight='bold' size='4' style={{ color: 'var(--indigo-11)' }}>
                      Perpustakaan Digital
                    </Text>
                    <Text size='1' color='gray'>
                      {schoolName}
                    </Text>
                  </Box>
                </Flex>
              </Flex>

              {/* Search Bar */}
              <Box style={{ flex: 1, maxWidth: '500px', margin: '0 20px' }}>
                <TextField.Root size='2' placeholder='Cari buku, penulis, atau kategori...' style={{ width: '100%' }}>
                  <TextField.Slot>
                    <MagnifyingGlassIcon height='16' width='16' />
                  </TextField.Slot>
                </TextField.Root>
              </Box>

              {/* Actions */}
              <Flex align='center' gap='2'>
                {/* Notifications */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Box style={{ position: 'relative' }}>
                      <IconButton size='3' variant='soft'>
                        <BellIcon />
                      </IconButton>
                      <Badge
                        size='1'
                        color='red'
                        variant='solid'
                        radius='full'
                        style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-4px',
                          minWidth: '18px',
                          height: '18px',
                        }}
                      >
                        3
                      </Badge>
                    </Box>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content style={{ width: '320px' }}>
                    <Box p='3'>
                      <Flex justify='between' align='center' mb='3'>
                        <Text weight='bold' size='3'>
                          Notifikasi
                        </Text>
                        <Button size='1' variant='ghost' color='gray'>
                          <CheckIcon /> Tandai terbaca
                        </Button>
                      </Flex>
                      <Separator size='4' mb='2' />
                      <ScrollArea style={{ height: '280px' }}>
                        <Flex direction='column' gap='3'>
                          <Box p='2' style={{ borderRadius: '8px', background: 'var(--amber-3)' }}>
                            <Flex gap='2' align='start'>
                              <ClockIcon color='orange' />
                              <Box style={{ flex: 1 }}>
                                <Text size='2' weight='medium'>
                                  Peringatan Jatuh Tempo
                                </Text>
                                <Text size='1' color='gray' style={{ display: 'block', marginTop: '4px' }}>
                                  "Fisika untuk SMA" akan jatuh tempo dalam 5 hari
                                </Text>
                                <Text size='1' color='gray' style={{ marginTop: '4px' }}>
                                  2 jam yang lalu
                                </Text>
                              </Box>
                            </Flex>
                          </Box>

                          <Box p='2' style={{ borderRadius: '8px', background: 'var(--blue-2)' }}>
                            <Flex gap='2' align='start'>
                              <CheckCircledIcon color='blue' />
                              <Box style={{ flex: 1 }}>
                                <Text size='2' weight='medium'>
                                  Buku Tersedia
                                </Text>
                                <Text size='1' color='gray' style={{ display: 'block', marginTop: '4px' }}>
                                  "Sejarah Indonesia Modern" sudah bisa dipinjam
                                </Text>
                                <Text size='1' color='gray' style={{ marginTop: '4px' }}>
                                  5 jam yang lalu
                                </Text>
                              </Box>
                            </Flex>
                          </Box>

                          <Box p='2' style={{ borderRadius: '8px', background: 'var(--green-2)' }}>
                            <Flex gap='2' align='start'>
                              <StarIcon color='green' />
                              <Box style={{ flex: 1 }}>
                                <Text size='2' weight='medium'>
                                  Poin Membaca +10
                                </Text>
                                <Text size='1' color='gray' style={{ display: 'block', marginTop: '4px' }}>
                                  Selamat! Kamu mendapat 10 poin untuk menyelesaikan buku
                                </Text>
                                <Text size='1' color='gray' style={{ marginTop: '4px' }}>
                                  Kemarin
                                </Text>
                              </Box>
                            </Flex>
                          </Box>
                        </Flex>
                      </ScrollArea>
                    </Box>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>

                {/* User Menu */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant='soft' size='2'>
                      <Flex align='center' gap='2'>
                        <Avatar size='2' src='https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad' fallback='AF' color='indigo' />
                        <Box style={{ display: 'none' }} className='md:block'>
                          <Text size='2' weight='medium'>
                            {userName}
                          </Text>
                        </Box>
                        <ChevronDownIcon />
                      </Flex>
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Label>
                      <Flex direction='column' gap='1'>
                        <Text weight='bold'>{userName}</Text>
                        <Text size='1' color='gray'>
                          {studentId}
                        </Text>
                        <Badge color='indigo' variant='soft' size='1' style={{ marginTop: '4px', width: 'fit-content' }}>
                          {userRole}
                        </Badge>
                      </Flex>
                    </DropdownMenu.Label>
                    <Separator size='4' my='1' />
                    <DropdownMenu.Item>
                      <PersonIcon /> Profil Saya
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <BackpackIcon /> Tas Buku Saya
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <CounterClockwiseClockIcon /> Riwayat Peminjaman
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <HeartIcon /> Daftar Favorit
                    </DropdownMenu.Item>
                    <Separator size='4' my='1' />
                    <DropdownMenu.Item>
                      <GearIcon /> Pengaturan
                    </DropdownMenu.Item>
                    <DropdownMenu.Item color='red'>
                      <ExitIcon /> Keluar
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Flex>
            </Flex>
          </Container>
        </Box>
   
        {/* Main Content */}
        <Flex style={{ flex: 1 }}>
          {/* Sidebar - Hidden on mobile */}
          <Box style={{ display: 'none', width: '280px', background: 'white', borderRight: '1px solid var(--gray-6)' }} className='lg:block'>
            <ScrollArea style={{ height: 'calc(100vh - 65px)' }}>
              <Box p='4'>
                {/* User Profile Card */}
                <Card size='2' style={{ background: 'linear-gradient(135deg, var(--indigo-3) 0%, var(--purple-3) 100%)' }}>
                  <Flex direction='column' align='center' gap='3' py='3'>
                    <Avatar
                      size='6'
                      src='https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad'
                      fallback='AF'
                      color='indigo'
                      style={{ border: '3px solid white' }}
                    />
                    <Box style={{ textAlign: 'center' }}>
                      <Text weight='bold' size='3'>
                        {userName}
                      </Text>
                      <Text size='2' color='gray' style={{ display: 'block', marginTop: '2px' }}>
                        {studentId}
                      </Text>
                      <Badge color='indigo' variant='solid' size='1' style={{ marginTop: '8px' }}>
                        {userRole}
                      </Badge>
                    </Box>
                  </Flex>
                </Card>

                {/* Quick Stats */}
                <Card mt='4' variant='classic'>
                  <Grid columns='3' gap='3' style={{ textAlign: 'center' }}>
                    <Box>
                      <Text weight='bold' size='4' style={{ color: 'var(--indigo-11)' }}>
                        5
                      </Text>
                      <Text size='1' color='gray' style={{ display: 'block' }}>
                        Dipinjam
                      </Text>
                    </Box>
                    <Box>
                      <Text weight='bold' size='4' style={{ color: 'var(--green-11)' }}>
                        148
                      </Text>
                      <Text size='1' color='gray' style={{ display: 'block' }}>
                        Poin
                      </Text>
                    </Box>
                    <Box>
                      <Text weight='bold' size='4' style={{ color: 'var(--pink-11)' }}>
                        12
                      </Text>
                      <Text size='1' color='gray' style={{ display: 'block' }}>
                        Favorit
                      </Text>
                    </Box>
                  </Grid>
                </Card>

                {/* Navigation */}
                <Box mt='5'>
                  <Text size='1' weight='bold' color='gray' mb='2' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Menu Utama
                  </Text>
                  <Flex direction='column' gap='1'>
                    <Button variant='soft' size='2' style={{ justifyContent: 'flex-start' }}>
                      <HomeIcon /> Beranda
                    </Button>
                    <Button variant='ghost' size='2' style={{ justifyContent: 'flex-start' }}>
                      <MagnifyingGlassIcon /> Cari Buku
                      <Badge ml='auto' size='1' color='gray'>
                        1500+
                      </Badge>
                    </Button>
                    <Button variant='ghost' size='2' style={{ justifyContent: 'flex-start' }}>
                      <BackpackIcon /> Tas Buku Saya
                      <Badge ml='auto' size='1' color='red'>
                        5
                      </Badge>
                    </Button>
                    <Button variant='ghost' size='2' style={{ justifyContent: 'flex-start' }}>
                      <HeartIcon /> Daftar Favorit
                      <Badge ml='auto' size='1' color='pink'>
                        12
                      </Badge>
                    </Button>
                    <Button variant='ghost' size='2' style={{ justifyContent: 'flex-start' }}>
                      <CounterClockwiseClockIcon /> Riwayat
                    </Button>
                  </Flex>
                </Box>

                {/* Categories */}
                <Box mt='5'>
                  <Text size='1' weight='bold' color='gray' mb='2' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Kategori Buku
                  </Text>
                  <Flex direction='column' gap='1'>
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Button key={cat.name} variant='ghost' size='2' style={{ justifyContent: 'flex-start' }}>
                          <Icon />
                          {cat.name}
                          <Text size='1' color='gray' ml='auto'>
                            {cat.count}
                          </Text>
                        </Button>
                      );
                    })}
                  </Flex>
                </Box>

                {/* Achievement Card */}
                <Card mt='5' style={{ background: 'var(--amber-2)', border: '1px solid var(--amber-6)' }}>
                  <Flex direction='column' gap='2'>
                    <Flex align='center' gap='2'>
                      <RocketIcon width='20' height='20' color='var(--amber-11)' />
                      <Text size='2' weight='bold' style={{ color: 'var(--amber-11)' }}>
                        Pencapaian Bulan Ini
                      </Text>
                    </Flex>
                    <Text size='1' color='gray'>
                      Kamu sudah membaca 8 buku! Luar biasa! 🎉
                    </Text>
                    <Box
                      style={{
                        background: 'var(--amber-9)',
                        height: '8px',
                        borderRadius: '999px',
                        overflow: 'hidden',
                        marginTop: '4px',
                      }}
                    >
                      <Box
                        style={{
                          background: 'var(--amber-11)',
                          height: '100%',
                          width: '80%',
                          borderRadius: '999px',
                        }}
                      />
                    </Box>
                    <Text size='1' color='gray' style={{ marginTop: '4px' }}>
                      8 dari 10 buku target
                    </Text>
                  </Flex>
                </Card>
              </Box>
            </ScrollArea>
          </Box>

          {/* Main Content Area */}
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
                  <Grid columns={{ initial: '2', sm:"3", md:"6" }} gap='3'>
                    <Card variant='classic' style={{ cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                      <Flex direction='column' align='center' gap='2' py='2'>
                        <Box
                          style={{
                            background: 'var(--blue-3)',
                            padding: '12px',
                            borderRadius: '12px',
                          }}
                        >
                          <MagnifyingGlassIcon width='20' height='20' color='var(--blue-11)' />
                        </Box>
                        <Text size='2' weight='medium'>
                          Cari Buku
                        </Text>
                      </Flex>
                    </Card>

                    <Card variant='classic' style={{ cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                      <Flex direction='column' align='center' gap='2' py='2'>
                        <Box
                          style={{
                            background: 'var(--green-3)',
                            padding: '12px',
                            borderRadius: '12px',
                          }}
                        >
                          <PlusIcon width='20' height='20' color='var(--green-11)' />
                        </Box>
                        <Text size='2' weight='medium'>
                          Pinjam
                        </Text>
                      </Flex>
                    </Card>

                    <Card variant='classic' style={{ cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                      <Flex direction='column' align='center' gap='2' py='2'>
                        <Box
                          style={{
                            background: 'var(--purple-3)',
                            padding: '12px',
                            borderRadius: '12px',
                          }}
                        >
                          <ReaderIcon width='20' height='20' color='var(--purple-11)' />
                        </Box>
                        <Text size='2' weight='medium'>
                          Baca
                        </Text>
                      </Flex>
                    </Card>

                    <Card variant='classic' style={{ cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                      <Flex direction='column' align='center' gap='2' py='2'>
                        <Box
                          style={{
                            background: 'var(--pink-3)',
                            padding: '12px',
                            borderRadius: '12px',
                          }}
                        >
                          <HeartIcon width='20' height='20' color='var(--pink-11)' />
                        </Box>
                        <Text size='2' weight='medium'>
                          Favorit
                        </Text>
                      </Flex>
                    </Card>

                    <Card variant='classic' style={{ cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                      <Flex direction='column' align='center' gap='2' py='2'>
                        <Box
                          style={{
                            background: 'var(--amber-3)',
                            padding: '12px',
                            borderRadius: '12px',
                          }}
                        >
                          <StarIcon width='20' height='20' color='var(--amber-11)' />
                        </Box>
                        <Text size='2' weight='medium'>
                          Rating
                        </Text>
                      </Flex>
                    </Card>

                    <Card variant='classic' style={{ cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                      <Flex direction='column' align='center' gap='2' py='2'>
                        <Box
                          style={{
                            background: 'var(--orange-3)',
                            padding: '12px',
                            borderRadius: '12px',
                          }}
                        >
                          <CounterClockwiseClockIcon width='20' height='20' color='var(--orange-11)' />
                        </Box>
                        <Text size='2' weight='medium'>
                          Riwayat
                        </Text>
                      </Flex>
                    </Card>
                  </Grid>
                </Card>
            </Container>
          </Box>
        </Flex>

        {/* Footer */}
        <Box style={{ borderTop: '1px solid var(--gray-6)', background: 'white' }} py='5'>
          <Container size='4'>
            <Grid columns={{ initial: '1', md: '3' }} gap='6'>
              <Box>
                <Flex align='center' gap='2' mb='3'>
                  <Box
                    style={{
                      background: 'linear-gradient(135deg, var(--indigo-9) 0%, var(--purple-9) 100%)',
                      padding: '8px',
                      borderRadius: '8px',
                    }}
                  >
                    <ArchiveIcon width='18' height='18' color='white' />
                  </Box>
                  <Text size='3' weight='bold'>
                    Perpustakaan Digital
                  </Text>
                </Flex>
                <Text size='2' color='gray' style={{ lineHeight: '1.6' }}>
                  {schoolName} - Membangun generasi cerdas melalui budaya literasi
                </Text>
              </Box>

              <Box>
                <Text size='2' weight='bold' mb='3' style={{ display: 'block' }}>
                  Menu Cepat
                </Text>
                <Flex direction='column' gap='2'>
                  <Text size='2' color='gray' style={{ cursor: 'pointer' }}>
                    Tentang Perpustakaan
                  </Text>
                  <Text size='2' color='gray' style={{ cursor: 'pointer' }}>
                    Syarat & Ketentuan
                  </Text>
                  <Text size='2' color='gray' style={{ cursor: 'pointer' }}>
                    Panduan Peminjaman
                  </Text>
                  <Text size='2' color='gray' style={{ cursor: 'pointer' }}>
                    FAQ
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Text size='2' weight='bold' mb='3' style={{ display: 'block' }}>
                  Hubungi Kami
                </Text>
                <Flex direction='column' gap='2'>
                  <Flex align='center' gap='2'>
                    <EnvelopeClosedIcon width='14' height='14' />
                    <Text size='2' color='gray'>
                      library@school.edu
                    </Text>
                  </Flex>
                  <Flex align='center' gap='2'>
                    <HomeIcon width='14' height='14' />
                    <Text size='2' color='gray'>
                      Gedung Perpustakaan Lt.2
                    </Text>
                  </Flex>
                  <Flex align='center' gap='2'>
                    <ClockIcon width='14' height='14' />
                    <Text size='2' color='gray'>
                      Senin - Jumat, 07:00 - 16:00
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            </Grid>

            <Separator size='4' my='4' />

            <Flex justify='between' align='center' style={{ flexDirection: 'column', gap: '12px' }} className='md:flex-row'>
              <Text size='1' color='gray'>
                © 2026 {schoolName}. Hak Cipta Dilindungi.
              </Text>
              <Flex gap='3'>
                <Text size='1' color='gray' style={{ cursor: 'pointer' }}>
                  Kebijakan Privasi
                </Text>
                <Text size='1' color='gray'>
                  •
                </Text>
                <Text size='1' color='gray' style={{ cursor: 'pointer' }}>
                  Bantuan
                </Text>
              </Flex>
            </Flex>
          </Container>
        </Box>
      {/* </Flex> */}
    </Theme>
  );
}
