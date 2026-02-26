"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { useMemo, useState, useEffect, useRef } from 'react';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
    Loader2,
    MessageSquareQuote,
    BadgeCheck,
    ShieldAlert,
    Menu,
    LogOut,
    Home,
    Info,
    HelpCircle,
    Sparkles
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/src/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";

export const Navbar = () => {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUnverifiedTip, setShowUnverifiedTip] = useState(false);

    // Track if user explicitly closed it during this "session" on the page
    const hasDismissedRef = useRef(false);
    const wasDashboardRef = useRef(pathname.startsWith('/dashboard'));
    const user = useMemo(() => session?.user as User, [session]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);

        const isNowDashboard = pathname.startsWith('/dashboard');

        if (status === "authenticated" && !user?.isVerified) {
            const crossedBoundary = isNowDashboard !== wasDashboardRef.current;

            // Reset dismissal if we switch between dashboard and public pages
            if (crossedBoundary) {
                hasDismissedRef.current = false;
                wasDashboardRef.current = isNowDashboard;
            }

            // Only trigger if not already showing and hasn't been dismissed yet
            if (!showUnverifiedTip && !hasDismissedRef.current) {
                const timer = setTimeout(() => setShowUnverifiedTip(true), 800);
                return () => clearTimeout(timer);
            }
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [status, user?.isVerified, pathname]); // Removed showUnverifiedTip from here to stop the loop

    const closeTip = () => {
        hasDismissedRef.current = true; // Mark as dismissed
        setShowUnverifiedTip(false);
    };

    const isDashboard = pathname.startsWith('/dashboard');

    const getNavStyle = (path: string) => {
        const isActive = pathname === path;
        return isActive
            ? "bg-indigo-50 text-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.2)] border-indigo-200"
            : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50";
    };

    return (
        <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "border-b border-gray-100 bg-white/80 backdrop-blur-xl py-0" : "bg-white py-1"
            }`}>
            <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">

                {/* --- Logo & Mobile Menu --- */}
                <div className="flex items-center gap-2 z-10">
                    {!isDashboard && (
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[280px]">
                                    <SheetHeader className="text-left">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="bg-indigo-600 p-1.5 rounded-lg">
                                                <MessageSquareQuote className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-xl font-bold tracking-tight text-gray-900">backKA</span>
                                        </div>
                                        <VisuallyHidden.Root>
                                            <SheetTitle>Menu</SheetTitle>
                                            <SheetDescription>Main navigation links</SheetDescription>
                                        </VisuallyHidden.Root>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-semibold text-gray-700 hover:bg-indigo-50 transition-colors"><Home className="w-5 h-5" /> Home</Link>
                                        <Link href="/about" className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-semibold text-gray-700 hover:bg-indigo-50 transition-colors"><Info className="w-5 h-5" /> About</Link>
                                        <Link href="/faq" className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-semibold text-gray-700 hover:bg-indigo-50 transition-colors"><HelpCircle className="w-5 h-5" /> FAQ</Link>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    )}

                    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
                        <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-200/50">
                            <MessageSquareQuote className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">backKA</span>
                    </Link>
                </div>

                {/* --- Desktop Navigation --- */}
                {!isDashboard && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center bg-gray-100/40 border border-gray-200/50 px-1 py-1 rounded-full backdrop-blur-md">
                        <Link href="/"><Button variant="ghost" size="sm" className={`rounded-full px-5 h-8 text-[11px] font-bold uppercase tracking-widest transition-all ${getNavStyle('/')}`}>Home</Button></Link>
                        <Link href="/about"><Button variant="ghost" size="sm" className={`rounded-full px-5 h-8 text-[11px] font-bold uppercase tracking-widest transition-all ${getNavStyle('/about')}`}>About</Button></Link>
                        <Link href="/faq"><Button variant="ghost" size="sm" className={`rounded-full px-5 h-8 text-[11px] font-bold uppercase tracking-widest transition-all ${getNavStyle('/faq')}`}>FAQ</Button></Link>
                    </div>
                )}

                {/* --- User Actions --- */}
                <div className="flex items-center gap-2 sm:gap-3 z-10">
                    {status === "loading" ? (
                        <Loader2 className="animate-spin text-indigo-600 w-5 h-5" />
                    ) : session ? (
                        <div className="flex items-center gap-2">
                            {/* User Info & Floating Tip */}
                            <div className="flex flex-col items-end border-r border-gray-200 pr-3 mr-1 relative">
                                <span className="text-xs font-bold text-gray-900 leading-none mb-1">
                                    {user.username || user.email?.split('@')[0]}
                                </span>

                                {!user.isVerified ? (
                                    <div className="flex items-center gap-1 text-[9px] text-amber-500 font-bold uppercase tracking-tight">
                                        <ShieldAlert className="w-3 h-3" /> Unverified
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-[9px] text-green-600 font-bold uppercase tracking-tight">
                                        <BadgeCheck className="w-3 h-3" /> Verified
                                    </div>
                                )}

                                <AnimatePresence>
                                    {showUnverifiedTip && !user.isVerified && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-3 w-64 bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl z-[60] origin-top-right border border-indigo-400"
                                        >
                                            <div className="absolute -top-1.5 right-4 w-3 h-3 bg-indigo-600 rotate-45 border-l border-t border-indigo-400" />
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-start gap-3 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 mb-4">
                                                    {/* Icon Container with a soft glow */}
                                                    <div className="bg-indigo-600 p-1.5 rounded-lg shrink-0 shadow-sm shadow-indigo-200">
                                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-[11px] sm:text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                                                            Security Note
                                                        </p>
                                                        <p className="text-[11px] sm:text-xs text-indigo-700/80 leading-snug font-medium">
                                                            Username unverified. Once this username is verified, all current
                                                            <span className="text-indigo-600 font-bold mx-1">whispers</span>
                                                            associated with it will be permanently erased.
                                                        </p>
                                                    </div>
                                                </div>
                                                <button onClick={closeTip} className="w-full text-[10px] font-bold text-xs uppercase bg-black text-red-600 py-2 rounded-xl active:scale-95 transition-transform">Dismiss</button>
                                                <div className="px-2">
                                                    <button
                                                        onClick={() => signOut({ callbackUrl: "/sign-up" })}
                                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.97] transition-all group"
                                                    >
                                                        <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                                            Sign Out & Reclaim
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {isDashboard ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-gray-200">
                                            <Menu className="h-4 w-4 text-gray-600" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 shadow-2xl">
                                        <DropdownMenuLabel className="flex flex-col gap-1 px-3 py-2">
                                            <span className="text-xs font-bold text-gray-900 truncate">{user.username || user.email}</span>
                                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Dashboard Menu</span>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/" className="flex items-center gap-2 py-2 cursor-pointer font-medium hover:text-indigo-600 transition-colors">
                                                <Home className="w-4 h-4" /> Home
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/sign-in" })} className="text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg cursor-pointer">
                                            <LogOut className="w-4 h-4 mr-2" /> Log Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button
                                    variant="outline" size="sm"
                                    className="border-red-200 text-red-600 hover:bg-red-50 h-9 px-3 sm:px-4 rounded-full font-bold text-xs"
                                    onClick={() => signOut({ callbackUrl: "/sign-in" })}
                                >
                                    <LogOut className="w-3.5 h-3.5 mr-0 md:mr-2" />
                                    <span className="hidden md:inline">Sign Out</span>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/sign-in" className="text-sm font-bold text-gray-600 hover:text-indigo-600 px-2">Login</Link>
                            <Link href="/sign-up">
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-4 sm:px-6 rounded-full font-bold text-xs shadow-lg shadow-indigo-200">
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