'use client';

import type { SVGProps } from 'react';
import * as Icons from '@/components/icons';

export type IconName = keyof typeof Icons;

type AppIconProps = {
  name: IconName;
  size?: number;
  className?: string;
} & SVGProps<SVGSVGElement>;

export function AppIcon({ name, size = 24, className, ...props }: AppIconProps) {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    throw new Error(`AppIcon: icon "${name}" not Found`);
  }

  return <IconComponent width={size} height={size} className={className} {...props} />;
}
