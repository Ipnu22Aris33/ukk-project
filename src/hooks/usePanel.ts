'use client';

import { useState } from 'react';

export type PanelMode = 'add' | 'view' | 'edit' | null;

export function usePanel<T>() {
  const [mode, setMode] = useState<PanelMode>(null);
  const [selected, setSelected] = useState<T | null>(null);

  const open = (panelMode: Exclude<PanelMode, null>, data?: T) => {
    setMode(panelMode);
    if (data) setSelected(data);
  };

  const close = () => {
    setMode(null);
    setSelected(null);
  };

  return {
    mode,
    selected,
    open,
    close,
  };
}
