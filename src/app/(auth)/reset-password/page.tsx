"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import axios from "axios";
import { toast } from "sonner";

function ResetForm() {
    const searchParams = useSearchParams();
    // This token comes from the URL generated in your email helper
    const token = searchParams.get("token");
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setIsSubmitting(true);
        try {
            // FIXED URL: Added '/confirm' to match your backend folder structure
            const response = await axios.post("/api/auth/reset-password/confirm", {
                token,
                identifier,
                password,
            });

            toast.success(response.data.message || "Password updated successfully!");

            // Delay redirect slightly so user can see the success message
            setTimeout(() => {
                router.push("/sign-in");
            }, 2000);

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="p-8 bg-white rounded-lg shadow-md text-center border border-red-100">
                    <h2 className="text-xl font-bold text-red-600">Invalid or Expired Link</h2>
                    <p className="text-gray-600 mt-2">The reset token is missing. Please request a new link.</p>
                    <button
                        onClick={() => router.push('/forgot-password')}
                        className="mt-4 text-blue-600 hover:underline font-medium"
                    >
                        Go back to Forgot Password
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-500">Enter your details to secure your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email or Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your email or username"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full p-2 rounded text-white font-semibold transition ${isSubmitting
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 shadow-md"
                            }`}
                    >
                        {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        }>
            <ResetForm />
        </Suspense>
    );
}