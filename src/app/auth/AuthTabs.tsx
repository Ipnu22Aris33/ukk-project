'use client';

import { useState } from 'react';
import { Card, Text, Heading, Button, Flex, Box, Container } from '@radix-ui/themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useHashState } from '@/hooks/useHashState';
import * as Form from '@radix-ui/react-form';
import { InputField } from '@/components/ui/InputField';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useHashState(['login', 'register'], 'login', { replace: true });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerAddress, setRegisterAddress] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email: loginEmail, password: loginPassword });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      phone: registerPhone,
      address: registerAddress,
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-(--gray-2)'>
      <Container size='4' className='w-full max-w-5xl'>
        <Flex justify='center' className='w-full'>
          <Box className='w-full max-w-4xl'>
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
                  <Card className='border border-(--accent-6) shadow-lg overflow-hidden bg-(--gray-1)'>
                    <div className='p-0'>
                      <div className='flex flex-col md:flex-row'>
                        {/* Title di kiri */}
                        <div className='hidden md:flex md:w-2/5 items-center p-8 bg-(--accent-3)'>
                          <div className='w-full'>
                            <Heading size='6' className='font-bold mb-2 text-(--accent-12)'>
                              Welcome Back
                            </Heading>
                            <Text size='2' className='mb-6 text-(--accent-11)'>
                              Sign in to access your account and continue where you left off.
                            </Text>
                            <div className='mt-8'>
                              <Heading size='4' weight='medium' className='mb-3 text-(--accent-12)'>
                                Quick Access
                              </Heading>
                              <ul className='list-none space-y-2 text-sm text-(--accent-11)'>
                                <li className='flex items-center'>
                                  <span className='mr-2 text-(--accent-9)'>✓</span>
                                  Track your progress
                                </li>
                                <li className='flex items-center'>
                                  <span className='mr-2 text-(--accent-9)'>✓</span>
                                  Save preferences
                                </li>
                                <li className='flex items-center'>
                                  <span className='mr-2 text-(--accent-9)'>✓</span>
                                  Access all features
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Form di kanan */}
                        <div className='w-full md:w-3/5 p-6 md:p-8 bg-(--gray-1)'>
                          <div className='md:hidden text-center mb-6'>
                            <Heading size='6' className='font-bold mb-2 text-(--gray-12)'>
                              Welcome Back
                            </Heading>
                            <Text size='2' className='text-(--gray-11)'>
                              Sign in to your account
                            </Text>
                          </div>

                          <Form.Root onSubmit={handleLogin} className='space-y-6'>
                            <InputField
                              label='Email Address'
                              type='email' // PERBAIKAN: dari 'textarea' ke 'email'
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder='Enter your email'
                              required
                              floatingLabel
                              icon='mdi:mail'
                              validateOnChange
                              variant='outlined' // Konsisten pakai outlined
                            />

                            <InputField
                              label='Password'
                              type='password'
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              placeholder='Enter your password'
                              required
                              floatingLabel
                              showPasswordToggle
                              variant='outlined' // Konsisten pakai outlined
                              validateOnChange
                              minLength={8}
                              maxLength={20}
                              validate={(value) => {
                                if (!/[A-Z]/.test(value))
                                  return 'Must contain at least one uppercase letter';
                                if (!/[a-z]/.test(value))
                                  return 'Must contain at least one lowercase letter';
                                if (!/[0-9]/.test(value)) return 'Must contain at least one number';
                                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
                                  return 'Must contain at least one special character';
                                return true;
                              }}
                              icon='mdi:lock-outline'
                            />

                            <Flex justify='end' className='mt-2'>
                              <button
                                type='button'
                                className='text-sm text-(--accent-11) hover:text-(--accent-12) hover:underline transition-colors'
                              >
                                Forgot password?
                              </button>
                            </Flex>

                            <Flex direction='column' width='100%' className='mt-8'>
                              <Button
                                type='submit'
                                size='3'
                                className='
                                  w-full
                                  transition-all
                                  duration-200
                                  hover:scale-[1.02]
                                  active:scale-[0.98]
                                  bg-(--accent-9)
                                  hover:bg-(--accent-10)
                                '
                              >
                                Sign In
                              </Button>
                            </Flex>

                            <div className='text-center mt-6'>
                              <Text size='2' className='text-(--gray-11)'>
                                or sign in with
                              </Text>
                              <Flex justify='center' gap='3' className='mt-4'>
                                <Button variant='outline' className='flex-1'>
                                  Google
                                </Button>
                                <Button variant='outline' className='flex-1'>
                                  GitHub
                                </Button>
                              </Flex>
                            </div>
                          </Form.Root>

                          <div className='text-center mt-8 pt-8 border-t border-(--gray-6)'>
                            <Text size='2' className='text-(--gray-11)' as='span'>
                              Don't have an account?{' '}
                            </Text>
                            <button
                              type='button'
                              onClick={() => setActiveTab('register')}
                              className='
                                font-semibold 
                                p-0 
                                border-0 
                                bg-transparent 
                                cursor-pointer
                                transition-colors
                                duration-200
                                text-(--accent-11) 
                                hover:text-(--accent-12)
                                hover:underline
                              '
                            >
                              Create Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key='register-card'
                  initial={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className='w-full'
                >
                  <Card className='border border-(--accent-6) shadow-lg overflow-hidden bg-(--gray-1)'>
                    <div className='p-0'>
                      <div className='flex flex-col md:flex-row'>
                        {/* Title di kiri */}
                        <div className='hidden md:flex md:w-2/5 items-center p-8 bg-(--accent-3)'>
                          <div className='w-full'>
                            <Heading size='6' className='font-bold mb-2 text-(--accent-12)'>
                              Create Account
                            </Heading>
                            <Text size='2' className='mb-6 text-(--accent-11)'>
                              Join our platform and start your journey with personalized features.
                            </Text>
                            <div className='mt-8'>
                              <Heading size='4' weight='medium' className='mb-3 text-(--accent-12)'>
                                Why Register?
                              </Heading>
                              <ul className='list-none space-y-2 text-sm text-(--accent-11)'>
                                <li className='flex items-center'>
                                  <span className='mr-2 text-(--accent-9)'>✓</span>
                                  Access all features
                                </li>
                                <li className='flex items-center'>
                                  <span className='mr-2 text-(--accent-9)'>✓</span>
                                  Personalized experience
                                </li>
                                <li className='flex items-center'>
                                  <span className='mr-2 text-(--accent-9)'>✓</span>
                                  Priority support
                                </li>
                                <li className='flex items-center'>
                                  <span className='mr-2 text-(--accent-9)'>✓</span>
                                  Community access
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Form di kanan */}
                        <div className='w-full md:w-3/5 p-6 md:p-8 bg-(--gray-1)'>
                          <div className='md:hidden text-center mb-6'>
                            <Heading size='6' className='font-bold mb-2 text-(--gray-12)'>
                              Create Account
                            </Heading>
                            <Text size='2' className='text-(--gray-11)'>
                              Fill in your details to get started
                            </Text>
                          </div>

                          <Form.Root onSubmit={handleRegister} className='space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                              <InputField
                                label='Full Name'
                                type='text'
                                value={registerName}
                                onChange={(e) => setRegisterName(e.target.value)}
                                placeholder='Enter your full name'
                                required
                                floatingLabel
                                variant='outlined'
                                icon='mdi:account-outline'
                              />

                              <InputField
                                label='Email Address'
                                type='email'
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                                placeholder='Enter your email'
                                required
                                floatingLabel
                                variant='outlined'
                                icon='mdi:email-outline'
                                validateOnChange
                              />

                              <InputField
                                label='Phone Number'
                                type='tel'
                                value={registerPhone}
                                onChange={(e) => setRegisterPhone(e.target.value)}
                                placeholder='08xx xxxx xxxx'
                                floatingLabel
                                variant='outlined'
                                required
                                icon='mdi:phone-outline'
                                validate={(value) => {
                                  const digitsOnly = value.replace(/\D/g, '');
                                  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
                                    return 'Phone number must be 10-15 digits';
                                  }
                                  return true;
                                }}
                              />

                              <InputField
                                label='Password'
                                type='password'
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                placeholder='Create a strong password'
                                required
                                floatingLabel
                                variant='outlined'
                                showPasswordToggle
                                icon='mdi:lock-outline'
                                validateOnChange
                                minLength={8}
                                maxLength={20}
                                validate={(value) => {
                                  if (!/[A-Z]/.test(value))
                                    return 'Must contain at least one uppercase letter';
                                  if (!/[a-z]/.test(value))
                                    return 'Must contain at least one lowercase letter';
                                  if (!/[0-9]/.test(value))
                                    return 'Must contain at least one number';
                                  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
                                    return 'Must contain at least one special character';
                                  return true;
                                }}
                              />

                              <div className='col-span-1 md:col-span-2'>
                                <InputField
                                  label='Address'
                                  type='textarea'
                                  value={registerAddress}
                                  onChange={(e) => setRegisterAddress(e.target.value)}
                                  placeholder='Enter your complete address'
                                  floatingLabel
                                  variant='outlined'
                                  rows={4}
                                />
                              </div>
                            </div>

                            <div className='mt-4'>
                              <label className='flex items-start gap-2 cursor-pointer'>
                                <input type='checkbox' className='mt-1' required />
                                <Text size='2' className='text-(--gray-11)'>
                                  I agree to the{' '}
                                  <a href='#' className='text-(--accent-11) hover:underline'>
                                    Terms of Service
                                  </a>{' '}
                                  and{' '}
                                  <a href='#' className='text-(--accent-11) hover:underline'>
                                    Privacy Policy
                                  </a>
                                </Text>
                              </label>
                            </div>

                            <Flex direction='column' width='100%' className='mt-6'>
                              <Button
                                type='submit'
                                size='3'
                                className='
                                  w-full
                                  transition-all
                                  duration-200
                                  hover:scale-[1.02]
                                  active:scale-[0.98]
                                  bg-(--accent-9)
                                  hover:bg-(--accent-10)
                                '
                              >
                                Create Account
                              </Button>
                            </Flex>

                            <div className='text-center mt-6'>
                              <Text size='2' className='text-(--gray-11)'>
                                or sign up with
                              </Text>
                              <Flex justify='center' gap='3' className='mt-4'>
                                <Button variant='outline' className='flex-1'>
                                  Google
                                </Button>
                                <Button variant='outline' className='flex-1'>
                                  GitHub
                                </Button>
                              </Flex>
                            </div>
                          </Form.Root>

                          <div className='text-center mt-8 pt-8 border-t border-(--gray-6)'>
                            <Text size='2' className='text-(--gray-11)' as='span'>
                              Already have an account?{' '}
                            </Text>
                            <button
                              type='button'
                              onClick={() => setActiveTab('login')}
                              className='
                                font-semibold 
                                p-0 
                                border-0 
                                bg-transparent 
                                cursor-pointer
                                transition-colors
                                duration-200
                                text-(--accent-11) 
                                hover:text-(--accent-12)
                                hover:underline
                              '
                            >
                              Sign In
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Flex>
      </Container>
    </div>
  );
}
