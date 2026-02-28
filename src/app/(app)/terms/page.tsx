import { Gavel, Scale, AlertCircle, ZapOff, Ban, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
    const rules = [
        {
            icon: AlertCircle,
            title: "Prohibited Content",
            content: "You may not use backKA to transmit hate speech, explicit threats of violence, or targeted harassment. While we value anonymity, we do not protect illegal activities."
        },
        {
            icon: ZapOff,
            title: "Automated Usage",
            content: "Scraping data or using bots to flood profiles with whispers is strictly prohibited. We implement rate-limiting and AI-driven spam detection to protect our users."
        },
        {
            icon: Ban,
            title: "Account Termination",
            content: "We reserve the right to suspend or erase unverified accounts that remain inactive for extended periods or accounts found violating our core safety guidelines."
        },
        {
            icon: Scale,
            title: "User Responsibility",
            content: "You are solely responsible for the 'whisper links' you share. backKA is a conduit for communication and does not take ownership of user-generated content."
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-24 pb-16 selection:bg-indigo-100">
            <div className="container mx-auto px-6 max-w-4xl">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-3 h-3" /> Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-slate-950 via-slate-800 to-indigo-600">
                        Platform Terms
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">
                        The rules of engagement for backKA.
                    </p>
                </div>

                {/* Terms Sections */}
                <div className="grid gap-6">
                    {rules.map((rule, idx) => (
                        <div key={idx} className="group p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-300">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                    <rule.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{rule.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium antialiased">
                                        {rule.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Disclaimer Box */}
                <div className="mt-12 p-8 rounded-[2rem] bg-indigo-50/30 border border-indigo-100/50">
                    <h4 className="text-sm font-black text-indigo-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Gavel className="w-4 h-4 text-indigo-600" /> 
                        Legal Disclaimer
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        The service is provided "as is" and "as available" without any warranties. backKA does not guarantee that the service will be uninterrupted or error-free. By using this platform, you agree to indemnify backKA against any claims resulting from your use of the service.
                    </p>
                </div>

                {/* Footer Credits */}
                <div className="mt-16 p-10 rounded-[2.5rem] bg-slate-950 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold mb-1">Acceptance of Terms</h3>
                            <p className="text-slate-400 text-sm font-medium">By using backKA, you agree to follow these protocols.</p>
                        </div>
                        <Link href="/sign-up">
                            <button className="bg-white text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
                                I Understand
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Effective Date: February 2026 • Build ID: BK-TOS-2026
                    </p>
                </div>
            </div>
        </div>
    );
}