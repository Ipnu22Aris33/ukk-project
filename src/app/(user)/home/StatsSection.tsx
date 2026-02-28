import { Box, Card, Flex, Text } from '@radix-ui/themes';
import { ReaderIcon, ClockIcon, CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

const stats = [
  { label: 'Dipinjam',    value: '3',      icon: ReaderIcon,              color: 'blue'   },
  { label: 'Jatuh Tempo', value: '2 hari', icon: ClockIcon,               color: 'orange' },
  { label: 'Selesai',     value: '12',     icon: CheckCircledIcon,        color: 'green'  },
  { label: 'Terlambat',   value: '0',      icon: ExclamationTriangleIcon, color: 'red'    },
] as const;

export const StatsSection = () => (
  <div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full'>
    {stats.map((stat) => {
      const Icon = stat.icon;
      return (
        <Card key={stat.label} className='p-4 rounded-xl'>
          <Flex direction='column' gap='2'>
            <Box className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-${stat.color}A-3 text-${stat.color}-9`}>
              <Icon width='16' height='16' />
            </Box>
            <Text size='5' weight='bold' className='leading-none'>{stat.value}</Text>
            <Text size='1' color='gray'>{stat.label}</Text>
          </Flex>
        </Card>
      );
    })}
  </div>
);