'use client';

import { ReactNode, Children, isValidElement, cloneElement } from 'react';
import { Flex } from '@radix-ui/themes';

interface AdminContentWrapperProps {
  children: ReactNode;
  direction?: 'row' | 'column';
  gap?: string;
  className?: string;
  style?: React.CSSProperties;
  autoWidth?: boolean; // <-- opsional
}

export function AdminContentWrapper({
  children,
  direction = 'row',
  gap,
  className = '',
  style,
  autoWidth = false, // default false
}: AdminContentWrapperProps) {
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <Flex direction={direction} gap={gap} className={className} style={{ width: '100%', flexWrap: 'wrap', ...style }}>
      {childArray.map((child, index) =>
        cloneElement(child as any, {
          style: {
            flex: autoWidth ? (childArray.length === 1 ? '1 1 100%' : `1 1 calc(${100 / childArray.length}% - ${gap || 0})`) : undefined, // kalau autoWidth false, biarkan anak atur sendiri
            minWidth: 0,
            ...((child as any).props.style || {}),
          },
          key: index,
        })
      )}
    </Flex>
  );
}
