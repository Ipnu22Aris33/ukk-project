import { Theme } from '@radix-ui/themes';
import { ClockIcon, HeartIcon, StarIcon, ArchiveIcon } from '@radix-ui/react-icons';
import { UserHeader } from './UserHeader';
import { UserFooter } from './UserFooter';
import { UserContent } from './UserContent';

interface UserLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  schoolName?: string;
  studentId?: string;
}

export default function UserLayout({ children }: UserLayoutProps) {
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

  return (
    <Theme appearance='light' accentColor='indigo' radius='medium'>
      {/* Header */}
      <UserHeader schoolName='BM' userName='banda' />

      {/* Main Content */}
      <UserContent userName='gtw' stats={stats} borrowedBooks={borrowedBooks}>
        {children}
      </UserContent>

      {/* Footer */}
      <UserFooter />
    </Theme>
  );
}
