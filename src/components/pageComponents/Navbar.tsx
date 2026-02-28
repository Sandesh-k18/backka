"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { useMemo, useState, useEffect, useRef } from 'react';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Image from 'next/image';
import {
    Loader2,
    BadgeCheck,
    ShieldAlert,
    Menu,
    LogOut,
    Home,
    Info,
    HelpCircle
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

    const hasDismissedRef = useRef(false);
    const wasDashboardRef = useRef(pathname.startsWith('/dashboard'));
    const user = useMemo(() => session?.user as User, [session]);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY > 10;
            setIsScrolled(offset);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const isNowDashboard = pathname.startsWith('/dashboard');

        if (status === "authenticated" && !user?.isVerified) {
            const crossedBoundary = isNowDashboard !== wasDashboardRef.current;

            if (crossedBoundary) {
                hasDismissedRef.current = false;
                wasDashboardRef.current = isNowDashboard;
                setShowUnverifiedTip(false);
            }

            if (!hasDismissedRef.current) {
                const timer = setTimeout(() => {
                    setShowUnverifiedTip(true);
                }, 800);
                return () => clearTimeout(timer);
            }
        } else {
            setShowUnverifiedTip(false);
        }
    }, [status, user?.isVerified, pathname]);

    const closeTip = () => {
        hasDismissedRef.current = true;
        setShowUnverifiedTip(false);
    };

    const isDashboard = pathname.startsWith('/dashboard');

    const getNavStyle = (path: string) => {
        const isActive = pathname === path;
        return isActive
            ? "bg-white text-indigo-600 shadow-[0_2px_10px_rgba(79,70,229,0.1)] border-slate-200"
            : "text-slate-500 hover:text-indigo-600 hover:bg-white/50";
    };

    return (
        <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
            isScrolled 
            ? "border-b border-slate-100 bg-white/80 backdrop-blur-xl py-0 shadow-sm" 
            : "bg-transparent py-2"
        }`}>
            <div className="container mx-auto flex h-16 items-center justify-between px-6 relative">

                {/* --- Logo & Mobile Menu --- */}
                <div className="flex items-center gap-2 z-10">
                    {!isDashboard && (
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 hover:bg-slate-100 rounded-xl">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[280px] bg-white border-r border-slate-100">
                                    <SheetHeader className="text-left">
                                        <div className="flex items-center gap-2 mb-8">
                                            <div className="overflow-hidden flex items-center justify-center w-10 h-10">
                                                <Image
                                                    src="/backka.webp"
                                                    alt="Logo"
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <span className="text-xl font-black tracking-tighter text-slate-950">
                                                back<span className="text-indigo-600">KA</span>
                                            </span>
                                        </div>
                                        <VisuallyHidden.Root>
                                            <SheetTitle>Menu</SheetTitle>
                                            <SheetDescription>Main navigation links</SheetDescription>
                                        </VisuallyHidden.Root>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all"><Home className="w-4 h-4" /> Home</Link>
                                        <Link href="/about" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all"><Info className="w-4 h-4" /> About</Link>
                                        <Link href="/faq" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all"><HelpCircle className="w-4 h-4" /> FAQ</Link>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    )}

                    <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95">
                        <div className="overflow-hidden flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100">
                            <Image
                                src="/backka.webp"
                                alt="Logo"
                                width={80}
                                height={80}
                                className="w-full h-full object-contain p-1.5"
                                priority
                            />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-950">
                            back<span className="text-indigo-600">KA</span>
                        </span>
                    </Link>
                </div>

                {/* --- Desktop Navigation --- */}
                {!isDashboard && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center bg-slate-100/50 border border-slate-200/60 p-1 rounded-full backdrop-blur-md">
                        <Link href="/"><Button variant="ghost" size="sm" className={`rounded-full px-6 h-8 text-[10px] font-black uppercase tracking-[0.15em] transition-all ${getNavStyle('/')}`}>Home</Button></Link>
                        <Link href="/about"><Button variant="ghost" size="sm" className={`rounded-full px-6 h-8 text-[10px] font-black uppercase tracking-[0.15em] transition-all ${getNavStyle('/about')}`}>About</Button></Link>
                        <Link href="/faq"><Button variant="ghost" size="sm" className={`rounded-full px-6 h-8 text-[10px] font-black uppercase tracking-[0.15em] transition-all ${getNavStyle('/faq')}`}>FAQ</Button></Link>
                    </div>
                )}

                {/* --- User Actions --- */}
                <div className="flex items-center gap-2 sm:gap-3 z-10">
                    {status === "loading" ? (
                        <Loader2 className="animate-spin text-indigo-600 w-5 h-5" />
                    ) : session ? (
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col items-end border-r border-slate-200 pr-4 mr-1 relative">
                                <span className="text-xs font-black text-slate-900 leading-none mb-1.5">
                                    {user.username || user.email?.split('@')[0]}
                                </span>

                                {!user.isVerified ? (
                                    <div className="flex items-center gap-1 text-[9px] text-amber-600 font-bold uppercase tracking-wider">
                                        <ShieldAlert className="w-3 h-3" /> Unverified
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-[9px] text-indigo-600 font-bold uppercase tracking-wider">
                                        <BadgeCheck className="w-3 h-3" /> Verified
                                    </div>
                                )}

                                <AnimatePresence>
                                    {showUnverifiedTip && !user.isVerified && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 12, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-4 w-72 bg-slate-950 text-white p-5 rounded-[2rem] shadow-2xl z-[60] origin-top-right border border-slate-800"
                                        >
                                            <div className="absolute -top-1.5 right-6 w-3 h-3 bg-slate-950 rotate-45 border-l border-t border-slate-800" />
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                                                    <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-xl">
                                                        <Image
                                                            src="/backka.webp"
                                                            alt="Logo"
                                                            width={40}
                                                            height={40}
                                                            className="w-full h-full object-contain p-1"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Security Protocol</p>
                                                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                                                            Unverified accounts are ephemeral. Claim your identity permanently to secure your intel.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={closeTip} className="flex-1 text-[10px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl transition-all">Later</button>
                                                    <button
                                                        onClick={() => signOut({ callbackUrl: "/sign-up" })}
                                                        className="flex-[2] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                                                    >
                                                        <span className="text-[10px] font-black uppercase tracking-wider">Verify Identity</span>
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
                                        <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-slate-200 bg-white hover:bg-slate-50 transition-all">
                                            <Menu className="h-4 w-4 text-slate-600" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-60 mt-2 rounded-[1.5rem] p-2 shadow-2xl bg-white border-slate-100">
                                        <DropdownMenuLabel className="flex flex-col gap-1 px-4 py-3">
                                            <span className="text-xs font-black text-slate-950 truncate">{user.username || user.email}</span>
                                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Account Space</span>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-slate-50" />
                                        <DropdownMenuItem asChild>
                                            <Link href="/" className="flex items-center gap-2 px-4 py-2.5 cursor-pointer font-bold text-slate-600 text-xs hover:text-indigo-600 transition-colors">
                                                <Home className="w-4 h-4" /> Home
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-slate-50" />
                                        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/sign-in" })} className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 rounded-xl cursor-pointer font-bold text-xs px-4 py-2.5">
                                            <LogOut className="w-4 h-4 mr-2" /> Log Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button
                                    variant="outline" size="sm"
                                    className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600 h-10 px-4 rounded-xl font-bold text-xs bg-white transition-all"
                                    onClick={() => signOut({ callbackUrl: "/sign-in" })}
                                >
                                    <LogOut className="w-3.5 h-3.5 mr-0 md:mr-2" />
                                    <span className="hidden md:inline">Sign Out</span>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/sign-in" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 px-3 transition-colors">Login</Link>
                            <Link href="/sign-up">
                                <Button size="sm" className="bg-slate-950 hover:bg-indigo-600 text-white h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95">
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