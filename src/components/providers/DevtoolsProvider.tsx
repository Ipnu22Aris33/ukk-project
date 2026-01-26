"use client";

import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

export function DevtoolsProvider({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackDevtools
        config={{ hideUntilHover: true }}
        plugins={[formDevtoolsPlugin()]}
      />
    </>
  );
}
