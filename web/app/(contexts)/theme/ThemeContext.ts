import { createContext } from 'react';

export type ThemeMode = 'dark' | 'light';
export type AccentTheme = 'neutral' | 'purple' | 'blue' | 'pink';

export interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  accent: AccentTheme;
  setAccent: (accent: AccentTheme) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  setMode: () => {},
  accent: 'neutral',
  setAccent: () => {}
});
