'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ROUTES } from '@/constants';
import { createBrowserClient } from '@/utils/supabase/client';
import { loginSchema, type LoginFormData } from '@/components/login-screen.schema';

export function LoginScreen() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const { isSubmitting } = form.formState;

  async function handleLogin(values: LoginFormData) {
    setFormError(null);
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setFormError(error.message);
      return;
    }

    router.push(ROUTES.DASHBOARD);
    router.refresh();
  }

  function onSubmit(values: LoginFormData): void {
    void handleLogin(values);
  }

  return (
    <div className='flex h-screen w-full items-center justify-center bg-[#0b162a] px-6 font-sans'>
      <div className='w-full max-w-sm space-y-10'>
        <div className='space-y-2 text-center'>
          <h2 className='text-primary text-sm font-bold tracking-widest uppercase'>Welcome To</h2>
          <h1 className='text-4xl leading-tight font-extrabold text-white'>Confyde</h1>
        </div>

        <Form {...form}>
          <form className='space-y-5' onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
            {formError && (
              <p className='rounded-md border border-amber-500/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100' role='alert'>
                {formError}
              </p>
            )}

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='!text-white/70'>Email</FormLabel>
                  <FormControl>
                    <Input type='email' autoComplete='email' placeholder='you@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='!text-white/70'>Password</FormLabel>
                  <FormControl>
                    <Input type='password' autoComplete='current-password' placeholder='••••••••' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              variant='primary'
              type='submit'
              disabled={isSubmitting}
              className='hover:bg-primary-hover group h-auto w-full justify-between rounded-sm px-6 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5'
              rightIcon={<ArrowRight className='h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100' />}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin' aria-hidden />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
