'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from "sonner";
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordRequestPage() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('/api/auth/forgot-password', { email: email.toLowerCase() });
            
            toast.success("Success", {
                description: response.data.message || "Reset link sent to your email."
            });
            setIsSent(true);
        } catch (error: any) {
            toast.error("Error", {
                description: error.response?.data.message || "Failed to send reset email."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl border border-slate-200">
                <div className="text-center">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-sm text-slate-600">
                        {isSent 
                            ? "Check your inbox for the reset link." 
                            : "No worries! Enter your email and we'll send you a reset link."}
                    </p>
                </div>

                {!isSent ? (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending Link...
                                </>
                            ) : 'Send Reset Link'}
                        </Button>
                    </form>
                ) : (
                    <div className="text-center pt-4">
                        <Button variant="outline" onClick={() => setIsSent(false)} className="w-full">
                            Didn't get the email? Try again
                        </Button>
                    </div>
                )}

                <div className="text-center pt-2">
                    <Link 
                        href="/sign-in" 
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}