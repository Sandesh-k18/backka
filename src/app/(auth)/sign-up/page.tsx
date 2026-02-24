"use client";

import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
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
import { Loader2 } from 'lucide-react';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const {toast} = useToast(); Not used now
    // Note: useDebounceValue returns [value, setValue]
    const debounced = useDebounceCallback(setUsername, 500);
    const router = useRouter();

    //zod form setup
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            username: '',
            password: ''
        }
    });

    // Handle Username Uniqueness Check
    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username.length >= 1) { // Only check if more than 1 character
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/username-unique?username=${username}`);
                    console.log(response.data.message);

                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    );
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
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast.success("Success", { description: response.data.message });

            // Redirect using the data from the form
            router.replace(`/verify/${data.username}`); //TODO
            setIsSubmitting(false);
        } catch (error) {
            console.error("Sign up error:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast.error("Sign up failed", {
                description: errorMessage
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Us</h1>
                    <p className="mb-4 text-gray-600">Sign up to start your adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="username" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            debounced(e.target.value);
                                        }}
                                    />
                                </FormControl>
                                {
                                    isCheckingUsername && <Loader2 className="animate-spin ml-2 h-4 w-4" />
                                }
                                <p
                                    className={`text-sm mt-1 ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}
                                >
                                    {usernameMessage}
                                </p>
                                <FormDescription >
                                    This is you public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email" {...field}
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
                        <Button type="submit" className="w-full" disabled={isSubmitting || isCheckingUsername || usernameMessage === "Username is already taken"}>
                            {isSubmitting ? (<>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Signing Up...
                            </>) : (
                                "Sign Up")
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4 text-sm">
                    <p>
                        Already a member? <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 font-medium">Sign In</Link>
                    </p>
                </div>
            </div>
        </div >
    );
};

export default SignUpPage;