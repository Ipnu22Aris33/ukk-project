'use client';

import { Text, Card, Flex, Badge, Box, Tooltip, IconButton, Spinner, Dialog, Button, Avatar, Separator, Table, Heading } from '@radix-ui/themes';
import { BookCheck, Info, NotepadText, Undo2, BookOpen, Plus, CalendarDays, User, Hash, AlertCircle, Coins, Calendar, Clock, FileText, UserRound, BookMarked } from 'lucide-react';
import { useMembers } from '@/hooks/useMembers';
import { useLoans } from '@/hooks/useLoans';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { SelectField, TextareaField } from '@/components/features/forms';
import { useState } from 'react';
import { AddLoanForm } from './AddLoanForm';

export function MemberLoans({ code }: { code: string }) {
  const members = useMembers();
  const loans = useLoans();

  const [openDialogId, setOpenDialogId] = useState<string | number | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [detailLoan, setDetailLoan] = useState<any>(null);

  const { data: memberData } = members.getByPath(['code', code]);
  const memberId = memberData?.data?.id;

  const { data, isLoading, refetch } = members.getByPath(['code', code, 'loans'], { status: 'borrowed' });

  const raw = data?.data;
  const loanList = Array.isArray(raw) ? raw : raw ? [raw] : [];

  const returnForm = useForm({
    defaultValues: {
      loanId: '' as any,
      condition: 'good' as 'good' | 'lost' | 'damaged',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      loans.custom.mutate(
        {
          id: value.loanId,
          action: 'return',
          method: 'POST',
          body: {
            condition: value.condition,
            notes: value.notes,
          },
        },
        {
          onSuccess: () => {
            loans.invalidate.all();
            refetch();
            returnForm.reset();
            setOpenDialogId(null);
          },
        }
      );
    },
  });

  const getFieldError = (field: any) => field.state.meta.errors?.[0]?.message;

  const handleAddLoan = async (formData: any) => {
    await loans.create.mutateAsync(formData);
    refetch();
    setOpenAddDialog(false);
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

  const calculateFine = (dueDate?: string, returnDate?: string) => {
    if (!dueDate) return 0;
    
    const today = returnDate ? new Date(returnDate) : new Date();
    const due = new Date(dueDate);
    
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    if (today <= due) return 0;
    
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays * 1000;
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return today > due;
  };

  const getLateDays = (dueDate?: string) => {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    if (today <= due) return 0;
    const diffTime = today.getTime() - due.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <Flex align='center' gap='2' p='4' justify='center'>
        <Spinner size='2' />
        <Text size='2' color='gray'>
          Memuat data peminjaman...
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <Flex direction='column' gap='4'>
        {/* Header with Add Button */}
        <Flex justify='end'>
          <Dialog.Root open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <Dialog.Trigger>
              <Button size='2' variant='solid' highContrast>
                <Plus size={16} />
                Tambah Peminjaman
              </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth='500px'>
              <Dialog.Title>Tambah Peminjaman Baru</Dialog.Title>
              <Dialog.Description size='2' mb='4' color='gray'>
                Isi detail peminjaman buku di bawah ini.
              </Dialog.Description>

              <AddLoanForm
                initialData={{ memberId: memberId }}
                onSubmit={handleAddLoan}
                isSubmitting={loans.create.isPending}
                onClose={() => setOpenAddDialog(false)}
              />
            </Dialog.Content>
          </Dialog.Root>
        </Flex>

        {/* Loan List */}
        {!loanList.length ? (
          <Card variant='surface' style={{ border: '1px dashed var(--gray-6)' }}>
            <Flex direction='column' align='center' gap='2' py='6'>
              <BookOpen size={28} color='var(--gray-8)' />
              <Text size='2' color='gray'>
                Tidak ada data peminjaman aktif
              </Text>
              <Text size='1' color='gray'>
                Klik tombol "Tambah Peminjaman" untuk menambah peminjaman
              </Text>
            </Flex>
          </Card>
        ) : (
          <Flex direction='column' gap='3'>
            {loanList.map((loan) => {
              const fine = calculateFine(loan.dueDate);
              const overdue = isOverdue(loan.dueDate);
              const lateDays = getLateDays(loan.dueDate);

              return (
                <Card
                  key={loan.id}
                  variant='surface'
                  style={{
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    border: overdue ? '1px solid var(--red-6)' : undefined,
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
                          fallback={loan.book?.title?.charAt(0)?.toUpperCase() || 'B'}
                          color='blue'
                          highContrast
                        />
                        <Box>
                          <Text as='div' size='3' weight='bold' mb='1'>
                            {loan.book?.title || 'Unknown Title'}
                          </Text>
                          <Text as='div' size='1' color='gray'>
                            {loan.book?.author || 'Penulis tidak diketahui'}
                          </Text>
                        </Box>
                      </Flex>

                      <Badge
                        color={loan.status === 'RETURNED' ? 'green' : (overdue ? 'red' : 'orange')}
                        variant='solid'
                        radius='full'
                        size='2'
                      >
                        {loan.status === 'RETURNED' 
                          ? 'Dikembalikan' 
                          : (overdue ? 'Terlambat 🚨' : 'Dipinjam')}
                      </Badge>
                    </Flex>

                    <Separator size='4' />

                    {/* Baris 2: Detail Informasi */}
                    <Flex direction='row' wrap='wrap' gap='4'>
                      <Flex align='center' gap='1'>
                        <Hash size={14} color='var(--gray-9)' />
                        <Text size='1' color='gray'>
                          ID: {loan.id}
                        </Text>
                      </Flex>

                      {loan.loanDate && (
                        <Flex align='center' gap='1'>
                          <CalendarDays size={14} color='var(--gray-9)' />
                          <Text size='1' color='gray'>
                            Pinjam: {formatDate(loan.loanDate)}
                          </Text>
                        </Flex>
                      )}

                      {loan.dueDate && (
                        <Flex align='center' gap='1'>
                          <CalendarDays size={14} color={overdue ? 'var(--red-9)' : 'var(--orange-9)'} />
                          <Text size='1' color={overdue ? 'red' : undefined} weight={overdue ? 'bold' : undefined}>
                            Jatuh tempo: {formatDate(loan.dueDate)}
                            {overdue && ` (Terlambat ${lateDays} hari)`}
                          </Text>
                        </Flex>
                      )}

                      {loan.member?.name && (
                        <Flex align='center' gap='1'>
                          <User size={14} color='var(--gray-9)' />
                          <Text size='1' color='gray'>
                            {loan.member.name}
                          </Text>
                        </Flex>
                      )}
                    </Flex>

                    {/* Baris 2.5: Informasi Denda */}
                    {overdue && loan.status !== 'RETURNED' && (
                      <Flex 
                        align='center' 
                        gap='2' 
                        p='2' 
                        style={{ 
                          background: 'var(--red-3)', 
                          borderRadius: '8px',
                          border: '1px solid var(--red-6)'
                        }}
                      >
                        <AlertCircle size={16} color='var(--red-11)' />
                        <Text size='2' weight='bold' color='red'>
                          Denda saat ini: {formatRupiah(fine)}
                        </Text>
                        <Text size='1' color='gray' style={{ marginLeft: 'auto' }}>
                          (Rp1.000/hari)
                        </Text>
                      </Flex>
                    )}

                    {/* Baris 3: Action Buttons */}
                    <Flex justify='end' gap='2' mt='1'>
                      <Tooltip content='Lihat Detail'>
                        <IconButton 
                          size='2' 
                          variant='soft' 
                          color='gray' 
                          radius='full'
                          onClick={() => setDetailLoan(loan)}
                        >
                          <Info size={14} />
                        </IconButton>
                      </Tooltip>

                      {loan.status !== 'RETURNED' && (
                        <Dialog.Root
                          open={openDialogId === loan.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenDialogId(loan.id);
                              returnForm.setFieldValue('loanId', loan.id);
                            } else {
                              setOpenDialogId(null);
                              returnForm.reset();
                            }
                          }}
                        >
                          <Dialog.Trigger>
                            <IconButton size='2' variant='solid' color='blue' radius='full'>
                              <Undo2 size={14} />
                            </IconButton>
                          </Dialog.Trigger>

                          <Dialog.Content maxWidth='450px'>
                            <Dialog.Title>Pengembalian Buku</Dialog.Title>
                            <Dialog.Description size='2' mb='4' color='gray'>
                              Laporkan kondisi buku yang dikembalikan.
                            </Dialog.Description>

                            {overdue && (
                              <Flex 
                                align='center' 
                                gap='2' 
                                p='3' 
                                mb='4'
                                style={{ 
                                  background: 'var(--red-3)', 
                                  borderRadius: '8px',
                                  border: '1px solid var(--red-6)'
                                }}
                              >
                                <Coins size={18} color='var(--red-11)' />
                                <Box>
                                  <Text size='2' weight='bold' color='red'>
                                    Total Denda: {formatRupiah(fine)}
                                  </Text>
                                  <Text size='1' color='gray'>
                                    Terlambat {lateDays} hari × Rp1.000/hari
                                  </Text>
                                </Box>
                              </Flex>
                            )}

                            <Form.Root
                              onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                returnForm.handleSubmit();
                              }}
                            >
                              <Flex direction='column' gap='4'>
                                <returnForm.Field name='condition'>
                                  {(field) => (
                                    <SelectField
                                      field={field}
                                      label='Kondisi Buku'
                                      icon={<BookCheck />}
                                      required
                                      error={getFieldError(field)}
                                      options={[
                                        { value: 'good', label: 'Bagus (Good)' },
                                        { value: 'damaged', label: 'Rusak (Damaged)' },
                                        { value: 'lost', label: 'Hilang (Lost)' },
                                      ]}
                                    />
                                  )}
                                </returnForm.Field>

                                <returnForm.Field name='notes'>
                                  {(field) => (
                                    <TextareaField
                                      field={field}
                                      label='Catatan'
                                      icon={<NotepadText />}
                                      placeholder='Tambahkan catatan jika ada kerusakan...'
                                      error={getFieldError(field)}
                                    />
                                  )}
                                </returnForm.Field>

                                <returnForm.Subscribe selector={(s) => [s.canSubmit]}>
                                  {([canSubmit]) => (
                                    <Flex gap='3' justify='end' mt='4'>
                                      <Dialog.Close>
                                        <Button type='button' variant='soft' color='gray'>
                                          Batal
                                        </Button>
                                      </Dialog.Close>

                                      <Button type='submit' disabled={!canSubmit}>
                                        Konfirmasi Pengembalian
                                      </Button>
                                    </Flex>
                                  )}
                                </returnForm.Subscribe>
                              </Flex>
                            </Form.Root>
                          </Dialog.Content>
                        </Dialog.Root>
                      )}
                    </Flex>
                  </Flex>
                </Card>
              );
            })}
          </Flex>
        )}
      </Flex>

      {/* Detail Modal untuk Loan */}
      <Dialog.Root open={!!detailLoan} onOpenChange={(open) => !open && setDetailLoan(null)}>
        <Dialog.Content maxWidth='600px' style={{ maxHeight: '80vh', overflow: 'auto' }}>
          <Dialog.Title>
            <Flex align='center' gap='2'>
              <BookOpen size={20} />
              Detail Peminjaman Buku
            </Flex>
          </Dialog.Title>
          
          {detailLoan && (
            <Flex direction='column' gap='4'>
              {/* Book Info Section */}
              <Box>
                <Heading size='3' mb='3'>Informasi Buku</Heading>
                <Table.Root variant='surface'>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width='150px'><Text weight='bold'>Judul</Text></Table.Cell>
                      <Table.Cell>{detailLoan.book?.title || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>Penulis</Text></Table.Cell>
                      <Table.Cell>{detailLoan.book?.author || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>ISBN</Text></Table.Cell>
                      <Table.Cell>{detailLoan.book?.isbn || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>Penerbit</Text></Table.Cell>
                      <Table.Cell>{detailLoan.book?.publisher || '-'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>Tahun</Text></Table.Cell>
                      <Table.Cell>{detailLoan.book?.year || '-'}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </Box>

              {/* Loan Info Section */}
              <Box>
                <Heading size='3' mb='3'>Informasi Peminjaman</Heading>
                <Table.Root variant='surface'>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width='150px'><Text weight='bold'>ID Transaksi</Text></Table.Cell>
                      <Table.Cell><Badge variant='soft'>{detailLoan.id}</Badge></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>Status</Text></Table.Cell>
                      <Table.Cell>
                        <Badge color={detailLoan.status === 'RETURNED' ? 'green' : 'blue'}>
                          {detailLoan.status}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>Tanggal Pinjam</Text></Table.Cell>
                      <Table.Cell>
                        <Flex align='center' gap='2'>
                          <Calendar size={14} />
                          {formatDateTime(detailLoan.loanDate)}
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>Jatuh Tempo</Text></Table.Cell>
                      <Table.Cell>
                        <Flex align='center' gap='2'>
                          <Clock size={14} />
                          {formatDateTime(detailLoan.dueDate)}
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                    {detailLoan.returnDate && (
                      <Table.Row>
                        <Table.Cell><Text weight='bold'>Tanggal Kembali</Text></Table.Cell>
                        <Table.Cell>
                          <Flex align='center' gap='2'>
                            <Calendar size={14} />
                            {formatDateTime(detailLoan.returnDate)}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    )}
                    <Table.Row>
                      <Table.Cell><Text weight='bold'>Denda</Text></Table.Cell>
                      <Table.Cell>
                        <Flex align='center' gap='2'>
                          <Coins size={14} />
                          {formatRupiah(calculateFine(detailLoan.dueDate, detailLoan.returnDate))}
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </Box>

              {/* Member Info Section */}
              {detailLoan.member && (
                <Box>
                  <Heading size='3' mb='3'>Informasi Peminjam</Heading>
                  <Table.Root variant='surface'>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width='150px'><Text weight='bold'>Nama</Text></Table.Cell>
                        <Table.Cell>
                          <Flex align='center' gap='2'>
                            <UserRound size={14} />
                            {detailLoan.member.fullName}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><Text weight='bold'>Kode Member</Text></Table.Cell>
                        <Table.Cell>{detailLoan.member.memberCode || '-'}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><Text weight='bold'>Email</Text></Table.Cell>
                        <Table.Cell>{detailLoan.member.user.email || '-'}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                </Box>
              )}

              {/* Notes Section */}
              {detailLoan.notes && (
                <Box>
                  <Heading size='3' mb='3'>Catatan</Heading>
                  <Card variant='surface'>
                    <Flex align='start' gap='2'>
                      <FileText size={16} />
                      <Text size='2'>{detailLoan.notes}</Text>
                    </Flex>
                  </Card>
                </Box>
              )}
            </Flex>
          )}

          <Flex gap='3' justify='end' mt='5'>
            <Dialog.Close>
              <Button variant='soft' color='gray'>Tutup</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}