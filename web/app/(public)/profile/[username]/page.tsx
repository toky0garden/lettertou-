'use client';

import type { PublicUserResponse, UserResponse } from '@/generated';
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
  Skeleton
} from '@/components/ui';
import { useConfig } from '@/hooks/useConfig';
import { getProfile, postLogout } from '@/utils/api/request';

function ProfileSkeleton() {
  return (
    <Card className='mx-auto w-full max-w-3xl'>
      <CardHeader className='items-center text-center'>
        <Skeleton className='size-24 rounded-full' />
        <Skeleton className='h-7 w-40' />
        <Skeleton className='h-5 w-56' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-28 w-full rounded-lg' />
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const [config, setConfig] = useConfig();
  const [profile, setProfile] = useState<PublicUserResponse | UserResponse | null>(
    config.user?.username.toLowerCase() === username.toLowerCase() ? config.user : null
  );
  const [isLoading, setIsLoading] = useState(!profile);
  const isOwnProfile = config.user?.username.toLowerCase() === username.toLowerCase();

  useEffect(() => {
    if (profile) return;

    getProfile({ params: { username } })
      .then((response) => setProfile(response.data))
      .catch(() => toast.error('Профиль не найден'))
      .finally(() => setIsLoading(false));
  }, [profile, username]);

  const handleLogout = async () => {
    try {
      await postLogout({});
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
          <CardContent>
            <Button onClick={() => router.push(ROUTES.ROOT)}>На главную</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const fallback = profile.username.trim().charAt(0).toUpperCase() || '?';

  return (
    <main className='container-wrapper min-h-screen px-4 pt-28 pb-16 sm:px-6'>
      <Card className='mx-auto w-full max-w-3xl overflow-hidden pt-0'>
        <div className='bg-muted h-36 sm:h-48'>
          {profile.banner && (
            <img src={profile.banner} alt='' className='size-full object-cover' />
          )}
        </div>
        <CardHeader className='items-center px-6 text-center sm:px-10'>
          <Avatar className='-mt-18 size-28 ring-4 ring-background'>
            {profile.avatar && <AvatarImage src={profile.avatar} alt={profile.username} />}
            <AvatarFallback className='text-3xl'>{fallback}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col items-center gap-2'>
            <CardTitle className='text-2xl'>{profile.username}</CardTitle>
            <Badge variant='default'>Пользователь Ubuyashiki</Badge>
          </div>
          <CardDescription>Личный профиль и информация об аккаунте.</CardDescription>
        </CardHeader>

        <CardContent className='flex flex-col gap-3 px-6 sm:px-10'>
          <div className='bg-muted/50 flex items-center gap-3 rounded-lg border p-4'>
            <UserRound className='text-muted-foreground' aria-hidden='true' />
            <div className='min-w-0'>
              <p className='text-muted-foreground text-xs'>Имя пользователя</p>
              <p className='truncate font-medium'>{profile.username}</p>
            </div>
          </div>
          {'email' in profile && (
            <div className='bg-muted/50 flex items-center gap-3 rounded-lg border p-4'>
              <Mail className='text-muted-foreground' aria-hidden='true' />
              <div className='min-w-0'>
                <p className='text-muted-foreground text-xs'>Электронная почта</p>
                <p className='truncate font-medium'>{profile.email}</p>
              </div>
            </div>
          )}

          {isOwnProfile && (
            <div className='mt-3 flex flex-wrap gap-2'>
              <Button onClick={() => router.push(ROUTES.EDIT_PROFILE(profile.username))}>
                <Pencil data-icon='inline-start' /> Редактировать профиль
              </Button>
              <Button variant='outline' onClick={handleLogout}>
                <LogOut data-icon='inline-start' /> Выйти из аккаунта
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
