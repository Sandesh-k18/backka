import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/src/components/ui/button';
import { Home, Search, Terminal } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center px-6 text-center bg-white selection:bg-indigo-100">
            {/* Logo/Icon Area with Linear Glow */}
            <div className="relative mb-12 group">
                {/* Large Background Blur */}
                <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-[100px] scale-150 opacity-50 group-hover:opacity-80 transition-opacity" />
                
                <div className="relative bg-white p-8 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 transition-transform hover:scale-[1.02] duration-500">
                    <Image 
                        src="/backka.webp" 
                        alt="backKA Owl" 
                        width={160} 
                        height={160} 
                        className="w-28 h-28 md:w-36 md:h-36 object-contain opacity-90"
                    />
                </div>

                {/* Status Badge in Slate-950 */}
                <div className="absolute -bottom-3 -right-3 bg-slate-950 text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full border-[6px] border-white shadow-xl flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-pulse" />
                    404: LOST INTEL
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-lg">
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 mb-6 tracking-tighter">
                    The whisper has <span className="text-indigo-600">vanished.</span>
                </h1>
                <p className="text-slate-500 mb-12 text-lg font-medium leading-relaxed antialiased">
                    The intelligence you're looking for was either erased, 
                    expired, or never existed in this sector of the grid.
                </p>

                {/* Action Buttons - Linear Style */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/">
                        <Button className="bg-slate-950 hover:bg-indigo-600 text-white rounded-2xl px-10 h-14 font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-3">
                            <Home className="w-4 h-4" />
                            Return to Base
                        </Button>
                    </Link>
                    
                    <Link href="/faq">
                        <Button variant="ghost" className="text-slate-500 hover:text-indigo-600 font-black text-[11px] uppercase tracking-[0.2em] h-14 px-8 rounded-2xl transition-colors flex items-center gap-3">
                            <Terminal className="w-4 h-4" />
                            Security FAQ
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Subtle Tracking Footer */}
            <div className="mt-24 flex items-center gap-4 opacity-30">
                <div className="h-px w-8 bg-slate-300" />
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">
                    Protocol: Dead End
                </p>
                <div className="h-px w-8 bg-slate-300" />
            </div>
        </div>
    );
}