import { useLocalStorage } from '@siberiacancode/reactuse';
import type { UserSchema } from '@/shared/api/types.gen';

export interface Config {
  authenticated: boolean;
  user: UserSchema | null;
}

const DEFAULT: Config = {
  authenticated: false,
  user: null
};

export const useConfig = () => {
  const { value, set } = useLocalStorage<Config>('config', DEFAULT);
  return [{ ...DEFAULT, ...value }, set] as const;
};
