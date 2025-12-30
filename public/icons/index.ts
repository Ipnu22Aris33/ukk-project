import { IconifyIcon } from '@iconify/types';
import carbon from './carbon';

export const iconSets = {
  carbon,
} as const satisfies Record<string, Record<string, IconifyIcon>>;

