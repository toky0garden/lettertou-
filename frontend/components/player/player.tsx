'use client';

import type { TranslationResponse } from 'generated';
import { useMemo, useState } from 'react';
import { useGetAnimeTranslation } from '@/utils/api/hooks';
import { EpisodeSelector, KodikPlayer, TranslationSelector } from '.';

interface PlayerProps {
  shikiId: number;
  translations: TranslationResponse[];
  title: string;
}

export function Player({ shikiId, translations, title }: PlayerProps) {
  const defaultTranslation = translations.at(0) as TranslationResponse;
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [selectedTranslation, setSelectedTranslation] =
    useState<TranslationResponse>(defaultTranslation);

  const { data } = useGetAnimeTranslation({
    shikiId,
    translationId: selectedTranslation.id
  });

  const episodes = useMemo(() => {
    if (data?.data && Array.isArray(data.data)) {
      return data.data.map((item) => item.episode);
    }
    if (selectedTranslation.episodes_count) {
      return Array.from({ length: selectedTranslation.episodes_count }, (_, i) => i + 1);
    }
    return [1];
  }, [data?.data, selectedTranslation.episodes_count]);

  const selectedEpisodeData = useMemo(() => {
    if (data?.data && Array.isArray(data.data)) {
      return data.data.find((item) => item.episode === selectedEpisode);
    }
    return null;
  }, [data?.data, selectedEpisode]);

  const iframeUrl = selectedEpisodeData?.link;

  return (
    <div className='flex w-full flex-col'>
      <KodikPlayer
        className='aspect-video rounded-md'
        iframeUrl={iframeUrl}
        episode={selectedEpisode}
        hide_selectors={true}
        translation={selectedTranslation.id}
      />

      <div className='mt-5 flex w-full flex-col gap-3'>
        <TranslationSelector
          title={title}
          selectedEpisode={selectedEpisode}
          selectedTranslation={selectedTranslation}
          setSelectedTranslation={setSelectedTranslation}
          translations={translations}
        />
        <EpisodeSelector
          episodes={episodes}
          selectedEpisode={selectedEpisode}
          setSelectedEpisode={setSelectedEpisode}
        />
      </div>
    </div>
  );
}
