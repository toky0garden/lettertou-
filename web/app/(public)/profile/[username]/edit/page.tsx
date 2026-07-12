'use client';

import { motion } from 'framer-motion';
import { ImageIcon, Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ROUTES } from '@/app/(constants)';
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@/components/ui';
import { useConfig } from '@/hooks/useConfig';
import { updateProfile, uploadProfileImage } from '@/utils/api/request';

function useFilePreview(file: File | null) {
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!file) return setPreview('');
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return preview;
}

export default function EditProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const [config, setConfig] = useConfig();
  const [email, setEmail] = useState(config.user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const avatarPreview = useFilePreview(avatar);
  const bannerPreview = useFilePreview(banner);

  if (!config.user || config.user.username.toLowerCase() !== username.toLowerCase()) {
    return <main className='container-wrapper min-h-screen px-4 pt-28 text-center'>Редактирование недоступно</main>;
  }
  const currentUser = config.user;
  const fallback = currentUser.username.charAt(0).toUpperCase();

  const handleSave = async () => {
    if (newPassword && newPassword.length < 6) return toast.error('Новый пароль должен содержать минимум 6 символов');
    if (newPassword !== confirmPassword) return toast.error('Новые пароли не совпадают');
    if ((email !== currentUser.email || newPassword) && !currentPassword) return toast.error('Введите текущий пароль');

    setIsSaving(true);
    try {
      let user = currentUser;
      if (email !== currentUser.email || newPassword) {
        user = (await updateProfile({ params: { email, current_password: currentPassword, new_password: newPassword || undefined } })).data;
      }
      if (avatar) user = (await uploadProfileImage('avatar', avatar)).data;
      if (banner) user = (await uploadProfileImage('banner', banner)).data;
      setConfig({ authenticated: true, user });
      toast.success('Профиль обновлён');
      router.push(ROUTES.PROFILE(user.username));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось обновить профиль');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className='container-wrapper min-h-screen px-4 pt-24 pb-16 sm:px-6'>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card className='mx-auto w-full max-w-2xl'>
          <CardHeader>
            <CardTitle>Редактирование профиля</CardTitle>
            <CardDescription>Настройте изображения и данные аккаунта.</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-7'>
            <section className='flex flex-col gap-4'>
              <h2 className='font-medium'>Оформление профиля</h2>
              <div className='relative h-32 overflow-hidden rounded-xl border bg-muted'>
                {(bannerPreview || currentUser.banner) ? <img src={bannerPreview || currentUser.banner} alt='Предпросмотр баннера' className='size-full object-cover' /> : <div className='text-muted-foreground flex size-full items-center justify-center'><ImageIcon /></div>}
                <Avatar className='absolute bottom-3 left-4 size-20 ring-4 ring-background'>
                  {(avatarPreview || currentUser.avatar) && <AvatarImage src={avatarPreview || currentUser.avatar} alt='Предпросмотр аватара' />}
                  <AvatarFallback className='text-xl'>{fallback}</AvatarFallback>
                </Avatar>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'><Label htmlFor='avatar'>Аватар</Label><Input id='avatar' type='file' accept='image/jpeg,image/png,image/webp' onChange={(e) => setAvatar(e.target.files?.[0] || null)} /></div>
                <div className='flex flex-col gap-2'><Label htmlFor='banner'>Баннер</Label><Input id='banner' type='file' accept='image/jpeg,image/png,image/webp' onChange={(e) => setBanner(e.target.files?.[0] || null)} /></div>
              </div>
            </section>

            <section className='flex flex-col gap-4 border-t pt-6'>
              <h2 className='font-medium'>Почта</h2>
              <div className='flex flex-col gap-2'><Label htmlFor='email'>Электронная почта</Label><Input id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            </section>

            <section className='flex flex-col gap-4 border-t pt-6'>
              <div><h2 className='font-medium'>Смена пароля</h2><p className='text-muted-foreground text-sm'>Оставьте новые поля пустыми, если пароль менять не нужно.</p></div>
              <div className='flex flex-col gap-2'><Label htmlFor='current-password'>Текущий пароль</Label><Input id='current-password' type='password' autoComplete='current-password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'><Label htmlFor='new-password'>Новый пароль</Label><Input id='new-password' type='password' autoComplete='new-password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                <div className='flex flex-col gap-2'><Label htmlFor='confirm-password'>Повторите новый пароль</Label><Input id='confirm-password' type='password' autoComplete='new-password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} aria-invalid={Boolean(confirmPassword && newPassword !== confirmPassword)} /></div>
              </div>
            </section>

            <Button size='sm' className='self-start' onClick={handleSave} disabled={isSaving}>
              <Save data-icon='inline-start' /> {isSaving ? 'Сохранение…' : 'Сохранить'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
