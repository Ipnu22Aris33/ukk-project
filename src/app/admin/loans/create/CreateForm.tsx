// app/books/create/page.tsx
'use client';

import { Container, Heading, Flex, Card } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useBooks } from '@/hooks/useBooks';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoanForm } from '../LoanForm';
import { useLoans } from '@/hooks/useLoans';
import { Loan } from '@/lib/schema/loan';

export function CreateForm() {
  const router = useRouter();
  const loans = useLoans();

  const handleSubmit = async (data: Loan) => {
    await loans.create.mutateAsync({
      memberId: data.memberId,
      bookId: data.bookId,
      quantity: data.quantity,
      loanDate: data.loanDate,
      dueDate: data.dueDate,
      status: data.status,
      notes: data.notes,
    });

    router.push('/admin/loans');
    router.refresh();
  };

  const breadcrumbItems = [{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Loans', href: '/admin/loans' }, { label: 'Create New Loan' }];

  return (
    <Container size='3'>
      <Breadcrumb items={breadcrumbItems} />

      <Flex justify='between' align='center' mb='6'>
        <Heading size='8'>Create New Loan</Heading>
      </Flex>

      <Card size='3'>
        <LoanForm onSubmit={handleSubmit} submitLabel='Create Loan' />
      </Card>
    </Container>
  );
}
