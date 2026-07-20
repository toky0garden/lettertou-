import { apicraft } from '@siberiacancode/apicraft';

export default apicraft([
  {
    input: './openapi.json',
    output: './src/shared/api/generated',
    instance: 'fetches',
    nameBy: 'path',
    groupBy: 'tags',
    plugins: ['tanstack']
  }
]);
