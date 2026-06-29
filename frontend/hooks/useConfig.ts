import { useLocalStorage } from '@siberiacancode/reactuse';

interface Config {
  authenticated: boolean;
}

const DEFAULT: Config = {
  authenticated: false
};

// const configStorage = localStorage.getItem('config');

// if (configStorage) {
//   localStorage.setItem('config', JSON.stringify(DEFAULT));
// }

export const useConfig = () => {
  // useState(configStorage ?? DEFAULT);
  const { value, set } = useLocalStorage<Config>('config', DEFAULT);
  return [value ?? DEFAULT, set] as const;
};
