import { use } from 'react';
import { ThemeContext } from './context';

export const useTheme = () => use(ThemeContext);
