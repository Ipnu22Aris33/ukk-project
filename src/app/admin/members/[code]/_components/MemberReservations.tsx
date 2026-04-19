'use client';

import { Text, Card, Flex, Badge, Box, Tooltip, IconButton, Spinner, Avatar, Separator, Button, Dialog, Table, Heading } from '@radix-ui/themes';
import { Check, X, Info, BookMarked, CalendarDays, User, Hash, Clock, AlertCircle, Calendar, UserRound, FileText, Mail, Phone } from 'lucide-react';
import { useMembers } from '@/hooks/useMembers';
import { useReservations } from '@/hooks/useReservation';
import { useState } from 'react';

export function MemberReservations({ code }: { code: string }) {
  const members = useMembers();
  const reservations = useReservations();

  const [confirmDialog, setConfirmDialog] = useState<{ id: string | number; action: 'picked-up' | 'reject' } | null>(null);
  const [detailReservation, setDetailReservation] = useState<any>(null);

  const { data, isLoading: isListLoading } = members.getByPath(['code', code, 'reservations'], { status: 'pending' });

  const { mutate: performAction, isPending: isUpdating } = reservations.custom;

  const raw = data?.data;
  const reservationList = Array.isArray(raw) ? raw : raw ? [raw] : [];

  const handleAction = (id: string | number, action: 'picked-up' | 'reject') => {
    performAction(
      {
        id,
        action,
        method: 'PATCH',
      },
      {
        onSuccess: () => {
          reservations.invalidate.all();
          setConfirmDialog(null);
        },
      }
    );
  };

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

  const getRelativeDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Sudah lewat';
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Besok';
    return `${diffDays} hari lagi`;
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    const now = new Date();
    const expireDate = new Date(expiresAt);
    return now > expireDate;
  };

  const getStatusColor = (status: string, expiresAt?: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'picked_up') return 'green';
    if (statusLower === 'rejected') return 'red';
    if (statusLower === 'pending') {
      return isExpired(expiresAt) ? 'red' : 'amber';
    }
    if (statusLower === 'cancelled') return 'gray';
    return 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'picked_up':
        return <Check size={12} />;
      case 'rejected':
        return <X size={12} />;
      case 'pending':
        return <Clock size={12} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string, expiresAt?: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'picked_up') return 'DIAMBIL';
    if (statusLower === 'rejected') return 'DITOLAK';
    if (statusLower === 'pending') {
      return isExpired(expiresAt) ? 'KADALUARSA' : 'PENDING';
    }
    if (statusLower === 'cancelled') return 'DIBATALKAN';
    return status?.toUpperCase() || 'UNKNOWN';
  };

  if (isListLoading) {
    return (
      <Flex align='center' gap='2' p='4' justify='center'>
        <Spinner size='2' />
        <Text size='2' color='gray'>
          Memuat data reservasi...
        </Text>
      </Flex>
    );
  }

  if (!reservationList.length) {
    return (
      <Card variant='surface' style={{ border: '1px dashed var(--gray-6)' }}>
        <Flex direction='column' align='center' gap='2' py='6'>
          <BookMarked size={28} color='var(--gray-8)' />
          <Text size='2' color='gray'>
            Tidak ada data reservasi ditemukan
          </Text>
          <Text size='1' color='gray'>
            Reservasi yang masih pending akan muncul di sini
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <>
      <Flex direction='column' gap='3'>
        {reservationList.map((res) => {
          const isPending = res.status?.toLowerCase() === 'pending';
          const expired = isExpired(res.expiresAt);
          const showExpiredWarning = isPending && expired;

          return (
            <Card
              key={res.id}
              variant='surface'
              style={{
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                border: showExpiredWarning ? '1px solid var(--red-6)' : undefined,
                opacity: res.status?.toLowerCase() === 'rejected' || res.status?.toLowerCase() === 'cancelled' ? 0.7 : 1,
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
                    <Avatar size='3' radius='medium' fallback={res.book?.title?.charAt(0)?.toUpperCase() || 'B'} color='amber' highContrast />
                    <Box>
                      <Text as='div' size='3' weight='bold' mb='1'>
                        {res.book?.title || 'Judul Tidak Diketahui'}
                      </Text>
                      <Text as='div' size='1' color='gray'>
                        {res.book?.author || 'Penulis tidak diketahui'}
                      </Text>
                    </Box>
                  </Flex>

                  <Badge color={getStatusColor(res.status, res.expiresAt)} variant={isPending && !expired ? 'solid' : 'soft'} radius='full' size='2'>
                    <Flex align='center' gap='1'>
                      {getStatusIcon(res.status)}
                      {getStatusLabel(res.status, res.expiresAt)}
                    </Flex>
                  </Badge>
                </Flex>

                <Separator size='4' />

                {/* Baris 2: Detail Informasi */}
                <Flex direction='row' wrap='wrap' gap='4'>
                  <Flex align='center' gap='1'>
                    <Hash size={14} color='var(--gray-9)' />
                    <Text size='1' color='gray'>
                      ID: {res.id}
                    </Text>
                  </Flex>

                  {res.reservationDate && (
                    <Flex align='center' gap='1'>
                      <CalendarDays size={14} color='var(--gray-9)' />
                      <Text size='1' color='gray'>
                        Reservasi: {formatDate(res.reservationDate)}
                      </Text>
                    </Flex>
                  )}

                  {res.expiresAt && (
                    <Flex align='center' gap='1'>
                      <AlertCircle size={14} color={expired ? 'var(--red-9)' : 'var(--amber-9)'} />
                      <Text size='1' color={expired ? 'red' : undefined} weight={expired ? 'bold' : undefined}>
                        Berlaku sampai: {formatDate(res.expiresAt)}
                        {isPending && !expired && ` (${getRelativeDate(res.expiresAt)})`}
                        {expired && ' (Kadaluarsa)'}
                      </Text>
                    </Flex>
                  )}

                  {res.quantity > 1 && (
                    <Flex align='center' gap='1'>
                      <BookMarked size={14} color='var(--gray-9)' />
                      <Text size='1' color='gray'>
                        {res.quantity} eksamplar
                      </Text>
                    </Flex>
                  )}

                  {res.member?.name && (
                    <Flex align='center' gap='1'>
                      <User size={14} color='var(--gray-9)' />
                      <Text size='1' color='gray'>
                        {res.member.name}
                      </Text>
                    </Flex>
                  )}
                </Flex>

                {/* Baris 2.5: Info Kadaluarsa */}
                {showExpiredWarning && (
                  <Flex
                    align='center'
                    gap='2'
                    p='2'
                    style={{
                      background: 'var(--red-3)',
                      borderRadius: '8px',
                      border: '1px solid var(--red-6)',
                    }}
                  >
                    <AlertCircle size={16} color='var(--red-11)' />
                    <Text size='2' weight='bold' color='red'>
                      Reservasi telah kadaluarsa!
                    </Text>
                    <Text size='1' color='gray' style={{ marginLeft: 'auto' }}>
                      Harap lakukan reservasi ulang
                    </Text>
                  </Flex>
                )}

                {/* Baris 3: Action Buttons */}
                <Flex justify='end' gap='2' mt='1'>
                  <Tooltip content='Lihat Detail'>
                    <IconButton size='2' variant='soft' color='gray' radius='full' onClick={() => setDetailReservation(res)}>
                      <Info size={14} />
                    </IconButton>
                  </Tooltip>

                  {isPending && !expired && (
                    <>
                      <Tooltip content='Tolak Reservasi'>
                        <IconButton
                          size='2'
                          variant='soft'
                          color='red'
                          radius='full'
                          disabled={isUpdating}
                          onClick={() => setConfirmDialog({ id: res.id, action: 'reject' })}
                        >
                          <X size={14} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip content='Setujui (Buku Diambil)'>
                        <IconButton
                          size='2'
                          variant='solid'
                          color='green'
                          radius='full'
                          disabled={isUpdating}
                          onClick={() => setConfirmDialog({ id: res.id, action: 'picked-up' })}
                        >
                          <Check size={14} />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}

                  {isPending && expired && (
                    <Badge color='red' variant='soft' radius='full' size='2'>
                      <AlertCircle size={12} />
                      Tidak dapat diproses
                    </Badge>
                  )}
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Flex>

      {/* Detail Modal untuk Reservation */}
      <Dialog.Root open={!!detailReservation} onOpenChange={(open) => !open && setDetailReservation(null)}>
        <Dialog.Content maxWidth='600px' style={{ maxHeight: '80vh', overflow: 'auto' }}>
          <Dialog.Title>
            <Flex align='center' gap='2'>
              <BookMarked size={20} />
              Detail Reservasi Buku
            </Flex>
          </Dialog.Title>

          {detailReservation && (
            <Flex direction='column' gap='4'>
              {/* Book Info Section */}
              <Box>
                <Heading size='3' mb='3'>
                  Informasi Buku
                </Heading>
                <Table.Root variant='surface'>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width='150px'>
                        <Text weight='bold'>Judul</Text>
                      </Table.Cell>
                      <Table.Cell>{detailReservation.book?.title || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text weight='bold'>Penulis</Text>
                      </Table.Cell>
                      <Table.Cell>{detailReservation.book?.author || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text weight='bold'>ISBN</Text>
                      </Table.Cell>
                      <Table.Cell>{detailReservation.book?.isbn || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text weight='bold'>Penerbit</Text>
                      </Table.Cell>
                      <Table.Cell>{detailReservation.book?.publisher || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text weight='bold'>Tahun</Text>
                      </Table.Cell>
                      <Table.Cell>{detailReservation.book?.year || '-'}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </Box>

              {/* Reservation Info Section */}
              <Box>
                <Heading size='3' mb='3'>
                  Informasi Reservasi
                </Heading>
                <Table.Root variant='surface'>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width='150px'>
                        <Text weight='bold'>ID Reservasi</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant='soft'>{detailReservation.id}</Badge>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text weight='bold'>Status</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={getStatusColor(detailReservation.status, detailReservation.expiresAt)}>
                          {getStatusLabel(detailReservation.status, detailReservation.expiresAt)}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text weight='bold'>Tanggal Reservasi</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex align='center' gap='2'>
                          <Calendar size={14} />
                          {formatDateTime(detailReservation.reservedAt)}
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text weight='bold'>Berlaku Sampai</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex align='center' gap='2'>
                          <Clock size={14} />
                          {formatDateTime(detailReservation.expiresAt)}
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                    {detailReservation.pickupDate && (
                      <Table.Row>
                        <Table.Cell>
                          <Text weight='bold'>Tanggal Diambil</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex align='center' gap='2'>
                            <Calendar size={14} />
                            {formatDateTime(detailReservation.pickupDate)}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    )}
                    <Table.Row>
                      <Table.Cell>
                        <Text weight='bold'>Jumlah Eksamplar</Text>
                      </Table.Cell>
                      <Table.Cell>{detailReservation.quantity || 1}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </Box>

              {/* Member Info Section */}
              {detailReservation.member && (
                <Box>
                  <Heading size='3' mb='3'>
                    Informasi Pemesanan
                  </Heading>
                  <Table.Root variant='surface'>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width='150px'>
                          <Text weight='bold'>Nama</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex align='center' gap='2'>
                            <UserRound size={14} />
                            {detailReservation.member.fullName}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <Text weight='bold'>Kode Member</Text>
                        </Table.Cell>
                        <Table.Cell>{detailReservation.member.memberCode}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <Text weight='bold'>Email</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex align='center' gap='2'>
                            <Mail size={14} />
                            {detailReservation.member.user.email}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <Text weight='bold'>No. Telepon</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex align='center' gap='2'>
                            <Phone size={14} />
                            {detailReservation.member.phone || '-'}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                </Box>
              )}

              {/* Notes Section */}
              {detailReservation.notes && (
                <Box>
                  <Heading size='3' mb='3'>
                    Catatan
                  </Heading>
                  <Card variant='surface'>
                    <Flex align='start' gap='2'>
                      <FileText size={16} />
                      <Text size='2'>{detailReservation.notes}</Text>
                    </Flex>
                  </Card>
                </Box>
              )}
            </Flex>
          )}

          <Flex gap='3' justify='end' mt='5'>
            <Dialog.Close>
              <Button variant='soft' color='gray'>
                Tutup
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Confirmation Dialog */}
      <Dialog.Root open={!!confirmDialog} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <Dialog.Content maxWidth='400px'>
          <Dialog.Title>{confirmDialog?.action === 'picked-up' ? 'Konfirmasi Pengambilan Buku' : 'Konfirmasi Penolakan Reservasi'}</Dialog.Title>
          <Dialog.Description size='2' mb='4' color='gray'>
            {confirmDialog?.action === 'picked-up'
              ? 'Apakah Anda yakin ingin menyetujui reservasi ini? Buku akan ditandai sebagai sudah diambil.'
              : 'Apakah Anda yakin ingin menolak reservasi ini? Tindakan ini tidak dapat dibatalkan.'}
          </Dialog.Description>

          <Flex gap='3' justify='end'>
            <Dialog.Close>
              <Button type='button' variant='soft' color='gray'>
                Batal
              </Button>
            </Dialog.Close>

            <Button
              type='button'
              variant='solid'
              color={confirmDialog?.action === 'picked-up' ? 'green' : 'red'}
              onClick={() => confirmDialog && handleAction(confirmDialog.id, confirmDialog.action)}
              disabled={isUpdating}
            >
              {isUpdating ? 'Memproses...' : confirmDialog?.action === 'picked-up' ? 'Ya, Setujui' : 'Ya, Tolak'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
