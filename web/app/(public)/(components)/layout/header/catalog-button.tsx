'use client';

import { Library } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/(constants)';
import { Button } from '@/components/ui';

export function CatalogButton() {
  const router = useRouter();
  return (
    <Button size='icon' variant='ghost' onClick={() => router.push(ROUTES.CATALOG)}>
      <Library />
    </Button>
  );
}
