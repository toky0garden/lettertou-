export const genres = [
  { title: 'Экшен', slug: 'экшен', image: '/catalog/action.png' },
  { title: 'Приключения', slug: 'приключения', image: '/catalog/adventure.png' },
  { title: 'Комедия', slug: 'комедия', image: '/catalog/comedy.png' },
  { title: 'Детектив', slug: 'детектив', image: '/catalog/detective.png' },
  { title: 'Драма', slug: 'драма', image: '/catalog/drama.png' },
  { title: 'Повседневность', slug: 'повседневность', image: '/catalog/everydaylife.png' },
  { title: 'Фантастика', slug: 'фантастика', image: '/catalog/fantastic.png' },
  { title: 'Фэнтези', slug: 'фэнтези', image: '/catalog/fantasy.png' },
  { title: 'Гарем', slug: 'гарем', image: '/catalog/harem.png' },
  { title: 'Историческое', slug: 'исторический', image: '/catalog/history.jpg' },
  { title: 'Ужасы', slug: 'ужасы', image: '/catalog/horror.png' },
  { title: 'Исекай', slug: 'исекай', image: '/catalog/isekai.png' },
  { title: 'Боевые искусства', slug: 'боевые искусства', image: '/catalog/martial_arts.jpg' },
  { title: 'Меха', slug: 'меха', image: '/catalog/meha.png' },
  { title: 'Военное', slug: 'военное', image: '/catalog/military.jpg' },
  { title: 'Музыка', slug: 'музыка', image: '/catalog/music.png' },
  { title: 'Психологическое', slug: 'психологическое', image: '/catalog/psychological.png' },
  { title: 'Реинкарнация', slug: 'реинкарнация', image: '/catalog/reincarnation.png' },
  { title: 'Романтика', slug: 'романтика', image: '/catalog/romance.png' },
  { title: 'Школа', slug: 'школа', image: '/catalog/school.png' },
  { title: 'Тайна', slug: 'тайна', image: '/catalog/secret.jpg' },
  { title: 'Сёдзё', slug: 'сёдзё', image: '/catalog/sedze.png' },
  { title: 'Сёнэн', slug: 'сёнэн', image: '/catalog/shounen.png' },
  { title: 'Спорт', slug: 'спорт', image: '/catalog/sport.png' },
  { title: 'Сверхъестественное', slug: 'сверхъестественное', image: '/catalog/supernatural.png' },
  { title: 'Триллер', slug: 'триллер', image: '/catalog/thriller.png' },
  { title: 'Вампиры', slug: 'вампиры', image: '/catalog/vamp.png' }
] as const;

export function getGenreBySlug(slug: string) {
  return genres.find(
    (genre) => genre.slug.toLocaleLowerCase('ru') === slug.toLocaleLowerCase('ru')
  );
}
