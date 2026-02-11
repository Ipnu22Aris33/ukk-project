import { Box, Container, Flex, Grid, Text, Separator } from '@radix-ui/themes';
import { ArchiveIcon, EnvelopeClosedIcon, HomeIcon, ClockIcon } from '@radix-ui/react-icons';

interface FooterProps {
  schoolName?: string;
}

export function UserFooter({ schoolName = 'SMA Negeri 1' }: FooterProps) {
  return (
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
  );
}
