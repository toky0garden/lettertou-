'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AUTH, ROUTES } from '@/app/(constants)';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from '@/components/ui';
import { useConfig } from '@/hooks/useConfig';
import { useLogin } from '@/utils/api/hooks';

const formSchema = z.object({
  email: z.string().email('Неверный формат почты'),
  password: z.string().min(6, 'Пароль слишком короткий').max(24, 'Пароль слишком длинный')
});

export default function LoginPage() {
  const [, setConfig] = useConfig();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { mutateAsync, isPending } = useLogin();

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await mutateAsync({ params: values });
      setConfig({ authenticated: true, user: response.data });

      router.push(ROUTES.PROFILE(response.data.username));
      toast.success('Вход выполнен');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось войти');
    }
  };

  return (
    <div className='h-screen'>
      <div className='flex h-full items-center justify-center'>
        <Form {...form}>
          <form className='grid w-full max-w-sm gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col items-center gap-y-2'>
              <h1 className='text-center text-4xl font-semibold'>Добро пожаловать</h1>
              <p className='text-muted-foreground text-center text-sm'>
                Войдите в свой аккаунт для продолжения
              </p>
            </div>
            <Card className={AUTH.CARD}>
              <CardContent>
                <div className='grid gap-5'>
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Почта</FormLabel>
                        <FormControl>
                          <Input
                            required
                            className='bg-background'
                            type='email'
                            placeholder='mail@example.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    name='email'
                    control={form.control}
                  />
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input
                            required
                            className='bg-background'
                            type='password'
                            placeholder='creeper2009'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    name='password'
                    control={form.control}
                  />
                </div>
              </CardContent>
              <CardFooter className={AUTH.CARD_FOOTER}>
                <Button className='mt-2 w-full cursor-pointer' type='submit'>
                  {isPending ? 'Загрузка...' : 'Войти'}
                </Button>
                {/* <Button className='w-full cursor-pointer' variant='outline'>
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    height='1em'
                    width='1em'
                    xmlns='http://www.w3.org/2000/svg'
                    stroke='currentColor'
                    strokeWidth='0'
                    viewBox='0 0 488 512'
                  >
                    <path d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'></path>
                  </svg>
                  Продолжить с помощью Google
                </Button> */}
              </CardFooter>
            </Card>
            <div className='text-muted-foreground flex justify-center gap-1 text-sm'>
              <p>Нету аккаунта?</p>
              <Link href={ROUTES.REGISTER} className='text-primary font-medium hover:underline'>
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
