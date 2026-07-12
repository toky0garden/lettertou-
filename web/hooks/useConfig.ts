import { useLocalStorage } from '@siberiacancode/reactuse';
import type { UserResponse } from '@/generated';

export interface Config {
  authenticated: boolean;
  user: UserResponse | null;
}

const DEFAULT: Config = {
  authenticated: false,
  user: null
};

// const configStorage = localStorage.getItem('config');

// if (configStorage) {
//   localStorage.setItem('config', JSON.stringify(DEFAULT));
// }

export const useConfig = () => {
  const { value, set } = useLocalStorage<Config>('config', DEFAULT);
  return [{ ...DEFAULT, ...value }, set] as const;
};
