import { useLocalStorage } from '@siberiacancode/reactuse';

export interface WatchHistoryItem {
  slug: string;
  title: string;
  poster: string | null;
  episode: number;
  updatedAt: number;
}

const MAX_ITEMS = 12;

export const useWatchHistory = () => {
  const { value, set } = useLocalStorage<WatchHistoryItem[]>('watch-history', []);
  const history = Array.isArray(value) ? value : [];

  const upsert = (item: Omit<WatchHistoryItem, 'updatedAt'>) => {
    const rest = history.filter((entry) => entry.slug !== item.slug);
    set([{ ...item, updatedAt: Date.now() }, ...rest].slice(0, MAX_ITEMS));
  };

  const remove = (slug: string) => {
    set(history.filter((entry) => entry.slug !== slug));
  };

  return { history, upsert, remove } as const;
};
