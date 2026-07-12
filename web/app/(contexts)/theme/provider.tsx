import type { AccentTheme, ThemeMode } from './context';

import { useCookie } from '@siberiacancode/reactuse';
import { useLayoutEffect, useMemo } from 'react';

import { ThemeContext } from './context';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const modeCookie = useCookie<ThemeMode>('mode', {
    initialValue: 'dark',
    path: '/',
    sameSite: 'Lax'
  });
  const mode = modeCookie.value;
  const accentCookie = useCookie<AccentTheme>('accent', {
    initialValue: 'neutral',
    path: '/',
    sameSite: 'Lax'
  });
  const accent = accentCookie.value;

  useLayoutEffect(() => {
    const root = document.documentElement;

    root.classList.remove(
      'dark',
      'light',
      'theme-neutral',
      'theme-purple',
      'theme-blue',
      'theme-pink'
    );
    root.classList.add(mode, `theme-${accent}`);
  }, [mode, accent]);

  const contextValue = useMemo(
    () => ({
      mode,
      setMode: (nextMode: ThemeMode) => modeCookie.set(nextMode),
      accent,
      setAccent: (nextAccent: AccentTheme) => accentCookie.set(nextAccent)
    }),
    [mode, modeCookie, accent, accentCookie]
  );

  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}
