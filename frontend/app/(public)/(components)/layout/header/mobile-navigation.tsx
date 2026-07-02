'use client';

import { Library, Search, TableOfContents, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/app/(constants)';
import {
  buttonVariants,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui';
import { cn } from '@/lib/utils';

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navigation_buttons = cn(buttonVariants({ variant: 'default' }), 'w-40');

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        render={
          <button
            type='button'
            className='flex cursor-pointer items-center border-none bg-transparent p-0'
            aria-label='Открыть меню'
          >
            <TableOfContents size={20} />
          </button>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Навигация</SheetTitle>
          <SheetDescription>Куда дальше? Выбирайте</SheetDescription>
        </SheetHeader>
        <div className='flex flex-col px-4'>
          <div className='flex gap-3'>
            <Link href={ROUTES.LOGIN} className={navigation_buttons}>
              Аккаунт <UserIcon size='20' />
            </Link>
          </div>
          <div className='mt-5 flex'>
            <Link href={ROUTES.CATALOG} className={navigation_buttons}>
              Каталог <Library size='20' />
            </Link>
          </div>
          <div className='mt-5 flex'>
            <Link href={ROUTES.EXTENDED_SEARCH} className={navigation_buttons}>
              Поиск <Search size='20' />
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
