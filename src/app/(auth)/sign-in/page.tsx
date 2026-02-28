"use client";

import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { signInSchema } from '@/src/schemas/signInSchema';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const SignInPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false
    });

    if (result?.error) {
      setIsSubmitting(false);
      if (result.error === 'CredentialsSignin' || result.status === 401) {
        toast.error("Login Failed", {
          description: "Incorrect email/username or password",
        });
      } else {
        toast.error("Error", {
          description: result.error,
        });
      }
    }

    if (result?.ok) {
      toast.success(`Welcome ${data.identifier}!`);
      router.replace("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600">Enter your credentials to access your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email/username"
                      className="h-11 shadow-sm"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-slate-700">Password</FormLabel>
                    <Link 
                      href="/forgot-password" 
                      className="text-sm font-semibold text-primary hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 shadow-sm"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            <Button type="submit" className="w-full h-11 text-base font-semibold transition-all" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline font-semibold decoration-2 underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;