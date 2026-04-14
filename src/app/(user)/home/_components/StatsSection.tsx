'use client';

import { Card, Flex, Text, Skeleton, Grid, Badge, Box, Separator } from '@radix-ui/themes';
import {
  ReaderIcon,
  ClockIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  BookmarkIcon,
  InfoCircledIcon,
  CrossCircledIcon,
} from '@radix-ui/react-icons';
import { useMembers } from '@/hooks/useMembers';

const formatRp = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

export const StatsSection = () => {
  const membersHook = useMembers();
  const { data: response, isLoading } = membersHook.getByPath(['summary']) as any;
  const summary = response?.data.summary;

  return (
    <Flex direction='column' gap='4'>
      {/* ─── BARIS 1: CORE SUMMARY ─── */}
      <Grid columns={{ initial: '2', md: '4' }} gap='3'>
        {/* Pinjaman - Fokus pada Total & Aktif */}
        <StatCard
          label='Total Pinjaman'
          value={summary?.loans.total ?? 0}
          icon={ReaderIcon}
          color='blue'
          loading={isLoading}
          details={[
            { label: 'Aktif', value: summary?.loans.active ?? 0 },
            { label: 'Kembali', value: summary?.loans.returned ?? 0 },
          ]}
        />

        {/* Reservasi - Breakdown Transparan */}
        <StatCard
          label='Total Reservasi'
          value={summary?.reservations.total ?? 0}
          icon={BookmarkIcon}
          color='violet'
          loading={isLoading}
          details={[
            { label: 'Pending', value: summary?.reservations.pending ?? 0 },
            { label: 'Diambil', value: summary?.reservations.picked_up ?? 0 },
          ]}
        />

        {/* Terlambat - Status Urgent */}
        <StatCard
          label='Buku Terlambat'
          value={summary?.loans.late ?? 0}
          icon={ExclamationTriangleIcon}
          color={(summary?.loans.late ?? 0) > 0 ? 'red' : 'green'}
          loading={isLoading}
          urgent={(summary?.loans.late ?? 0) > 0}
          subValue='Perlu segera dikembalikan'
        />

        {/* Denda - Finansial */}
        <StatCard
          label='Tagihan Denda'
          value={summary?.fines.unpaidAmount ? formatRp(summary.fines.unpaidAmount) : 'Lunas'}
          icon={ClockIcon}
          color={(summary?.fines.unpaidAmount ?? 0) > 0 ? 'crimson' : 'green'}
          loading={isLoading}
          urgent={(summary?.fines.unpaidAmount ?? 0) > 0}
          subValue={summary?.fines.unpaidCount ? `${summary.fines.unpaidCount} Denda Belum Bayar` : 'Tidak ada tunggakan'}
        />
      </Grid>

      {/* ─── BARIS 2: KUALITAS & INTEGRITAS ─── */}
      <Grid columns={{ initial: '1', md: '2' }} gap='3'>
        {/* Detail Kondisi Pengembalian */}
        <Card size='2'>
          <Flex direction='column' gap='3'>
            <Flex align='center' gap='2' mb='1'>
              <InfoCircledIcon color='gray' />
              <Text size='2' weight='bold' color='gray'>
                Kualitas Buku Saat Kembali
              </Text>
            </Flex>
            <Grid columns='3' gap='2'>
              <ConditionItem label='Kondisi Baik' value={summary?.returns.conditions.good ?? 0} color='green' loading={isLoading} />
              <ConditionItem label='Rusak' value={summary?.returns.conditions.damaged ?? 0} color='orange' loading={isLoading} />
              <ConditionItem label='Hilang' value={summary?.returns.conditions.lost ?? 0} color='red' loading={isLoading} />
            </Grid>
          </Flex>
        </Card>

        {/* Statistik Koleksi / Lost & Found */}
        <Card size='2'>
          <Flex direction='column' gap='3'>
            <Text size='2' weight='bold' color='gray'>
              Integritas Koleksi
            </Text>
            <Flex justify='between' align='center'>
              <Flex align='center' gap='2'>
                <CheckCircledIcon color='var(--green-9)' />
                <Text size='2'>Selesai (Tepat Waktu/Telat)</Text>
              </Flex>
              <Skeleton loading={isLoading}>
                <Badge color='green' variant='soft'>
                  {summary?.loans.returned ?? 0} Buku
                </Badge>
              </Skeleton>
            </Flex>
            <Separator size='4' />
            <Flex justify='between' align='center'>
              <Flex align='center' gap='2'>
                <CrossCircledIcon color='var(--red-9)' />
                <Text size='2'>Total Buku Pernah Hilang</Text>
              </Flex>
              <Skeleton loading={isLoading}>
                <Badge color='red' variant='soft'>
                  {summary?.loans.lost ?? 0} Buku
                </Badge>
              </Skeleton>
            </Flex>
          </Flex>
        </Card>
      </Grid>
    </Flex>
  );
};

// =====================
// SUB-COMPONENTS
// =====================

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: any;
  loading: boolean;
  urgent?: boolean;
  subValue?: string;
  details?: { label: string; value: number }[];
}

const StatCard = ({ label, value, icon: Icon, color, loading, urgent, subValue, details }: StatCardProps) => (
  <Card style={{ outline: urgent ? '1.5px solid var(--red-8)' : undefined }}>
    <Flex direction='column' gap='2' justify='between' style={{ height: '100%' }}>
      <Box>
        <Flex justify='between' align='start' mb='2'>
          <Box style={{ backgroundColor: `var(--${color}-3)`, color: `var(--${color}-11)`, padding: 6, borderRadius: 8 }}>
            <Icon width='18' height='18' />
          </Box>
          {urgent && (
            <Badge color='red' variant='surface'>
              Penting
            </Badge>
          )}
        </Flex>

        <Skeleton loading={loading}>
          <Text size='6' weight='bold' style={{ letterSpacing: '-0.5px' }}>
            {value}
          </Text>
        </Skeleton>
        <Text as='div' size='1' color='gray' weight='medium' mt='1'>
          {label}
        </Text>
      </Box>

      {/* Section Detail Tambahan */}
      <Box mt='2'>
        {details ? (
          <Flex gap='3'>
            {details.map((det, i) => (
              <Flex key={i} direction='column'>
                <Text size='1' color='gray' style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                  {det.label}
                </Text>
                <Skeleton loading={loading}>
                  <Text size='2' weight='bold'>
                    {det.value}
                  </Text>
                </Skeleton>
              </Flex>
            ))}
          </Flex>
        ) : (
          subValue && (
            <Text size='1' color='gray' style={{ opacity: 0.8, fontStyle: 'italic' }}>
              {subValue}
            </Text>
          )
        )}
      </Box>
    </Flex>
  </Card>
);

const ConditionItem = ({ label, value, color, loading }: any) => (
  <Box style={{ backgroundColor: 'var(--gray-2)', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--gray-4)' }}>
    <Skeleton loading={loading}>
      <Text as='div' size='4' weight='bold' color={color}>
        {value}
      </Text>
    </Skeleton>
    <Text as='div' size='1' color='gray'>
      {label}
    </Text>
  </Box>
);
