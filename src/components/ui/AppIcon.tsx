'use client';

import { Icon } from '@iconify/react';
import type { ComponentProps } from 'react';
import { iconSets } from 'public/icons';

type AppIconProps = ComponentProps<typeof Icon> & { icon: string };

export function AppIcon({ icon, ...props }: AppIconProps) {
  const [set, name] = icon.split(':');

  const resolvedIcon =
    iconSets[set as keyof typeof iconSets]?.[
      name as keyof (typeof iconSets)[keyof typeof iconSets]
    ] as any;

  return <Icon icon={resolvedIcon} {...props} />;
}
