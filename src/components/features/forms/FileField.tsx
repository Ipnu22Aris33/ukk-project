'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Box, Text, Flex, IconButton, Card } from '@radix-ui/themes';
import Image from 'next/image';

interface FileFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  initialPreviewUrl?: string | null; // 🔥 NEW
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
}

export function FileField({
  label,
  required,
  error,
  value,
  onChange,
  initialPreviewUrl,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
  maxSize = 2 * 1024 * 1024,
  disabled = false,
}: FileFieldProps) {
  const onDrop = React.useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        onChange?.(accepted[0]);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled,
  });

  // 🔥 Preview for new uploaded file
  const filePreview = React.useMemo(
    () => (value ? URL.createObjectURL(value) : null),
    [value]
  );

  React.useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // 🔥 Final preview logic
  const previewSrc = filePreview ?? initialPreviewUrl ?? null;

  return (
    <Box>
      <Text weight="medium">
        {label} {required && '*'}
      </Text>

      <Card
        {...getRootProps()}
        size="2"
        style={{
          borderStyle: 'dashed',
          borderWidth: 2,
          cursor: 'pointer',
          marginTop: 8,
        }}
      >
        <input {...getInputProps()} />

        {!previewSrc && (
          <Flex direction="column" align="center" gap="2" py="4">
            <UploadIcon width={28} height={28} />
            <Text size="2">
              {isDragActive
                ? 'Lepaskan di sini...'
                : 'Klik atau tarik file ke sini'}
            </Text>
          </Flex>
        )}

        {previewSrc && (
          <Flex direction="column" align="center" gap="2">
            <Image
              src={previewSrc}
              alt="Preview"
              width={160}
              height={220}
              style={{
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />

            <IconButton
              size="1"
              variant="ghost"
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(null);
              }}
            >
              <Cross2Icon />
            </IconButton>
          </Flex>
        )}
      </Card>

      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </Box>
  );
}