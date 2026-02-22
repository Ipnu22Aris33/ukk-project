// components/forms/InputField.tsx
'use client';

import { FieldWrapper } from './FieldWrapper';
import { TextField, IconButton, Popover, Box, Grid, Flex, Text, Button } from '@radix-ui/themes';
import type { AnyFieldApi } from '@tanstack/react-form';
import { EyeOpenIcon, EyeClosedIcon, CalendarIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface InputFieldProps {
  field: AnyFieldApi;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'date';
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
}

// SimpleDatePicker component (tetap sama seperti punyamu)
function SimpleDatePicker({ value, onChange, onClose }: { value: string; onChange: (date: string) => void; onClose: () => void }) {
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({ date: prevDate, currentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), currentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), currentMonth: false });
    }

    return days;
  };

  const days = getDaysInMonth(viewDate);
  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(format(date, 'yyyy-MM-dd'));
    onClose();
  };

  const changeMonth = (increment: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + increment, 1));
  };

  const changeYear = (increment: number) => {
    setViewDate(new Date(viewDate.getFullYear() + increment, viewDate.getMonth(), 1));
  };

  return (
    <Box
      style={{
        background: 'var(--color-panel-solid)',
        borderRadius: 'var(--radius-3)',
        minWidth: '280px',
      }}
    >
      <Box p='3'>
        {/* Header */}
        <Flex align='center' justify='between' mb='3'>
          <Flex gap='1'>
            <IconButton size='1' variant='soft' onClick={() => changeYear(-1)} title='Tahun sebelumnya' color='gray'>
              <Text weight='bold'>«</Text>
            </IconButton>
            <IconButton size='1' variant='soft' onClick={() => changeMonth(-1)} title='Bulan sebelumnya' color='gray'>
              <Text weight='bold'>‹</Text>
            </IconButton>
          </Flex>

          <Text size='2' weight='bold' style={{ textTransform: 'capitalize' }}>
            {format(viewDate, 'MMMM yyyy', { locale: id })}
          </Text>

          <Flex gap='1'>
            <IconButton size='1' variant='soft' onClick={() => changeMonth(1)} title='Bulan berikutnya' color='gray'>
              <Text weight='bold'>›</Text>
            </IconButton>
            <IconButton size='1' variant='soft' onClick={() => changeYear(1)} title='Tahun berikutnya' color='gray'>
              <Text weight='bold'>»</Text>
            </IconButton>
          </Flex>
        </Flex>

        {/* Week days */}
        <Grid columns='7' gap='1' mb='2'>
          {weekDays.map((day) => (
            <Box
              key={day}
              style={{
                textAlign: 'center',
                padding: '4px 0',
              }}
            >
              <Text size='1' weight='bold' color='gray'>
                {day}
              </Text>
            </Box>
          ))}
        </Grid>

        {/* Days */}
        <Grid columns='7' gap='1'>
          {days.map(({ date, currentMonth }) => {
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            const isToday = isSameDay(date, new Date());
            const dateStr = format(date, 'yyyy-MM-dd');

            return (
              <Button
                key={dateStr}
                size='1'
                variant={isSelected ? 'solid' : 'soft'}
                onClick={() => handleDateSelect(date)}
                disabled={!currentMonth}
                title={format(date, 'EEEE, dd MMMM yyyy', { locale: id })}
                style={{
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  opacity: !currentMonth ? 0.3 : 1,
                  cursor: currentMonth ? 'pointer' : 'default',
                  fontWeight: isToday || isSelected ? 'bold' : 'normal',
                }}
                color={isSelected ? 'violet' : isToday ? 'blue' : 'gray'}
                highContrast={isSelected}
              >
                {format(date, 'd')}
              </Button>
            );
          })}
        </Grid>

        {/* Footer with shortcuts */}
        <Box
          mt='3'
          pt='3'
          style={{
            borderTop: '1px solid var(--gray-a5)',
          }}
        >
          <Flex gap='2' justify='between'>
            <Button
              size='1'
              variant='soft'
              onClick={() => {
                const today = new Date();
                handleDateSelect(today);
              }}
              color='violet'
              style={{
                flex: 1,
              }}
            >
              Hari Ini
            </Button>
            <Button
              size='1'
              variant='soft'
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                handleDateSelect(tomorrow);
              }}
              color='violet'
              style={{
                flex: 1,
              }}
            >
              Besok
            </Button>
            <Button
              size='1'
              variant='soft'
              onClick={() => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                handleDateSelect(nextWeek);
              }}
              color='violet'
              style={{
                flex: 1,
              }}
            >
              +7 Hari
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

export function InputField({ field, label, type = 'text', placeholder, required = false, icon, error }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Helper untuk format tanggal display
  const formatDateForDisplay = (value: any) => {
    if (!value) return '';
    if (value instanceof Date) {
      return format(value, 'dd MMMM yyyy', { locale: id });
    }
    return value;
  };

  // Helper untuk format ke string YYYY-MM-DD buat date picker
  const toDateString = (value: any) => {
    if (!value) return '';
    if (value instanceof Date) {
      return format(value, 'yyyy-MM-dd');
    }
    return value;
  };

  return (
    <FieldWrapper field={field} label={label} required={required} error={error}>
      {type === 'date' ? (
        <Popover.Root open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <Popover.Trigger>
            <Box className='w-full'>
              <TextField.Root
                size='3'
                onChange={() => {}}
                variant='soft'
                value={formatDateForDisplay(field.state.value)}
                placeholder={placeholder || 'Pilih tanggal'}
                style={{ cursor: 'pointer' }}
                color={error ? 'red' : undefined}
              >
                {icon && <TextField.Slot side='left'>{icon}</TextField.Slot>}
                <TextField.Slot side='right'>
                  <IconButton type='button' size='2' variant='ghost' style={{ marginRight: '-4px' }}>
                    <CalendarIcon />
                  </IconButton>
                </TextField.Slot>
              </TextField.Root>
            </Box>
          </Popover.Trigger>

          <Popover.Content
            align='center'
            style={{
              padding: 0,
              minWidth: 'auto',
            }}
          >
            <SimpleDatePicker
              value={toDateString(field.state.value)}
              onChange={(dateString) => {
                console.log('📅 dateString dari picker:', dateString, typeof dateString);
                // KONVERSI STRING KE DATE OBJECT
                field.handleChange(new Date(dateString));
              }}
              onClose={() => setIsDatePickerOpen(false)}
            />
          </Popover.Content>
        </Popover.Root>
      ) : (
        <TextField.Root
          size='3'
          type={inputType}
          variant='soft'
          value={field.state.value || ''}
          onChange={(e) => {
            const raw = e.target.value;

            if (type === 'number') {
              field.handleChange(raw === '' ? undefined : Number(raw));
            } else {
              field.handleChange(raw);
            }
          }}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          className='w-full'
          color={error ? 'red' : undefined}
        >
          {icon && <TextField.Slot side='left'>{icon}</TextField.Slot>}

          {type === 'password' && (
            <TextField.Slot side='right' className='pr-1'>
              <IconButton
                type='button'
                size='1'
                variant='ghost'
                className='hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </IconButton>
            </TextField.Slot>
          )}
        </TextField.Root>
      )}
    </FieldWrapper>
  );
}
