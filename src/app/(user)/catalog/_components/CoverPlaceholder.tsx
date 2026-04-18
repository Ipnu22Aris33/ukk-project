import { Box, Text } from '@radix-ui/themes';

const NEUTRAL_PALETTES = [
  { bg: '#1c1c1e', text: '#ffffff' },
  { bg: '#1e293b', text: '#e2e8f0' },
  { bg: '#0d1b2a', text: '#dce8f0' },
  { bg: '#111827', text: '#e5e7eb' },
  { bg: '#1b2838', text: '#c6d4df' },
  { bg: '#18181b', text: '#f4f4f5' },
  { bg: '#1a1a2e', text: '#e0e0f0' },
  { bg: '#2c2c2e', text: '#ebebf5' },
];

const hashString = (str: string): number => str.split('').reduce((hash, ch) => (hash * 31 + ch.charCodeAt(0)) >>> 0, 0);

interface CoverPlaceholderProps {
  title: string;
  author: string;
}

export function CoverPlaceholder({ title, author }: CoverPlaceholderProps) {
  const palette = NEUTRAL_PALETTES[hashString(title) % NEUTRAL_PALETTES.length];

  const initials = title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        background: palette.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '16px 10px',
      }}
    >
      <Text
        style={{ fontSize: 36, fontWeight: 700, color: palette.text, opacity: 0.12, lineHeight: 1, letterSpacing: '-0.04em', userSelect: 'none' }}
      >
        {initials}
      </Text>
      <Box style={{ width: 24, height: 1, background: palette.text, opacity: 0.18 }} />
      <Text
        style={{
          textAlign: 'center',
          color: palette.text,
          opacity: 0.45,
          fontSize: 9,
          fontWeight: 500,
          lineHeight: 1.5,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {title}
      </Text>
    </Box>
  );
}
