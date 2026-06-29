import type { ThemeMode } from './context';

import { getCookie, setCookie } from '@siberiacancode/reactuse';

import { useLayoutEffect, useMemo, useState } from 'react';

import { ThemeContext } from './context';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    return (getCookie('mode') as ThemeMode) ?? 'dark';
  });

  useLayoutEffect(() => {
    const root = document.documentElement;

    setCookie('mode', mode);

    root.classList.remove('dark', 'light');
    root.classList.add(mode);
  });

  const contextValue = useMemo(() => ({ mode, setMode }), [mode]);

  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}
