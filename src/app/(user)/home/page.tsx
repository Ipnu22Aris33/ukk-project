import { InfoCard } from './InfoCard';
import { MemberStats } from './MemberStats';
import { ReaderIcon, ClockIcon, CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

export default function HomePage() {
  const memberStats = [
    { label: 'Buku Dipinjam', value: '3', color: 'blue', icon: ReaderIcon },
    { label: 'Jatuh Tempo', value: '2 hari', color: 'orange', icon: ClockIcon },
    { label: 'Buku Selesai', value: '12', color: 'green', icon: CheckCircledIcon },
    { label: 'Terlambat', value: '0', color: 'red', icon: ExclamationTriangleIcon },
  ];
  return <MemberStats />;
}
