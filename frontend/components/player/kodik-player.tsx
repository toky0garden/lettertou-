'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface KodikMessage {
  key: string;
  value?: any;
  data?: any;
}

interface KodikPlayerProps {
  className?: string;
  iframeUrl: string; // URL для iframe от Kodik
  hide_selectors?: boolean;
  translation?: number;
  onDurationUpdate?: (duration: number) => void;
  onVideoEnd?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onVolumeChange?: (volume: number) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onError?: (error: any) => void;
  autoNextEpisode?: boolean; // Автопереход к следующему эпизоду
  onNextEpisode?: () => void; // Callback для перехода к следующему эпизоду
  season?: number;
  episode?: number;
}

export function KodikPlayer({
  className,
  iframeUrl,
  hide_selectors,
  translation,
  onDurationUpdate,
  onVideoEnd,
  onPlay,
  onPause,
  onTimeUpdate,
  onVolumeChange,
  onFullscreenChange,
  onError,
  autoNextEpisode = true,
  onNextEpisode,
  season,
  episode
}: KodikPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isError, setIsError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Обработчик сообщений от Kodik плеера
  const handleKodikMessage = useCallback(
    (message: MessageEvent<KodikMessage>) => {
      const { key, value, data } = message.data;

      switch (key) {
        case 'kodik_player_duration_update': {
          const newDuration = Number.parseInt(value || data);
          setDuration(newDuration);
          onDurationUpdate?.(newDuration);
          break;
        }

        case 'kodik_player_time_update': {
          const newTime = Number.parseInt(value || data);
          setCurrentTime(newTime);
          onTimeUpdate?.(newTime);
          break;
        }

        case 'kodik_player_play': {
          setIsPlaying(true);
          onPlay?.();
          break;
        }

        case 'kodik_player_pause': {
          setIsPlaying(false);
          onPause?.();
          break;
        }

        case 'kodik_player_volume_change': {
          const newVolume = Number.parseFloat(value || data);
          setVolume(newVolume);
          onVolumeChange?.(newVolume);
          break;
        }

        case 'kodik_player_fullscreen_change': {
          const fullscreenState = Boolean(value || data);
          setIsFullscreen(fullscreenState);
          onFullscreenChange?.(fullscreenState);
          break;
        }

        case 'kodik_player_video_ended': {
          onVideoEnd?.();

          // Автопереход к следующему эпизоду
          if (autoNextEpisode && onNextEpisode) {
            onNextEpisode();
          }
          break;
        }

        case 'kodik_player_error': {
          setIsError(true);
          const error = value || data;
          console.error('Kodik player error:', error);
          onError?.(error);
          break;
        }

        default:
          // Обработка других событий если нужно
          break;
      }
    },
    [
      onDurationUpdate,
      onVideoEnd,
      onPlay,
      onPause,
      onTimeUpdate,
      onVolumeChange,
      onFullscreenChange,
      onError,
      autoNextEpisode,
      onNextEpisode
    ]
  );

  // Установка обработчика сообщений
  useEffect(() => {
    window.addEventListener('message', handleKodikMessage);
    return () => window.removeEventListener('message', handleKodikMessage);
  }, [handleKodikMessage]);

  // Сброс состояния при изменении URL
  useEffect(() => {
    setIsError(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [iframeUrl, translation]);

  // Следим за изменением сезона/серии и отправляем postMessage
  useEffect(() => {
    if (!iframeRef.current || !episode) return;
    const message: any = {
      method: 'change_episode',
      episode
    };
    if (season) message.season = season;
    if (translation) message.translation = translation;
    iframeRef.current.contentWindow?.postMessage(message, '*');
  }, [season, episode, translation]);

  // Методы управления плеером
  const play = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ key: 'play' }, '*');
    }
  }, []);

  const pause = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ key: 'pause' }, '*');
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          key: 'seek',
          value: time
        },
        '*'
      );
    }
  }, []);

  const setVolumeLevel = useCallback((newVolume: number) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          key: 'setVolume',
          value: newVolume
        },
        '*'
      );
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          key: 'toggleFullscreen'
        },
        '*'
      );
    }
  }, []);

  const changeTranslation = useCallback((translationId: number) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          key: 'changeTranslation',
          value: translationId
        },
        '*'
      );
    }
  }, []);

  // Экспорт методов управления для родительского компонента
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).kodikPlayerControls = {
        play,
        pause,
        seekTo,
        setVolume: setVolumeLevel,
        toggleFullscreen,
        changeTranslation,
        currentTime,
        duration,
        isPlaying,
        volume,
        isFullscreen
      };
    }
  }, [
    play,
    pause,
    seekTo,
    setVolumeLevel,
    toggleFullscreen,
    changeTranslation,
    currentTime,
    duration,
    isPlaying,
    volume,
    isFullscreen
  ]);

  if (!iframeUrl) {
    return (
      <div
        className={cn(
          'bg-background flex items-center justify-center rounded-lg',
          'text-muted-foreground p-8 text-center',
          className
        )}
      >
        <div>
          <p className='mb-2 text-lg font-medium'>Плеер недоступен</p>
          <p className='text-sm'>URL для озвучки не найден, попробуйте выбрать другую</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          'bg-destructive/10 flex items-center justify-center rounded-lg',
          'text-destructive p-8 text-center',
          className
        )}
      >
        <div>
          <p className='mb-2 text-lg font-medium'>Ошибка загрузки плеера</p>
          <p className='text-sm'>Попробуйте обновить страницу</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full', className)}>
      <iframe
        ref={iframeRef}
        className={cn('w-full', className)}
        src={`${iframeUrl}?min_age_confirmation=false&hide_selectors=${hide_selectors || 'false'}`}
        title='Плеер'
        allow='autoplay *; fullscreen *'
        allowFullScreen
        frameBorder='0'
        loading='lazy'
        onError={() => {
          setIsError(true);
        }}
        sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox'
      />
    </div>
  );
}
