'use client'

import { Theme, Flex } from '@radix-ui/themes';
import { UserHeader } from './UserHeader';
import { UserFooter } from './UserFooter';
import { UserContent } from './UserContent';
import { useAuth } from '@/hooks/useAuth';

interface UserLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  schoolName?: string;
  studentId?: string;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { session } = useAuth();
  return (
    <Theme appearance='inherit' accentColor='indigo' radius='medium' className='min-h-screen flex flex-col'>
      {/* Header */}
      <UserHeader schoolName='BM' userName={session?.email} />

      {/* Content */}
      <Flex direction='column' style={{ flexGrow: 1 }}>
        <UserContent>{children}</UserContent>
      </Flex>

      {/* Footer */}
      <UserFooter schoolName='BM' />
    </Theme>
  );
}
