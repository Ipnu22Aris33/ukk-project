'use client';

import { Text, Card, Flex, Badge, Box, Spinner, Avatar, Separator, Tooltip, IconButton, Dialog, Table, Heading, Button, DataList } from '@radix-ui/themes';
import { useMembers } from '@/hooks/useMembers';
import { useReturns } from '@/hooks/useReturns';
import {
  BookOpen,
  CalendarCheck,
  DollarSign,
  CheckCircle2,
  Info,
  Hash,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  BookMarked,
  UserRound,
  Mail,
  Phone,
  Banknote,
} from 'lucide-react';
import { useState } from 'react';

interface MemberReturnsProps {
  code: string;
}

// PayFineDialog Component
interface PayFineDialogProps {
  returnData: any;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function PayFineDialog({ returnData, open, onClose, onConfirm, isLoading }: PayFineDialogProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!returnData) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && !isLoading && onClose()}>
      <Dialog.Content maxWidth='420px'>
        <Dialog.Title>konfirmasi pembayaran denda</Dialog.Title>
        <Dialog.Description size='2' color='gray' mb='4'>
          harap konfirmasi detail pembayaran denda di bawah ini.
        </Dialog.Description>

        <DataList.Root size='2' mb='4'>
          <DataList.Item>
            <DataList.Label minWidth='100px'>member</DataList.Label>
            <DataList.Value>
              <Flex direction='column'>
                <Text weight='medium'>{returnData.loan?.member?.fullName || '-'}</Text>
                <Text size='1' color='gray'>
                  {returnData.loan?.member?.memberClass || '-'} – {returnData.loan?.member?.memberCode || '-'}
                </Text>
              </Flex>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label minWidth='100px'>buku</DataList.Label>
            <DataList.Value>
              <Text>{returnData.loan?.book?.title || '-'}</Text>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label minWidth='100px'>jumlah denda</DataList.Label>
            <DataList.Value>
              <Text weight='bold' color='red'>
                {formatRupiah(returnData.fineAmount || 0)}
              </Text>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label minWidth='100px'>keterlambatan</DataList.Label>
            <DataList.Value>
              <Flex align='center' gap='2'>
                <Clock size={14} />
                {(() => {
                  if (!returnData.loan?.dueDate) return '-';
                  const due = new Date(returnData.loan.dueDate);
                  const returned = new Date(returnData.returnedAt);
                  const diffDays = Math.ceil((returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
                  return `terlambat ${diffDays} hari`;
                })()}
              </Flex>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <Flex gap='3' justify='end'>
          <Button variant='soft' color='gray' onClick={onClose} disabled={isLoading}>
            batal
          </Button>
          <Button color='green' onClick={onConfirm} loading={isLoading}>
            <Banknote size={16} />
            konfirmasi pembayaran
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function MemberReturns({ code }: MemberReturnsProps) {
  const members = useMembers();
  const returns = useReturns();
  const [detailReturn, setDetailReturn] = useState<any>(null);
  const [payTarget, setPayTarget] = useState<any>(null);

  const { data, isLoading, refetch } = members.getByPath(['code', code, 'returns'], {
    fineStatus: 'unpaid',
  });

  const { mutateAsync: payFine, isPending: isPaying } = returns.custom;

  const raw = data?.data;
  const returnList = Array.isArray(raw) ? raw : raw ? [raw] : [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'good':
        return 'green';
      case 'damaged':
        return 'orange';
      case 'lost':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'good':
        return <CheckCircle2 size={12} />;
      case 'damaged':
        return <AlertCircle size={12} />;
      case 'lost':
        return <AlertCircle size={12} />;
      default:
        return null;
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'good':
        return 'Bagus';
      case 'damaged':
        return 'Rusak';
      case 'lost':
        return 'Hilang';
      default:
        return condition || '-';
    }
  };

  const handlePayConfirm = async () => {
    if (!payTarget) return;
    await payFine({
      id: payTarget.id,
      action: 'payment',
      method: 'POST',
    });
    setPayTarget(null);
    refetch();
  };

  if (isLoading) {
    return (
      <Flex align='center' gap='2' p='4' justify='center'>
        <Spinner size='2' />
        <Text size='2' color='gray'>
          memuat data pengembalian...
        </Text>
      </Flex>
    );
  }

  if (!returnList.length) {
    return (
      <Card variant='surface' style={{ border: '1px dashed var(--gray-6)' }}>
        <Flex direction='column' align='center' gap='2' py='6'>
          <DollarSign size={28} color='var(--gray-8)' />
          <Text size='2' color='gray'>
            tidak ada denda yang belum dibayar
          </Text>
          <Text size='1' color='gray'>
            semua denda sudah lunas ✨
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <>
      <Flex direction='column' gap='3'>
        {returnList.map((returnData) => (
          <Card
            key={returnData.id}
            variant='surface'
            style={{
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              border: '1px solid var(--red-6)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <Flex direction='column' gap='3'>
              {/* Baris 1: Header dengan Status Badge */}
              <Flex align='center' justify='between'>
                <Flex align='center' gap='2'>
                  <Avatar
                    size='3'
                    radius='medium'
                    fallback={returnData.loan?.book?.title?.charAt(0)?.toUpperCase() || 'B'}
                    color='red'
                    highContrast
                  />
                  <Box>
                    <Text as='div' size='3' weight='bold' mb='1'>
                      {returnData.loan?.book?.title || 'Unknown Title'}
                    </Text>
                    <Text as='div' size='1' color='gray'>
                      {returnData.loan?.book?.author || 'Penulis tidak diketahui'}
                    </Text>
                  </Box>
                </Flex>

                <Flex align='center' gap='2'>
                  <Badge color='red' variant='solid' radius='full' size='2'>
                    <AlertCircle size={12} />
                    denda belum dibayar
                  </Badge>
                  <Badge color='green' variant='soft' radius='full' size='2'>
                    <CheckCircle2 size={12} />
                    dikembalikan
                  </Badge>
                </Flex>
              </Flex>

              <Separator size='4' />

              {/* Baris 2: Detail Informasi */}
              <Flex direction='row' wrap='wrap' gap='4'>
                <Flex align='center' gap='1'>
                  <Hash size={14} color='var(--gray-9)' />
                  <Text size='1' color='gray'>
                    return id: {returnData.id}
                  </Text>
                </Flex>

                <Flex align='center' gap='1'>
                  <CalendarCheck size={14} color='var(--gray-9)' />
                  <Text size='1' color='gray'>
                    dikembalikan: {formatDate(returnData.returnedAt)}
                  </Text>
                </Flex>

                <Flex align='center' gap='1'>
                  <BookMarked size={14} color='var(--gray-9)' />
                  <Text size='1' color='gray'>
                    kondisi:
                    <Badge color={getConditionColor(returnData.condition)} variant='soft' size='1' ml='1'>
                      <Flex align='center' gap='1'>
                        {getConditionIcon(returnData.condition)}
                        {getConditionLabel(returnData.condition)}
                      </Flex>
                    </Badge>
                  </Text>
                </Flex>

                {returnData.loan?.loanDate && (
                  <Flex align='center' gap='1'>
                    <Calendar size={14} color='var(--gray-9)' />
                    <Text size='1' color='gray'>
                      dipinjam: {formatDate(returnData.loan.loanDate)}
                    </Text>
                  </Flex>
                )}

                {returnData.loan?.dueDate && (
                  <Flex align='center' gap='1'>
                    <Clock size={14} color='var(--red-9)' />
                    <Text size='1' color='red' weight='bold'>
                      jatuh tempo: {formatDate(returnData.loan.dueDate)}
                    </Text>
                  </Flex>
                )}
              </Flex>

              {/* Baris Denda + Tombol Bayar - Langsung tanpa pengecekan hasFine */}
              <Flex
                align='center'
                justify='between'
                gap='2'
                p='3'
                style={{
                  background: 'var(--red-3)',
                  borderRadius: '8px',
                  border: '1px solid var(--red-7)',
                }}
              >
                <Flex align='center' gap='2'>
                  <DollarSign size={20} color='var(--red-11)' />
                  <Box>
                    <Text size='2' weight='bold' color='red'>
                      denda yang harus dibayar: {formatRupiah(returnData.fineAmount)}
                    </Text>
                    <Text size='1' color='gray'>
                      segera lunasi denda untuk dapat meminjam kembali
                    </Text>
                  </Box>
                </Flex>
                <Button
                  size='2'
                  variant='solid'
                  color='red'
                  onClick={() => setPayTarget(returnData)}
                >
                  <Banknote size={16} />
                  bayar denda
                </Button>
              </Flex>

              {/* Baris 3: Action Buttons */}
              <Flex justify='end' gap='2' mt='1'>
                <Tooltip content='lihat detail pengembalian'>
                  <IconButton size='2' variant='soft' color='gray' radius='full' onClick={() => setDetailReturn(returnData)}>
                    <Info size={14} />
                  </IconButton>
                </Tooltip>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Flex>

      {/* Detail Modal */}
      <Dialog.Root open={!!detailReturn} onOpenChange={(open) => !open && setDetailReturn(null)}>
        <Dialog.Content maxWidth='650px' style={{ maxHeight: '80vh', overflow: 'auto' }}>
          <Dialog.Title>
            <Flex align='center' gap='2'>
              <AlertCircle size={20} color='var(--red-9)' />
              detail denda belum dibayar
            </Flex>
          </Dialog.Title>

          {detailReturn && (
            <Flex direction='column' gap='4'>
              <Box>
                <Heading size='3' mb='3'>informasi buku</Heading>
                <Table.Root variant='surface'>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width='150px'><Text weight='bold'>judul</Text></Table.Cell>
                      <Table.Cell>{detailReturn.loan?.book?.title || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>penulis</Text></Table.Cell>
                      <Table.Cell>{detailReturn.loan?.book?.author || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>isbn</Text></Table.Cell>
                      <Table.Cell>{detailReturn.loan?.book?.isbn || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>penerbit</Text></Table.Cell>
                      <Table.Cell>{detailReturn.loan?.book?.publisher || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>tahun</Text></Table.Cell>
                      <Table.Cell>{detailReturn.loan?.book?.year || '-'}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </Box>

              <Box>
                <Heading size='3' mb='3'>informasi pengembalian</Heading>
                <Table.Root variant='surface'>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width='150px'><Text weight='bold'>id return</Text></Table.Cell>
                      <Table.Cell><Badge variant='soft'>{detailReturn.id}</Badge></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>id loan</Text></Table.Cell>
                      <Table.Cell>{detailReturn.loan?.id || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>tanggal kembali</Text></Table.Cell>
                      <Table.Cell>
                        <Flex align='center' gap='2'>
                          <Calendar size={14} />
                          {formatDateTime(detailReturn.returnedAt)}
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>kondisi buku</Text></Table.Cell>
                      <Table.Cell>
                        <Badge color={getConditionColor(detailReturn.condition)}>
                          <Flex align='center' gap='1'>
                            {getConditionIcon(detailReturn.condition)}
                            {getConditionLabel(detailReturn.condition)}
                          </Flex>
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                    {detailReturn.loan?.dueDate && (
                      <Table.Row>
                        <Table.Cell><Text weight='bold'>jatuh tempo</Text></Table.Cell>
                        <Table.Cell>
                          <Flex align='center' gap='2'>
                            <Clock size={14} />
                            {formatDateTime(detailReturn.loan.dueDate)}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    )}
                    {detailReturn.loan?.loanDate && (
                      <Table.Row>
                        <Table.Cell><Text weight='bold'>tanggal pinjam</Text></Table.Cell>
                        <Table.Cell>
                          <Flex align='center' gap='2'>
                            <Calendar size={14} />
                            {formatDateTime(detailReturn.loan.loanDate)}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>
              </Box>

              <Box>
                <Heading size='3' mb='3'>informasi denda (belum dibayar)</Heading>
                <Table.Root variant='surface'>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width='150px'><Text weight='bold'>jumlah denda</Text></Table.Cell>
                      <Table.Cell>
                        <Flex align='center' gap='2'>
                          <DollarSign size={14} />
                          <Text weight='bold' size='4' color='red'>
                            {formatRupiah(detailReturn.fineAmount)}
                          </Text>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>status denda</Text></Table.Cell>
                      <Table.Cell>
                        <Badge color='red' variant='solid'>
                          <Flex align='center' gap='1'>
                            <AlertCircle size={12} />
                            belum dibayar
                          </Flex>
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>keterlambatan</Text></Table.Cell>
                      <Table.Cell>
                        <Flex align='center' gap='2'>
                          <Clock size={14} />
                          {(() => {
                            if (!detailReturn.loan?.dueDate) return '-';
                            const due = new Date(detailReturn.loan.dueDate);
                            const returned = new Date(detailReturn.returnedAt);
                            const diffDays = Math.ceil((returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
                            return `terlambat ${diffDays} hari`;
                          })()}
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </Box>

              {detailReturn.loan?.member && (
                <Box>
                  <Heading size='3' mb='3'>informasi peminjam</Heading>
                  <Table.Root variant='surface'>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width='150px'><Text weight='bold'>nama</Text></Table.Cell>
                        <Table.Cell>
                          <Flex align='center' gap='2'>
                            <UserRound size={14} />
                            {detailReturn.loan.member?.fullName || '-'}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><Text weight='bold'>kode member</Text></Table.Cell>
                        <Table.Cell>{detailReturn.loan.member?.memberCode || '-'}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><Text weight='bold'>email</Text></Table.Cell>
                        <Table.Cell>
                          <Flex align='center' gap='2'>
                            <Mail size={14} />
                            {detailReturn.loan.member?.user?.email || '-'}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><Text weight='bold'>no. telepon</Text></Table.Cell>
                        <Table.Cell>
                          <Flex align='center' gap='2'>
                            <Phone size={14} />
                            {detailReturn.loan.member?.phone || '-'}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                </Box>
              )}

              {detailReturn.notes && (
                <Box>
                  <Heading size='3' mb='3'>catatan</Heading>
                  <Card variant='surface'>
                    <Flex align='start' gap='2'>
                      <FileText size={16} />
                      <Text size='2'>{detailReturn.notes}</Text>
                    </Flex>
                  </Card>
                </Box>
              )}
            </Flex>
          )}

          <Flex gap='3' justify='end' mt='5'>
            <Dialog.Close>
              <Button variant='soft' color='gray'>tutup</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Pay Fine Dialog */}
      <PayFineDialog
        returnData={payTarget}
        open={!!payTarget}
        onClose={() => setPayTarget(null)}
        onConfirm={handlePayConfirm}
        isLoading={isPaying}
      />
    </>
  );
}