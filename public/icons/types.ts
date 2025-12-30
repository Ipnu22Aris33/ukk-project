import type { iconSets } from './index';

type IconSets = keyof typeof iconSets;

export type IconName<S extends IconSets = IconSets> = `${S}:${string}`;

