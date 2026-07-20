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
import { usePostAuthRegisterMutation } from '@/shared/api';
import type { UserSchema } from '@/shared/api/types.gen';

const formSchema = z.object({
  username: z
    .string()
    .min(3, 'Имя пользователя слишком короткое')
    .max(24, 'Имя пользователя слишком длинное'),
  email: z.string().email('Неверный формат почты'),
  password: z.string().min(6, 'Пароль слишком короткий').max(24, 'Пароль слишком длинный')
});

export default function RegisterPage() {
  const [, setConfig] = useConfig();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', email: '', password: '' }
  });

  const { mutateAsync, isPending } = usePostAuthRegisterMutation();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await mutateAsync({ body: values });
      const user = response.data as UserSchema;
      setConfig({ authenticated: true, user });
      router.push(ROUTES.PROFILE(user.username));
      toast.success('Регистрация завершена');
    } catch {
      // ошибка уже показана глобальным обработчиком в QueryProvider
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
                Зарегистрируйте свой аккаунт для продолжения
              </p>
            </div>
            <Card className={AUTH.CARD}>
              <CardContent>
                <div className='grid gap-5'>
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя пользователя</FormLabel>
                        <FormControl>
                          <Input
                            required
                            className='bg-background'
                            type='text'
                            placeholder='waifu'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    name='username'
                    control={form.control}
                  />
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
                  {isPending ? 'Загрузка...' : 'Зарегистрироваться'}
                </Button>
              </CardFooter>
            </Card>
            <div className='text-muted-foreground flex justify-center gap-1 text-sm'>
              <p>Есть аккаунт?</p>
              <Link href={ROUTES.LOGIN} className='text-primary font-medium hover:underline'>
                Войти
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
