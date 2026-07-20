'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Camera,
  Eye,
  EyeOff,
  ImagePlus,
  KeyRound,
  Loader2,
  Mail,
  RotateCcw,
  Save
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ROUTES } from '@/app/(constants)';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label
} from '@/components/ui';
import { useConfig } from '@/hooks/useConfig';
import { patchProfileMe, postProfileMeByImageType } from '@/shared/api';
import type {
  BodyUploadProfileImageProfileMeImageTypePost,
  UserSchema
} from '@/shared/api/types.gen';

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp';

// The upload endpoint expects multipart/form-data, so build a FormData body.
// The generated request type models the field as a plain object; cast through it.
const uploadImage = (imageType: 'avatar' | 'banner', image: File) => {
  const formData = new FormData();
  formData.append('image', image);
  return postProfileMeByImageType({
    path: { image_type: imageType },
    body: formData as unknown as BodyUploadProfileImageProfileMeImageTypePost
  });
};

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

interface PasswordFieldProps {
  autoComplete: string;
  id: string;
  label: string;
  value: string;
  invalid?: boolean;
  onChange: (value: string) => void;
}

function PasswordField({ autoComplete, id, invalid, label, value, onChange }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className='flex flex-col gap-2'>
      <Label htmlFor={id}>{label}</Label>
      <div className='relative'>
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          aria-invalid={invalid || undefined}
          className='pr-10'
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type='button'
          tabIndex={-1}
          aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
          className='text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center transition-colors'
          onClick={() => setVisible((prev) => !prev)}
        >
          {visible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
        </button>
      </div>
    </div>
  );
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
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarPreview = useFilePreview(avatar);
  const bannerPreview = useFilePreview(banner);

  if (!config.user || config.user.username.toLowerCase() !== username.toLowerCase()) {
    return (
      <main className='container-wrapper flex min-h-screen items-center justify-center px-4'>
        <Card className='w-full max-w-md text-center'>
          <CardHeader>
            <CardTitle>Редактирование недоступно</CardTitle>
            <CardDescription>Настройки может изменять только владелец профиля.</CardDescription>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <Button onClick={() => router.push(ROUTES.ROOT)}>На главную</Button>
          </CardContent>
        </Card>
      </main>
    );
  }
  const currentUser = config.user;
  const fallback = currentUser.username.charAt(0).toUpperCase();

  const emailChanged = email.trim() !== currentUser.email;
  const hasChanges = emailChanged || Boolean(avatar) || Boolean(banner) || Boolean(newPassword);
  const isDirty = hasChanges || Boolean(currentPassword) || Boolean(confirmPassword);
  const passwordTooShort = Boolean(newPassword && newPassword.length < 6);
  const passwordsMismatch = Boolean(confirmPassword && newPassword !== confirmPassword);

  const handleReset = () => {
    setEmail(currentUser.email);
    setAvatar(null);
    setBanner(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSave = async () => {
    if (!hasChanges) return toast.info('Нет изменений для сохранения');
    if (passwordTooShort) return toast.error('Новый пароль должен содержать минимум 6 символов');
    if (newPassword !== confirmPassword) return toast.error('Новые пароли не совпадают');
    if ((emailChanged || newPassword) && !currentPassword)
      return toast.error('Введите текущий пароль');

    setIsSaving(true);
    try {
      let user = currentUser;
      if (emailChanged || newPassword) {
        user = (
          await patchProfileMe({
            body: {
              email: email.trim(),
              current_password: currentPassword,
              new_password: newPassword || undefined
            }
          })
        ).data as UserSchema;
      }
      if (avatar) user = (await uploadImage('avatar', avatar)).data as UserSchema;
      if (banner) user = (await uploadImage('banner', banner)).data as UserSchema;
      setConfig({ authenticated: true, user });
      toast.success('Профиль обновлён');
      router.push(ROUTES.PROFILE(user.username));
    } catch (error) {
      const message =
        error instanceof Error && error.message !== 'Failed to fetch'
          ? error.message
          : 'Не удалось обновить профиль';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className='container-wrapper min-h-screen px-4 pt-24 pb-32 sm:px-6'>
      <motion.form
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='mx-auto flex w-full max-w-2xl flex-col gap-6'
        onSubmit={(event) => {
          event.preventDefault();
          handleSave();
        }}
      >
        <header className='flex flex-col gap-1.5'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-muted-foreground -ml-2 self-start'
            onClick={() => router.push(ROUTES.PROFILE(currentUser.username))}
          >
            <ArrowLeft data-icon='inline-start' /> {currentUser.username}
          </Button>
          <h1 className='text-2xl font-semibold tracking-tight'>Настройки</h1>
          <p className='text-muted-foreground text-sm'>
            Оформление профиля, почта и безопасность аккаунта.
          </p>
        </header>

        <Card className='gap-0 overflow-hidden py-0'>
          <button
            type='button'
            aria-label='Изменить баннер'
            className='focus-visible:ring-ring/50 group relative block h-36 w-full cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-inset sm:h-44'
            onClick={() => bannerInputRef.current?.click()}
          >
            {bannerPreview || currentUser.banner ? (
              <img
                src={bannerPreview || currentUser.banner}
                alt=''
                className='size-full object-cover'
              />
            ) : (
              <div className='from-primary/25 via-primary/10 to-muted size-full bg-gradient-to-br' />
            )}
            <span className='absolute inset-0 flex items-center justify-center gap-2 bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
              <ImagePlus className='size-4' />
              <span className='text-sm font-medium'>Изменить баннер</span>
            </span>
          </button>
          <CardContent className='flex flex-col gap-4 pb-6'>
            <div className='-mt-12 flex flex-wrap items-end justify-between gap-3'>
              <button
                type='button'
                aria-label='Изменить аватар'
                className='focus-visible:ring-ring/50 group relative shrink-0 cursor-pointer rounded-full outline-none focus-visible:ring-3'
                onClick={() => avatarInputRef.current?.click()}
              >
                <Avatar className='ring-card size-24 ring-4'>
                  {(avatarPreview || currentUser.avatar) && (
                    <AvatarImage src={avatarPreview || currentUser.avatar} alt='' />
                  )}
                  <AvatarFallback className='text-2xl'>{fallback}</AvatarFallback>
                </Avatar>
                <span className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
                  <Camera className='size-5 text-white' />
                </span>
              </button>
              {(avatar || banner) && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground'
                  onClick={() => {
                    setAvatar(null);
                    setBanner(null);
                  }}
                >
                  <RotateCcw data-icon='inline-start' /> Сбросить изображения
                </Button>
              )}
            </div>
            <div className='flex flex-col gap-1'>
              <p className='leading-none font-semibold'>{currentUser.username}</p>
              <p className='text-muted-foreground text-sm'>
                Нажмите на аватар или баннер, чтобы загрузить новое изображение. JPG, PNG или
                WebP.
              </p>
            </div>
          </CardContent>
          <input
            ref={avatarInputRef}
            type='file'
            accept={ACCEPTED_IMAGE_TYPES}
            className='hidden'
            onChange={(event) => {
              setAvatar(event.target.files?.[0] || null);
              event.target.value = '';
            }}
          />
          <input
            ref={bannerInputRef}
            type='file'
            accept={ACCEPTED_IMAGE_TYPES}
            className='hidden'
            onChange={(event) => {
              setBanner(event.target.files?.[0] || null);
              event.target.value = '';
            }}
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Mail className='text-muted-foreground size-4' /> Почта
            </CardTitle>
            <CardDescription>Используется для входа в аккаунт.</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <Label htmlFor='email'>Электронная почта</Label>
            <Input
              id='email'
              type='email'
              autoComplete='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {emailChanged && (
              <p className='text-muted-foreground text-xs'>
                Для смены почты потребуется текущий пароль.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <KeyRound className='text-muted-foreground size-4' /> Безопасность
            </CardTitle>
            <CardDescription>
              Смена пароля. Оставьте поля пустыми, если менять его не нужно.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <PasswordField
              id='current-password'
              label='Текущий пароль'
              autoComplete='current-password'
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <div className='grid gap-4 sm:grid-cols-2'>
              <PasswordField
                id='new-password'
                label='Новый пароль'
                autoComplete='new-password'
                value={newPassword}
                invalid={passwordTooShort}
                onChange={setNewPassword}
              />
              <PasswordField
                id='confirm-password'
                label='Повторите пароль'
                autoComplete='new-password'
                value={confirmPassword}
                invalid={passwordsMismatch}
                onChange={setConfirmPassword}
              />
            </div>
            {passwordTooShort || passwordsMismatch ? (
              <p className='text-destructive text-xs'>
                {passwordTooShort
                  ? 'Пароль должен содержать минимум 6 символов.'
                  : 'Пароли не совпадают.'}
              </p>
            ) : (
              <p className='text-muted-foreground text-xs'>
                Минимум 6 символов. Для смены пароля укажите текущий.
              </p>
            )}
          </CardContent>
        </Card>

        <AnimatePresence>
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-x-4 bottom-5 z-50 flex justify-center'
            >
              <div className='bg-card/95 flex items-center gap-2 rounded-full border py-1.5 pr-1.5 pl-4 shadow-lg backdrop-blur'>
                <span className='text-muted-foreground text-sm max-sm:hidden'>
                  Есть несохранённые изменения
                </span>
                <span className='text-muted-foreground text-sm sm:hidden'>Изменения</span>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  disabled={isSaving}
                  onClick={handleReset}
                >
                  Отменить
                </Button>
                <Button
                  type='submit'
                  size='sm'
                  disabled={isSaving || passwordTooShort || passwordsMismatch}
                >
                  {isSaving ? (
                    <Loader2 className='animate-spin' data-icon='inline-start' />
                  ) : (
                    <Save data-icon='inline-start' />
                  )}
                  {isSaving ? 'Сохранение…' : 'Сохранить'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </main>
  );
}
