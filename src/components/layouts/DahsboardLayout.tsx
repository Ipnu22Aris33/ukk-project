'use client';

import { Theme } from '@radix-ui/themes';
import { Box, Flex, Container } from '@radix-ui/themes';
import { useResponsive } from '@/hooks/useResponsive';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    isMobile,
    sidebarOpen,
    sidebarCollapsed,
    setSidebarOpen,
    toggleSidebar,
    closeMobileSidebar,
  } = useResponsive();

  return (
    <Flex style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 49,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Box
        style={{
          width: isMobile ? '250px' : sidebarCollapsed ? '70px' : '250px',
          minWidth: isMobile ? '250px' : sidebarCollapsed ? '70px' : '250px',
          flexShrink: 0,
          backgroundColor: 'var(--gray-1)',
          borderRight: '1px solid var(--gray-5)',
          position: isMobile ? 'fixed' : 'relative',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
          transform: isMobile
            ? sidebarOpen
              ? 'translateX(0)'
              : 'translateX(-100%)'
            : 'translateX(0)',
          transition: isMobile ? 'transform 0.3s ease' : 'all 0.3s ease',
        }}
      >
        <Sidebar
          isMobile={isMobile}
          sidebarCollapsed={sidebarCollapsed}
          onCloseMobile={closeMobileSidebar}
        />
      </Box>

      {/* Main Content */}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          width: isMobile ? '100%' : sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)',
          transition: isMobile ? 'none' : 'all 0.3s ease',
        }}
      >
        <Header
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
        />
        {/* Content Area */}
        <Box
          style={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'var(--gray-2)',
          }}
        >
          <Container size='3' style={{ padding: '20px' }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
