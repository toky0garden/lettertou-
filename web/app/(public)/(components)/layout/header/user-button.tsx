'use client';

import { Menu } from '@base-ui/react/menu';
import { LogOut, Settings, User, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ROUTES } from '@/app/(constants)';
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { useConfig } from '@/hooks/useConfig';
import { getAuthMe, postAuthLogout } from '@/shared/api';
import type { UserSchema } from '@/shared/api/types.gen';

const itemClassName =
  'data-highlighted:bg-accent data-highlighted:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none [&_svg]:size-4';

export function UserButton() {
  const [config, setConfig] = useConfig();
  const router = useRouter();

  useEffect(() => {
    if (!config.authenticated || config.user) return;
    getAuthMe()
      .then((response) =>
        setConfig({ authenticated: true, user: response.data as UserSchema })
      )
      .catch(() => setConfig({ authenticated: false, user: null }));
  }, [config.authenticated, config.user, setConfig]);

  if (!config.authenticated || !config.user) {
    return (
      <Button nativeButton={false} render={<Link href={ROUTES.LOGIN} />} size='icon' variant='ghost' aria-label='Войти'>
        <User />
      </Button>
    );
  }

  const user = config.user;
  const fallback = user.username.trim().charAt(0).toUpperCase() || '?';

  const logout = async () => {
    try {
      await postAuthLogout();
    } finally {
      setConfig({ authenticated: false, user: null });
      router.push(ROUTES.LOGIN);
      toast.success('Вы вышли из аккаунта');
    }
  };

  return (
    <Menu.Root>
      <Menu.Trigger render={<Button size='icon' variant='ghost' aria-label={`Меню ${user.username}`} />}>
        <Avatar size='sm'>
          {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side='bottom' align='end' sideOffset={6}>
          <Menu.Popup className='bg-popover text-popover-foreground min-w-44 origin-top-right rounded-lg border p-1.5 shadow-lg outline-none transition duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0'>
            <div className='border-b px-2.5 py-2'>
              <p className='text-sm font-medium'>{user.username}</p>
              <p className='text-muted-foreground max-w-40 truncate text-xs'>{user.email}</p>
            </div>
            <Menu.Group className='py-1'>
              <Menu.Item className={itemClassName} onClick={() => router.push(ROUTES.PROFILE(user.username))}>
                <UserRound /> Профиль
              </Menu.Item>
              <Menu.Item className={itemClassName} onClick={() => router.push(ROUTES.SETTINGS)}>
                <Settings /> Настройки
              </Menu.Item>
            </Menu.Group>
            <Menu.Item className={`${itemClassName} text-destructive border-t`} onClick={logout}>
              <LogOut /> Выйти
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
