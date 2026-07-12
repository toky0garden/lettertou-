'use client';

import { Moon, Palette, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTheme } from '@/app/(contexts)';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export default function SettingsPage() {
  const theme = useTheme();

  const selectMode = (mode: 'light' | 'dark') => {
    theme.setMode(mode);
    toast.success(mode === 'dark' ? 'Тёмная тема включена' : 'Светлая тема включена');
  };

  const selectAccent = (accent: 'neutral' | 'purple' | 'blue' | 'pink') => {
    theme.setAccent(accent);
    const names = {
      neutral: 'Нейтральная',
      purple: 'Фиолетовая',
      blue: 'Синяя',
      pink: 'Розовая'
    } as const;
    toast.success(`${names[accent]} anime-тема включена`);
  };

  return (
    <main className='container-wrapper min-h-screen px-4 pt-28 pb-16 sm:px-6'>
      <motion.div className='mx-auto flex w-full max-w-3xl flex-col gap-5' initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div>
          <h1 className='text-3xl font-semibold'>Настройки</h1>
          <p className='text-muted-foreground'>Настройте внешний вид всего приложения.</p>
        </div>

        <Card className='border-primary/20 bg-card/90'>
          <CardHeader>
            <CardTitle>Режим оформления</CardTitle>
            <CardDescription>Выберите светлый или тёмный фон.</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-wrap gap-2'>
            <Button size='sm' variant={theme.mode === 'light' ? 'default' : 'outline'} onClick={() => selectMode('light')}>
              <Sun data-icon='inline-start' /> Светлая
            </Button>
            <Button size='sm' variant={theme.mode === 'dark' ? 'default' : 'outline'} onClick={() => selectMode('dark')}>
              <Moon data-icon='inline-start' /> Тёмная
            </Button>
          </CardContent>
        </Card>

        <Card className='border-primary/20 bg-card/90'>
          <CardHeader>
            <CardTitle>Anime-акцент</CardTitle>
            <CardDescription>Цвет применяется ко всем кнопкам, выделениям и активным элементам.</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-wrap gap-2'>
            <Button size='sm' variant={theme.accent === 'neutral' ? 'default' : 'outline'} onClick={() => selectAccent('neutral')}>
              <Palette data-icon='inline-start' /> Нейтральная
            </Button>
            <Button size='sm' variant={theme.accent === 'purple' ? 'default' : 'outline'} onClick={() => selectAccent('purple')}>
              <Palette data-icon='inline-start' /> Фиолетовая
            </Button>
            <Button size='sm' variant={theme.accent === 'blue' ? 'default' : 'outline'} onClick={() => selectAccent('blue')}>
              <Palette data-icon='inline-start' /> Синяя
            </Button>
            <Button size='sm' variant={theme.accent === 'pink' ? 'default' : 'outline'} onClick={() => selectAccent('pink')}>
              <Palette data-icon='inline-start' /> Розовая
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
