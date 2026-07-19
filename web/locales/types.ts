import type { ru } from './ru';

/**
 * The canonical dictionary shape is derived from the Russian source, so every
 * other locale is structurally checked against it. `DeepPartial`-free on purpose:
 * a translation is only complete when it fills every key.
 */
export type Dictionary = {
  readonly [K in keyof typeof ru]: {
    readonly [P in keyof (typeof ru)[K]]: (typeof ru)[K][P] extends object
      ? { readonly [Q in keyof (typeof ru)[K][P]]: string }
      : string;
  };
};

export type Locale = 'ru' | 'en';
