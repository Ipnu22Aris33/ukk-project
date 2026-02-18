'use client';

import { Box, Container, Flex, Text, Badge, Avatar, Button, Card } from '@radix-ui/themes';
import {
  ReaderIcon,
  ClockIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  BookmarkIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

// ── Dummy data ─────────────────────────────────────────

const dummyUser = { name: 'Budi Santoso', initials: 'BS' };

const stats = [
  { label: 'Dipinjam',    value: '3',      icon: ReaderIcon,              color: 'blue'   },
  { label: 'Jatuh Tempo', value: '2 hari', icon: ClockIcon,               color: 'orange' },
  { label: 'Selesai',     value: '12',     icon: CheckCircledIcon,        color: 'green'  },
  { label: 'Terlambat',   value: '0',      icon: ExclamationTriangleIcon, color: 'red'    },
] as const;

const activeLoans = [
  { id: '1', title: 'Clean Code',    author: 'Robert C. Martin', dueDate: '20 Feb 2026', status: 'active'  },
  { id: '2', title: 'Atomic Habits', author: 'James Clear',      dueDate: '18 Feb 2026', status: 'overdue' },
  { id: '3', title: 'Deep Work',     author: 'Cal Newport',      dueDate: '25 Feb 2026', status: 'active'  },
] as const;

const recommendedBooks = [
  { id: '1', title: 'The Pragmatic Programmer', author: 'David Thomas',  category: 'Pemrograman' },
  { id: '2', title: 'Design Patterns',          author: 'Gang of Four',  category: 'Arsitektur'  },
  { id: '3', title: 'Refactoring',              author: 'Martin Fowler', category: 'Pemrograman' },
] as const;

const statusConfig = {
  active:   { label: 'Aktif',     color: 'blue'  as const },
  overdue:  { label: 'Terlambat', color: 'red'   as const },
  returned: { label: 'Kembali',   color: 'green' as const },
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
};

const SectionHeader = ({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) => (
  <Flex align='center' justify='between' mb='3'>
    <Text size='3' weight='bold' style={{ letterSpacing: '-0.01em' }}>{title}</Text>
    {action && (
      <Button variant='ghost' size='1' onClick={onAction} style={{ cursor: 'pointer' }}>
        {action} <ArrowRightIcon />
      </Button>
    )}
  </Flex>
);

// ── Page ───────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          width: 100%;
        }
        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          width: 100%;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          width: 100%;
        }
        @media (min-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }
        @media (min-width: 1024px) {
          .main-grid {
            grid-template-columns: 2fr 1fr;
          }
        }
      `}</style>

      <Box style={{ minHeight: '100vh', backgroundColor: 'var(--gray-a1)', width: '100%' }}>
        <Container size='4' px={{ initial: '4', md: '0' }} py='6'>
          <Flex direction='column' gap='6' style={{ width: '100%' }}>

            {/* ── Greeting ── */}
            <Flex align='center' justify='between' gap='3'>
              <Box style={{ minWidth: 0 }}>
                <Text size='2' color='gray' style={{ display: 'block', marginBottom: 2 }}>
                  {greeting()},
                </Text>
                <Text
                  size='6'
                  weight='bold'
                  style={{
                    display: 'block',
                    letterSpacing: '-0.02em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {dummyUser.name.split(' ')[0]} 👋
                </Text>
              </Box>
              <Avatar
                size='4'
                fallback={dummyUser.initials}
                style={{ borderRadius: 999, border: '2px solid var(--indigo-a6)', flexShrink: 0 }}
              />
            </Flex>

            {/* ── Stats ── */}
            <div className='stats-grid'>
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} style={{ padding: 16, borderRadius: 12 }}>
                    <Flex direction='column' gap='2'>
                      <Box style={{
                        width: 32, height: 32, borderRadius: 8,
                        backgroundColor: `var(--${stat.color}-a3)`,
                        color: `var(--${stat.color}-9)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon width='16' height='16' />
                      </Box>
                      <Text size='5' weight='bold' style={{ lineHeight: 1 }}>{stat.value}</Text>
                      <Text size='1' color='gray'>{stat.label}</Text>
                    </Flex>
                  </Card>
                );
              })}
            </div>

            {/* ── Main grid ── */}
            <div className='main-grid'>

              {/* Left — Peminjaman Aktif */}
              <Box style={{ minWidth: 0 }}>
                <SectionHeader
                  title='Peminjaman Aktif'
                  action='Lihat semua'
                  onAction={() => router.push('/loans')}
                />
                <Flex direction='column' gap='2'>
                  {activeLoans.map((loan) => {
                    const s = statusConfig[loan.status];
                    return (
                      <Card key={loan.id} style={{ padding: '12px 16px', borderRadius: 12, cursor: 'pointer' }}>
                        <Flex align='center' justify='between' gap='3'>
                          <Flex align='center' gap='3' style={{ flex: 1, minWidth: 0 }}>
                            <Box style={{
                              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                              backgroundColor: 'var(--indigo-a3)', color: 'var(--indigo-9)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <ReaderIcon width='16' height='16' />
                            </Box>
                            <Box style={{ minWidth: 0, flex: 1 }}>
                              <Text size='2' weight='medium' style={{
                                display: 'block', lineHeight: 1.4,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}>
                                {loan.title}
                              </Text>
                              <Text size='1' color='gray' style={{ display: 'block', lineHeight: 1.4 }}>
                                {loan.author}
                              </Text>
                            </Box>
                          </Flex>
                          <Flex direction='column' align='end' gap='1' style={{ flexShrink: 0 }}>
                            <Badge color={s.color} radius='full' size='1'>{s.label}</Badge>
                            <Text size='1' color='gray'>{loan.dueDate}</Text>
                          </Flex>
                        </Flex>
                      </Card>
                    );
                  })}
                </Flex>
              </Box>

              {/* Right — Aksi + Rekomendasi */}
              <Flex direction='column' gap='5' style={{ minWidth: 0 }}>

                {/* Aksi Cepat */}
                <Box>
                  <SectionHeader title='Aksi Cepat' />
                  <div className='action-grid'>
                    <Card style={{ padding: 16, borderRadius: 12 }}>
                      <Flex direction='column' gap='3'>
                        <Box style={{
                          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                          background: 'linear-gradient(135deg, var(--indigo-9), var(--violet-9))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <PlusIcon width='17' height='17' color='white' />
                        </Box>
                        <Box>
                          <Text size='2' weight='bold' style={{ display: 'block', lineHeight: 1.4 }}>Pengajuan</Text>
                          <Text size='1' color='gray' style={{ display: 'block', lineHeight: 1.4 }}>Pinjam buku baru</Text>
                        </Box>
                        <Button size='1' variant='soft' onClick={() => router.push('/loans/new')} style={{ cursor: 'pointer', width: '100%' }}>
                          Ajukan
                        </Button>
                      </Flex>
                    </Card>

                    <Card style={{ padding: 16, borderRadius: 12 }}>
                      <Flex direction='column' gap='3'>
                        <Box style={{
                          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                          background: 'linear-gradient(135deg, var(--green-9), var(--teal-9))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <CheckCircledIcon width='17' height='17' color='white' />
                        </Box>
                        <Box>
                          <Text size='2' weight='bold' style={{ display: 'block', lineHeight: 1.4 }}>Pengembalian</Text>
                          <Text size='1' color='gray' style={{ display: 'block', lineHeight: 1.4 }}>Kembalikan buku</Text>
                        </Box>
                        <Button size='1' variant='soft' color='green' onClick={() => router.push('/loans/return')} style={{ cursor: 'pointer', width: '100%' }}>
                          Kembalikan
                        </Button>
                      </Flex>
                    </Card>
                  </div>
                </Box>

                {/* Rekomendasi */}
                <Box>
                  <SectionHeader
                    title='Rekomendasi Buku'
                    action='Lihat semua'
                    onAction={() => router.push('/books')}
                  />
                  <Flex direction='column' gap='2'>
                    {recommendedBooks.map((book) => (
                      <Card key={book.id} style={{ padding: '12px 16px', borderRadius: 12, cursor: 'pointer' }}>
                        <Flex align='center' justify='between' gap='3'>
                          <Flex align='center' gap='3' style={{ flex: 1, minWidth: 0 }}>
                            <Box style={{
                              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                              backgroundColor: 'var(--violet-a3)', color: 'var(--violet-9)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <BookmarkIcon width='15' height='15' />
                            </Box>
                            <Box style={{ minWidth: 0, flex: 1 }}>
                              <Text size='2' weight='medium' style={{
                                display: 'block', lineHeight: 1.4,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}>
                                {book.title}
                              </Text>
                              <Text size='1' color='gray' style={{ display: 'block', lineHeight: 1.4 }}>
                                {book.author}
                              </Text>
                            </Box>
                          </Flex>
                          <Badge variant='soft' radius='full' size='1' style={{ flexShrink: 0 }}>
                            {book.category}
                          </Badge>
                        </Flex>
                      </Card>
                    ))}
                  </Flex>
                </Box>

              </Flex>
            </div>

          </Flex>
        </Container>
      </Box>
    </>
  );
}