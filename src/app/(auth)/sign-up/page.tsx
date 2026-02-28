"use client";

import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDebounceCallback } from 'usehooks-ts';
import { toast } from "sonner";
import { useEffect, useState } from 'react';
import { signUpSchema } from '@/src/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/src/types/apiResponse';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Normalize to lowercase immediately on debounce
    const debounced = useDebounceCallback((value: string) => {
        setUsername(value.toLowerCase());
    }, 500);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            username: '',
            password: ''
        }
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username.length > 2) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    // Querying with the lowercase version
                    const response = await axios.get(`/api/username-unique?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            // Final normalization before API call
            const normalizedData = {
                ...data,
                username: data.username.toLowerCase(),
                email: data.email.toLowerCase()
            };

            const response = await axios.post<ApiResponse>('/api/sign-up', normalizedData);
            toast.success("Account created", { description: response.data.message });
            
            // Navigate to verify page using lowercase username
            router.replace(`/verify/${normalizedData.username}`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Sign up failed", { description: axiosError.response?.data.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl border border-slate-200 shadow-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-600">Join our community today</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField control={form.control} name="username" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700">Username</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input 
                                            placeholder="Choose a unique username" 
                                            className="h-11 pr-10"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <div className="absolute right-3 top-3">
                                        {isCheckingUsername && <Loader2 className="animate-spin h-5 w-5 text-slate-400" />}
                                        {!isCheckingUsername && usernameMessage === "Username is unique" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                        {!isCheckingUsername && usernameMessage && usernameMessage !== "Username is unique" && <AlertCircle className="h-5 w-5 text-red-500" />}
                                    </div>
                                </div>
                                {usernameMessage && (
                                    <p className={`text-[13px] font-medium flex items-center gap-1 mt-1 ${usernameMessage === "Username is unique" ? "text-green-600" : "text-red-500"}`}>
                                        {usernameMessage}
                                    </p>
                                )}
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700">Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" className="h-11" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700">Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" className="h-11" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button 
                            type="submit" 
                            className="w-full h-11 text-base font-semibold shadow-sm" 
                            disabled={isSubmitting || isCheckingUsername || (usernameMessage !== "" && usernameMessage !== "Username is unique")}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : "Sign Up"}
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
                    <p>
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-primary hover:underline font-semibold decoration-2 underline-offset-4">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;