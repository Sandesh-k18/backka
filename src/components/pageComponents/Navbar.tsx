"use client";

import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { Loader2 } from 'lucide-react';

export const Navbar = () => {
    const { data: session, status } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-lg font-bold tracking-tight">
                    backKA
                </Link>
                
                <div className="flex items-center gap-4 min-h-[40px]"> 
                    {status === "loading" ? (
                        <Loader2 className="animate-spin text-gray-400 w-5 h-5" />
                    ) : session ? (
                        <>
                            <span className="text-gray-300 hidden md:inline">
                                Hello, {user?.username || user?.email}
                            </span>
                            <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => signOut({ callbackUrl: "/sign-in" })}
                            >
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link 
                                href="/sign-in" 
                                className="text-white text-sm font-medium hover:text-indigo-400 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link href="/sign-up">
                                <Button 
                                    size="sm" 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                                >
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}