'use client';

import type { PlayerResponse, PlayerTranslationResponse } from '@/generated';
import { useEffect, useMemo, useState } from 'react';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { useGetAnimeTranslation } from '@/utils/api/hooks';
import { EpisodeSelector, KodikPlayer, TranslationSelector } from '.';

interface PlayerProps {
  slug: string;
  title: string;
  poster: string | null;
  player: PlayerResponse;
}

export function Player({ slug, title, poster, player }: PlayerProps) {
  const shikiId = player.shikimori_id;
  const translations = player.translations;
  const defaultTranslation = translations.at(0);

  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [selectedTranslation, setSelectedTranslation] = useState<PlayerTranslationResponse | null>(
    defaultTranslation ?? null
  );

  const { upsert } = useWatchHistory();

  const canSelect = Boolean(shikiId && selectedTranslation);

  const { data } = useGetAnimeTranslation(
    {
      shikiId: shikiId ?? 0,
      translationId: selectedTranslation?.id ?? 0
    },
    { options: { enabled: canSelect } }
  );

  const episodes = useMemo(() => {
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data.map((item) => item.episode);
    }
    if (selectedTranslation?.episodes_count) {
      return Array.from({ length: selectedTranslation.episodes_count }, (_, i) => i + 1);
    }
    return [1];
  }, [data?.data, selectedTranslation?.episodes_count]);

  const selectedEpisodeData = useMemo(() => {
    if (data?.data && Array.isArray(data.data)) {
      return data.data.find((item) => item.episode === selectedEpisode);
    }
    return null;
  }, [data?.data, selectedEpisode]);

  // Fall back to the direct iframe url when there is no shikimori id
  // (per-translation episode links are unavailable without it).
  const iframeUrl = canSelect ? selectedEpisodeData?.link : player.iframe_url;

  // Remember progress for the "Продолжить просмотр" section on the home page.
  useEffect(() => {
    if (!iframeUrl) return;
    upsert({ slug, title, poster, episode: selectedEpisode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeUrl, slug, selectedEpisode]);

  if (!canSelect) {
    return (
      <div className='flex w-full flex-col'>
        <KodikPlayer
          className='aspect-video rounded-md'
          iframeUrl={player.iframe_url}
          hide_selectors={false}
        />
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col'>
      <KodikPlayer
        className='aspect-video rounded-md'
        iframeUrl={iframeUrl}
        episode={selectedEpisode}
        hide_selectors={true}
        translation={selectedTranslation!.id}
        onNextEpisode={() => {
          if (episodes.includes(selectedEpisode + 1)) setSelectedEpisode(selectedEpisode + 1);
        }}
      />

      <div className='mt-5 flex w-full flex-col gap-3'>
        <TranslationSelector
          title={title}
          selectedEpisode={selectedEpisode}
          selectedTranslation={selectedTranslation!}
          setSelectedTranslation={(translation) => {
            setSelectedTranslation(translation);
            setSelectedEpisode(1);
          }}
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
