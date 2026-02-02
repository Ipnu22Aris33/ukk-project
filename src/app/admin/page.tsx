'use client';

import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { Box, Text, Badge, Card, Flex, Heading } from '@radix-ui/themes';
import { Icon } from '@iconify/react';

export default function AdminPage() {
  const stats = [
    {
      title: 'Total Buku',
      value: 1234,
      icon: 'mdi:books',
      color: 'indigo',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Buku Dipinjam',
      value: 567,
      icon: 'mdi:book-arrow-right',
      color: 'orange',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Buku Dikembalikan',
      value: 432,
      icon: 'mdi:book-arrow-left',
      color: 'green',
      trend: '-3%',
      trendUp: false,
    },
    {
      title: 'Anggota',
      value: 89,
      icon: 'mdi:account-group',
      color: 'cyan',
      trend: '+5%',
      trendUp: true,
    },
  ] as const;

  return (
    <AdminContentWrapper columns={{ initial: '1', sm: '2', lg: '4' }} gap="4">
      {stats.map((item, index) => (
        <AdminContent key={item.title} padding={0}>
          <Card
            variant="surface"
            style={{
              height: '100%',
              background: 'linear-gradient(135deg, var(--color-background) 0%, var(--gray-2) 100%)',
              border: '1px solid var(--gray-6)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            className="hover:shadow-lg hover:scale-[1.02]"
          >
            <Flex direction="column" gap="4">
              {/* Header dengan Icon */}
              <Flex justify="between" align="start">
                <Box
                  style={{
                    background: `var(--${item.color}-3)`,
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon
                    icon={item.icon}
                    width={28}
                    height={28}
                    style={{ color: `var(--${item.color}-11)` }}
                  />
                </Box>

                {/* Trend Badge */}
                <Badge 
                  color={item.trendUp ? 'green' : 'red'} 
                  variant="soft"
                  size="1"
                >
                  <Flex align="center" gap="1">
                    <Icon 
                      icon={item.trendUp ? 'mdi:trending-up' : 'mdi:trending-down'} 
                      width={12} 
                      height={12} 
                    />
                    <Text size="1">{item.trend}</Text>
                  </Flex>
                </Badge>
              </Flex>

              {/* Content */}
              <Flex direction="column" gap="1">
                <Text 
                  size="2" 
                  color="gray"
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '500',
                  }}
                >
                  {item.title}
                </Text>
                <Heading 
                  size="7"
                  style={{
                    background: `linear-gradient(135deg, var(--${item.color}-11) 0%, var(--${item.color}-9) 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {item.value.toLocaleString()}
                </Heading>
              </Flex>

              {/* Progress Bar (Optional) */}
              <Box
                style={{
                  width: '100%',
                  height: '4px',
                  background: 'var(--gray-4)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  style={{
                    width: `${Math.min(100, (index + 1) * 25)}%`,
                    height: '100%',
                    background: `var(--${item.color}-9)`,
                    borderRadius: '999px',
                    transition: 'width 1s ease',
                  }}
                />
              </Box>
            </Flex>
          </Card>
        </AdminContent>
      ))}
    </AdminContentWrapper>
  );
}