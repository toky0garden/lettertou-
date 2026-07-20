'use client';

import type { PublicUserSchema, UserSchema } from '@/shared/api/types.gen';
import { LogOut, Mail, Pencil, UserRound } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ROUTES } from '@/app/(constants)';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton
} from '@/components/ui';
import { useConfig } from '@/hooks/useConfig';
import { getProfileByUsername, postAuthLogout } from '@/shared/api';

function ProfileSkeleton() {
  return (
    <Card className='mx-auto w-full max-w-3xl gap-0 overflow-hidden py-0'>
      <Skeleton className='h-40 w-full rounded-none sm:h-52' />
      <CardContent className='flex flex-col gap-6 pb-8 sm:px-8'>
        <div className='-mt-14 sm:-mt-16'>
          <Skeleton className='size-28 rounded-full sm:size-32' />
        </div>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-8 w-44' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Separator />
        <div className='grid gap-3 sm:grid-cols-2'>
          <Skeleton className='h-[74px] rounded-xl' />
          <Skeleton className='h-[74px] rounded-xl' />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const [config, setConfig] = useConfig();
  const [profile, setProfile] = useState<PublicUserSchema | UserSchema | null>(
    config.user?.username.toLowerCase() === username.toLowerCase() ? config.user : null
  );
  const [isLoading, setIsLoading] = useState(!profile);
  const isOwnProfile = config.user?.username.toLowerCase() === username.toLowerCase();

  useEffect(() => {
    if (profile) return;

    getProfileByUsername({ path: { username } })
      .then((response) => setProfile(response.data as PublicUserSchema))
      .catch(() => toast.error('Профиль не найден'))
      .finally(() => setIsLoading(false));
  }, [profile, username]);

  const handleLogout = async () => {
    try {
      await postAuthLogout();
    } finally {
      setConfig({ authenticated: false, user: null });
      router.push(ROUTES.LOGIN);
      toast.success('Вы вышли из аккаунта');
    }
  };

  if (isLoading) {
    return (
      <main className='container-wrapper min-h-screen px-4 pt-28 pb-16 sm:px-6'>
        <ProfileSkeleton />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className='container-wrapper flex min-h-screen items-center justify-center px-4'>
        <Card className='w-full max-w-md text-center'>
          <CardHeader>
            <CardTitle>Профиль не найден</CardTitle>
            <CardDescription>Проверьте имя пользователя или вернитесь на главную.</CardDescription>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <Button onClick={() => router.push(ROUTES.ROOT)}>На главную</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const fallback = profile.username.trim().charAt(0).toUpperCase() || '?';

  return (
    <main className='container-wrapper min-h-screen px-4 pt-28 pb-16 sm:px-6'>
      <Card className='mx-auto w-full max-w-3xl gap-0 overflow-hidden py-0'>
        <div className='bg-muted h-40 sm:h-52'>
          {profile.banner ? (
            <img src={profile.banner} alt='' className='size-full object-cover' />
          ) : (
            <div className='from-primary/25 via-primary/10 to-muted size-full bg-gradient-to-br' />
          )}
        </div>

        <CardContent className='flex flex-col gap-6 pb-8 sm:px-8'>
          <div className='-mt-14 flex flex-wrap items-end justify-between gap-3 sm:-mt-16'>
            <Avatar className='ring-card size-28 ring-4 sm:size-32'>
              {profile.avatar && <AvatarImage src={profile.avatar} alt={profile.username} />}
              <AvatarFallback className='text-3xl'>{fallback}</AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <div className='flex flex-wrap gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => router.push(ROUTES.EDIT_PROFILE(profile.username))}
                >
                  <Pencil data-icon='inline-start' /> Редактировать
                </Button>
                <Button variant='destructive' size='sm' onClick={handleLogout}>
                  <LogOut data-icon='inline-start' /> Выйти
                </Button>
              </div>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <div className='flex flex-wrap items-center gap-2.5'>
              <h1 className='text-2xl font-semibold tracking-tight'>{profile.username}</h1>
              <Badge variant='secondary'>Пользователь Ubuyashiki</Badge>
            </div>
            <p className='text-muted-foreground text-sm'>
              Личный профиль и информация об аккаунте.
            </p>
          </div>

          <Separator />

          <dl className='grid gap-3 sm:grid-cols-2'>
            <div className='bg-muted/50 flex items-center gap-3 rounded-xl border p-4'>
              <UserRound className='text-muted-foreground size-5 shrink-0' aria-hidden='true' />
              <div className='min-w-0'>
                <dt className='text-muted-foreground text-xs'>Имя пользователя</dt>
                <dd className='truncate font-medium'>{profile.username}</dd>
              </div>
            </div>
            {'email' in profile && (
              <div className='bg-muted/50 flex items-center gap-3 rounded-xl border p-4'>
                <Mail className='text-muted-foreground size-5 shrink-0' aria-hidden='true' />
                <div className='min-w-0'>
                  <dt className='text-muted-foreground text-xs'>Электронная почта</dt>
                  <dd className='truncate font-medium'>{profile.email}</dd>
                </div>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </main>
  );
}
