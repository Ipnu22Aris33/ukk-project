import { Card, Flex, Box, Heading, Text, Grid } from '@radix-ui/themes';
import {
  ReaderIcon,
  ClockIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';

interface MemberStat {
  label: string;
  value: string;
  color: string;
  icon: any;
}

interface MemberStatsGridProps {
  stats?: MemberStat[];
}

export function MemberStats({ stats }: MemberStatsGridProps) {
  const defaultStats: MemberStat[] = [
    { label: 'Buku Dipinjam', value: '3', color: 'blue', icon: ReaderIcon },
    { label: 'Jatuh Tempo', value: '2 hari', color: 'orange', icon: ClockIcon },
    { label: 'Buku Selesai', value: '12', color: 'green', icon: CheckCircledIcon },
    { label: 'Terlambat', value: '0', color: 'red', icon: ExclamationTriangleIcon },
  ];

  const displayStats = stats || defaultStats;

  return (
    <Grid columns={{ initial: '2', md: '4' }} gap='4' mb='6'>
      {displayStats.map((stat, index) => {
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
  );
}