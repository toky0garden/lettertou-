import type { Dictionary } from './types';

/**
 * English dictionary. Mirrors the shape of `ru` exactly — the `Dictionary` type
 * (derived from the Russian source) makes TypeScript flag any key that is missing
 * or misspelled here.
 */
export const en: Dictionary = {
  common: {
    brand: 'Ubuyashiki',
    watch: 'Watch',
    details: 'Details',
    collapse: 'Collapse',
    showMore: 'Show more',
    showAll: 'View all',
    loading: 'Loading...',
    open: 'Open',
    back: 'Back',
    toHome: 'To home',
    backToHome: 'Back to home',
    noPoster: 'No poster',
    save: 'Save',
    saving: 'Saving…'
  },

  header: {
    account: 'Account',
    catalog: 'Catalog',
    search: 'Search',
    navigation: 'Navigation',
    navigationHint: 'Where to next? Choose',
    openMenu: 'Open menu',
    searchPlaceholder: 'Find anime…',
    quickSearchAria: 'Quick anime search',
    clearSearch: 'Clear search',
    quickSearchTitle: 'Quick catalog search',
    minThreeChars: 'Enter at least three characters',
    nothingFound: 'Nothing found',
    tryAnotherSpelling: 'Try a different spelling of the title',
    allResults: 'All results'
  },

  home: {
    hero: {
      watch: 'Watch',
      details: 'Details'
    },
    continueWatching: {
      title: 'Continue watching',
      description: 'Return to what you haven’t finished',
      episode: 'Episode {count}',
      removeFromHistory: 'Remove from history'
    },
    popular: {
      title: 'Popular',
      description: 'What everyone is watching right now'
    },
    updates: {
      title: 'New releases',
      description: 'Fresh episodes and recently added titles'
    },
    genres: {
      title: 'Genres',
      description: 'Pick a mood and discover a new story',
      link: 'All genres'
    }
  },

  catalog: {
    directions: '{count} directions',
    heroTitle: 'Find a story by your mood',
    heroDescription:
      'From light romance to dark psychological dramas — pick a genre and discover a new story.',
    allGenres: 'All genres',
    allGenresHint: 'Choose what you feel like watching today',
    titlesCount: '{count} titles',
    emptyList: 'The list is empty for now'
  },

  genre: {
    label: 'Genre',
    metaTitle: '{title} — anime by genre',
    metaDescription: 'A selection of anime in the «{title}» genre.',
    selectionIn: 'A selection of anime in the «{title}» genre.',
    backToGenres: '← Back to all genres',
    animeInGenre: 'Anime in the genre',
    sortedByRating: 'Sorted by Shikimori rating',
    loadFailed: 'Failed to load the list',
    tryLater: 'Please try refreshing the page a bit later.',
    empty: 'Empty for now',
    emptyDescription: 'There are no titles in this genre yet.'
  },

  anime: {
    watch: 'Watch',
    favorite: 'Favorite',
    share: 'Share',
    linkCopied: 'Link copied',
    linkCopyFailed: 'Failed to copy the link',
    ageRating: 'Age rating',
    studio: 'Studio',
    status: 'Status',
    year: 'Release year',
    type: 'Type',
    country: 'Country',
    episodeDuration: 'Episode duration',
    minutes: '{count} min.',
    frames: 'Frames',
    framesCount: '{count} photos',
    player: 'Player',
    reviews: 'Reviews',
    inProgress: 'In progress',
    noTitle: 'Untitled'
  },

  frame: {
    open: 'Open',
    openFrame: 'Open frame {index} of {total}',
    frame: 'Frame {index}',
    framesFromAnime: 'Frames from {title}',
    useArrows: 'Use the arrows to switch between frames',
    frameFromAnime: 'Frame {index} from {title}',
    previous: 'Previous frame',
    next: 'Next frame',
    close: 'Close frame view',
    counter: 'Frame {index} of {total}'
  },

  player: {
    unavailable: 'Player unavailable',
    authRequired: 'Sign in to watch',
    dataLoadFailed: 'Failed to load player data, try again later',
    urlNotFound: 'No stream URL for this dub, try another one',
    loadError: 'Player load error',
    refreshHint: 'Try refreshing the page',
    title: 'Player',
    selectTranslation: 'Select dub',
    episode: 'Episode {count}',
    season: 'Season {count}'
  },

  search: {
    catalogKodik: 'Kodik catalog',
    findNextWatch: 'Find anime for your next watch',
    searchHint: 'Search by Russian, English or original title.',
    advancedSearch: 'Advanced search',
    advancedSearchHint: 'Enter a title — we’ll show up to 20 best matches.',
    placeholder: 'For example, Kuroko no Basket',
    animeTitleAria: 'Anime title',
    find: 'Find',
    results: 'Results',
    searching: 'Searching for matches…',
    found: 'Found: {count}',
    noMatches: 'No matches found',
    startWithTitle: 'Start with a title',
    minThreeChars: 'Enter at least 3 characters',
    searchFailed: 'Failed to run the search',
    tryAnotherTitle: 'Try another title',
    resultsWillAppear: 'Results will appear here',
    checkSpelling: 'Check the spelling or use the original anime title.',
    enterThreeChars: 'Enter at least three characters in the search box above.'
  },

  auth: {
    welcome: 'Welcome',
    registerSubtitle: 'Create your account to continue',
    loginSubtitle: 'Sign in to your account to continue',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    login: 'Sign in',
    register: 'Sign up',
    continueWithGoogle: 'Continue with Google',
    hasAccount: 'Have an account?',
    noAccount: 'No account?',
    loginSuccess: 'Signed in',
    loginFailed: 'Failed to sign in',
    registerSuccess: 'Registration complete',
    registerFailed: 'Failed to sign up',
    usernameTooShort: 'Username is too short',
    usernameTooLong: 'Username is too long',
    invalidEmail: 'Invalid email format',
    passwordTooShort: 'Password is too short',
    passwordTooLong: 'Password is too long'
  },

  profile: {
    userBadge: 'Ubuyashiki user',
    title: 'Profile',
    description: 'Personal profile and account information.',
    username: 'Username',
    email: 'Email',
    edit: 'Edit profile',
    logout: 'Log out',
    notFound: 'Profile not found',
    notFoundDescription: 'Check the username or return to the home page.',
    loggedOut: 'You have logged out',
    edit_: {
      unavailable: 'Editing unavailable',
      title: 'Edit profile',
      description: 'Adjust your images and account details.',
      appearance: 'Profile appearance',
      bannerPreview: 'Banner preview',
      avatarPreview: 'Avatar preview',
      avatar: 'Avatar',
      banner: 'Banner',
      email: 'Email',
      emailLabel: 'Email',
      changePassword: 'Change password',
      changePasswordHint: 'Leave the new fields empty if you don’t want to change the password.',
      currentPassword: 'Current password',
      newPassword: 'New password',
      confirmPassword: 'Repeat new password',
      newPasswordTooShort: 'The new password must be at least 6 characters',
      passwordsDontMatch: 'New passwords don’t match',
      enterCurrentPassword: 'Enter your current password',
      updated: 'Profile updated',
      updateFailed: 'Failed to update the profile'
    }
  },

  settings: {
    title: 'Settings',
    description: 'Customize the appearance of the whole app.',
    modeTitle: 'Appearance mode',
    modeDescription: 'Choose a light or dark background.',
    light: 'Light',
    dark: 'Dark',
    darkEnabled: 'Dark theme enabled',
    lightEnabled: 'Light theme enabled',
    accentTitle: 'Anime accent',
    accentDescription: 'The color applies to all buttons, highlights and active elements.',
    accentEnabled: '{name} anime theme enabled',
    accent: {
      neutral: 'Neutral',
      purple: 'Purple',
      blue: 'Blue',
      pink: 'Pink'
    }
  },

  notFound: {
    page: 'Page not found',
    anime: 'Content page not found'
  }
};
