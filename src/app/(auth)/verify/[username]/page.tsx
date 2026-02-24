"use client";

import { Button } from '@/src/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { verifySchema } from '@/src/schemas/verifySchema';
import { ApiResponse } from '@/src/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Form } from "@/src/components/ui/form";
import { toast } from 'sonner';
import * as z from 'zod';

const verifyAccount = () => {
    const router = useRouter();
    const param = useParams<{ username: string }>();

    //zod form setup
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {

        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: param.username,
                code: data.code
            });
            toast.success(response.data.message);
            router.replace('/sign-in');

        } catch (error) {
            console.error("verifyCode error:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Verification failed", {
                description: axiosError.response?.data.message ?? "An error occurred during verification",
                // variant: "destructive"
            });

        };
    };

    return (

        <div className='flex justify-center items-center min-h-screen   bg-gray-50'>
            <div className='w-full max-w-md p-8 space-y-8  bg-white rounded-lg shadow-md' >
                <div>
                    <h2 className='text-2xl font-bold text-center'>Verify Your Account</h2>
                    <p className='mt-2 text-center text-gray-600'>Enter the verification code sent to your email.</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='mt-8 space-y-6'>
                        <FormField
                            control={form.control}
                            name='code'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter code' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit'>Verify Account</Button>
                    </form>
                </Form>
            </div>
        </div>

    )
}

export default verifyAccount
