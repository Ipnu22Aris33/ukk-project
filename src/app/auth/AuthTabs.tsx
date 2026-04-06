'use client';

import { Flex, Box, Container } from '@radix-ui/themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useHashState } from '@/hooks/useHashState';
import LoginForm from './LoginForm';
import ActivateForm from './ActivateForm';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useHashState(['login', 'activate'], 'login', { replace: true });

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Container size='4' className='w-full'>
        <Flex justify='center' className='w-full'>
          <Box className='w-full max-w-md'>
            <AnimatePresence mode='wait'>
              {activeTab === 'login' ? (
                <motion.div
                  key='login-card'
                  initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className='w-full'
                >
                  <LoginForm setActiveTab={() => setActiveTab('activate')} />
                </motion.div>
              ) : (
                <motion.div
                  key='activate-card'
                  initial={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className='w-full'
                >
                  <ActivateForm setActiveTab={() => setActiveTab('login')} />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Flex>
      </Container>
    </div>
  );
}
