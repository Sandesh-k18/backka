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

const SignInPage = () => {


  const router = useRouter();

  //zod form setup
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false
    });
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error("Login Failed", {
          description: "Incorrect username or password",
        });
      } else {
        toast.error("Error", {
          description: result.error,
        });
      }
    }
    if (result?.ok) { // better than result.url
      toast.success("Signed in successfully!");
      router.replace("/dashboard");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Us</h1>
          <p className="mb-4 text-gray-600">Sign in to start your adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField control={form.control} name="identifier" render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                  <Input placeholder="email/username" {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="w-full"
            >
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4 text-sm">
          <p>
            Not a member yet? <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">Sign Up</Link>
          </p>
        </div>
      </div>
    </div >
  );
};

export default SignInPage;