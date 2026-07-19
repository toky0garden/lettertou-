/**
 * Russian dictionary — the source language of the application (see <html lang="ru">).
 *
 * Strings are grouped by domain so a feature owns a single namespace. Access as
 * `dictionaries.ru.home.popular.title`. The English dictionary mirrors this shape
 * exactly; keeping the structures identical is what makes the `Dictionary` type
 * (derived from this file) catch missing translations at build time.
 */
export const ru = {
  common: {
    brand: 'Ubuyashiki',
    watch: 'Смотреть',
    details: 'Подробнее',
    collapse: 'Свернуть',
    showMore: 'Показать ещё',
    showAll: 'Смотреть все',
    loading: 'Загрузка...',
    open: 'Открыть',
    back: 'Назад',
    toHome: 'На главную',
    backToHome: 'Вернуться на главную',
    noPoster: 'Нет постера',
    save: 'Сохранить',
    saving: 'Сохранение…'
  },

  header: {
    account: 'Аккаунт',
    catalog: 'Каталог',
    search: 'Поиск',
    navigation: 'Навигация',
    navigationHint: 'Куда дальше? Выбирайте',
    openMenu: 'Открыть меню',
    searchPlaceholder: 'Найти аниме…',
    quickSearchAria: 'Быстрый поиск аниме',
    clearSearch: 'Очистить поиск',
    quickSearchTitle: 'Быстрый поиск по каталогу',
    minThreeChars: 'Введите минимум три символа',
    nothingFound: 'Ничего не найдено',
    tryAnotherSpelling: 'Попробуйте другое написание названия',
    allResults: 'Все результаты'
  },

  home: {
    hero: {
      watch: 'Смотреть',
      details: 'Подробнее'
    },
    continueWatching: {
      title: 'Продолжить просмотр',
      description: 'Вернись к тому, что не досмотрел',
      episode: '{count} эпизод',
      removeFromHistory: 'Убрать из истории'
    },
    popular: {
      title: 'Популярное',
      description: 'То, что сейчас смотрят чаще всего'
    },
    updates: {
      title: 'Новинки',
      description: 'Свежие серии и недавно добавленные тайтлы'
    },
    genres: {
      title: 'Жанры',
      description: 'Выбери настроение и открой новую историю',
      link: 'Все жанры'
    }
  },

  catalog: {
    directions: '{count} направлений',
    heroTitle: 'Найди историю по настроению',
    heroDescription:
      'От лёгкой романтики до мрачных психологических драм — выбери жанр и открой новую историю.',
    allGenres: 'Все жанры',
    allGenresHint: 'Выбирай то, что хочется посмотреть сегодня',
    titlesCount: '{count} тайтлов',
    emptyList: 'Список пока пуст'
  },

  genre: {
    label: 'Жанр',
    metaTitle: '{title} — аниме по жанру',
    metaDescription: 'Подборка аниме в жанре «{title}».',
    selectionIn: 'Подборка аниме в жанре «{title}».',
    backToGenres: '← Вернуться ко всем жанрам',
    animeInGenre: 'Аниме в жанре',
    sortedByRating: 'Отсортировано по рейтингу Shikimori',
    loadFailed: 'Не удалось загрузить список',
    tryLater: 'Попробуйте обновить страницу чуть позже.',
    empty: 'Пока пусто',
    emptyDescription: 'В этом жанре ещё нет тайтлов.'
  },

  anime: {
    watch: 'Смотреть',
    favorite: 'Избранное',
    share: 'Поделиться',
    linkCopied: 'Ссылка скопирована',
    linkCopyFailed: 'Не удалось скопировать ссылку',
    ageRating: 'Возрастное ограничение',
    studio: 'Студия',
    status: 'Статус',
    year: 'Год выхода',
    type: 'Тип',
    country: 'Страна',
    episodeDuration: 'Продолжительность эпизода',
    minutes: '{count} мин.',
    frames: 'Кадры',
    framesCount: '{count} фото',
    player: 'Плеер',
    reviews: 'Отзывы',
    inProgress: 'В процессе',
    noTitle: 'Без названия'
  },

  frame: {
    open: 'Открыть',
    openFrame: 'Открыть кадр {index} из {total}',
    frame: 'Кадр {index}',
    framesFromAnime: 'Кадры из аниме {title}',
    useArrows: 'Используйте стрелки для переключения между кадрами',
    frameFromAnime: 'Кадр {index} из аниме {title}',
    previous: 'Предыдущий кадр',
    next: 'Следующий кадр',
    close: 'Закрыть просмотр кадра',
    counter: 'Кадр {index} из {total}'
  },

  player: {
    unavailable: 'Плеер недоступен',
    authRequired: 'Авторизируйтесь для просмотра',
    dataLoadFailed: 'Не удалось загрузить данные плеера, попробуйте позже',
    urlNotFound: 'URL для озвучки не найден, попробуйте выбрать другую',
    loadError: 'Ошибка загрузки плеера',
    refreshHint: 'Попробуйте обновить страницу',
    title: 'Плеер',
    selectTranslation: 'Выбрать озвучку',
    episode: '{count} эпизод',
    season: '{count} сезон'
  },

  search: {
    catalogKodik: 'Каталог Kodik',
    findNextWatch: 'Найдите аниме для следующего просмотра',
    searchHint: 'Ищите по русскому, английскому или оригинальному названию.',
    advancedSearch: 'Расширенный поиск',
    advancedSearchHint: 'Введите название — покажем до 20 наиболее подходящих тайтлов.',
    placeholder: 'Например, Баскетбол Куроко',
    animeTitleAria: 'Название аниме',
    find: 'Найти',
    results: 'Результаты',
    searching: 'Ищем совпадения…',
    found: 'Найдено: {count}',
    noMatches: 'Совпадений не найдено',
    startWithTitle: 'Начните с названия тайтла',
    minThreeChars: 'Введите не менее 3 символов',
    searchFailed: 'Не удалось выполнить поиск',
    tryAnotherTitle: 'Попробуйте другое название',
    resultsWillAppear: 'Здесь появятся результаты',
    checkSpelling: 'Проверьте написание или используйте оригинальное название аниме.',
    enterThreeChars: 'Введите минимум три символа в строку поиска выше.'
  },

  auth: {
    welcome: 'Добро пожаловать',
    registerSubtitle: 'Зарегистрируйте свой аккаунт для продолжения',
    loginSubtitle: 'Войдите в свой аккаунт для продолжения',
    username: 'Имя пользователя',
    email: 'Почта',
    password: 'Пароль',
    login: 'Войти',
    register: 'Зарегистрироваться',
    continueWithGoogle: 'Продолжить с помощью Google',
    hasAccount: 'Есть аккаунт?',
    noAccount: 'Нету аккаунта?',
    loginSuccess: 'Вход выполнен',
    loginFailed: 'Не удалось войти',
    registerSuccess: 'Регистрация завершена',
    registerFailed: 'Не удалось зарегистрироваться',
    usernameTooShort: 'Имя пользователя слишком короткое',
    usernameTooLong: 'Имя пользователя слишком длинное',
    invalidEmail: 'Неверный формат почты',
    passwordTooShort: 'Пароль слишком короткий',
    passwordTooLong: 'Пароль слишком длинный'
  },

  profile: {
    userBadge: 'Пользователь Ubuyashiki',
    title: 'Профиль',
    description: 'Личный профиль и информация об аккаунте.',
    username: 'Имя пользователя',
    email: 'Электронная почта',
    edit: 'Редактировать профиль',
    logout: 'Выйти из аккаунта',
    notFound: 'Профиль не найден',
    notFoundDescription: 'Проверьте имя пользователя или вернитесь на главную.',
    loggedOut: 'Вы вышли из аккаунта',
    edit_: {
      unavailable: 'Редактирование недоступно',
      title: 'Редактирование профиля',
      description: 'Настройте изображения и данные аккаунта.',
      appearance: 'Оформление профиля',
      bannerPreview: 'Предпросмотр баннера',
      avatarPreview: 'Предпросмотр аватара',
      avatar: 'Аватар',
      banner: 'Баннер',
      email: 'Почта',
      emailLabel: 'Электронная почта',
      changePassword: 'Смена пароля',
      changePasswordHint: 'Оставьте новые поля пустыми, если пароль менять не нужно.',
      currentPassword: 'Текущий пароль',
      newPassword: 'Новый пароль',
      confirmPassword: 'Повторите новый пароль',
      newPasswordTooShort: 'Новый пароль должен содержать минимум 6 символов',
      passwordsDontMatch: 'Новые пароли не совпадают',
      enterCurrentPassword: 'Введите текущий пароль',
      updated: 'Профиль обновлён',
      updateFailed: 'Не удалось обновить профиль'
    }
  },

  settings: {
    title: 'Настройки',
    description: 'Настройте внешний вид всего приложения.',
    modeTitle: 'Режим оформления',
    modeDescription: 'Выберите светлый или тёмный фон.',
    light: 'Светлая',
    dark: 'Тёмная',
    darkEnabled: 'Тёмная тема включена',
    lightEnabled: 'Светлая тема включена',
    accentTitle: 'Anime-акцент',
    accentDescription:
      'Цвет применяется ко всем кнопкам, выделениям и активным элементам.',
    accentEnabled: '{name} anime-тема включена',
    accent: {
      neutral: 'Нейтральная',
      purple: 'Фиолетовая',
      blue: 'Синяя',
      pink: 'Розовая'
    }
  },

  notFound: {
    page: 'Страница не найдена',
    anime: 'Страница с материалом не найдена'
  }
} as const;
