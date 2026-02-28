import { ShieldCheck, EyeOff, Lock, Database, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    const sections = [
        {
            icon: EyeOff,
            title: "Zero Metadata Tracking",
            content: "We do not store your IP address, browser fingerprint, or device identifiers when you send a whisper. Our system is designed to decouple the sender from the message at the architectural level."
        },
        {
            icon: Lock,
            title: "Encryption Standards",
            content: "All data is encrypted using AES-256 at rest and TLS 1.2+ in transit. Your messages are stored in secure MongoDB Atlas clusters with strict access control lists."
        },
        {
            icon: Database,
            title: "Data Retention",
            content: "Unverified accounts are subject to periodic purging to ensure username availability. Verified users have permanent storage until they choose to delete their account and associated whispers."
        },
        {
            icon: ShieldCheck,
            title: "No Third-Party Sharing",
            content: "We do not sell, trade, or rent your personal information. We only use essential cookies to maintain your session and ensure the platform's security."
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
                        Privacy Protocol
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">
                        How we protect your identity and your whispers.
                    </p>
                </div>

                {/* Policy Sections */}
                <div className="grid gap-6">
                    {sections.map((section, idx) => (
                        <div key={idx} className="group p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-300">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium antialiased">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Details */}
                <div className="mt-12 p-8 rounded-[2rem] border border-dashed border-slate-200">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-600" /> 
                        International Compliance
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        While backKA is a global platform, we align our data processing with GDPR and CCPA principles. You have the right to request a full export of your data or immediate deletion of your profile at any time through your dashboard settings.
                    </p>
                </div>

                {/* Contact CTA (Dark Slate Style) */}
                <div className="mt-16 p-10 rounded-[2.5rem] bg-slate-950 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold mb-1">Privacy Concerns?</h3>
                            <p className="text-slate-400 text-sm font-medium">Our legal and security team is here to help.</p>
                        </div>
                        <Link href="mailto:security@backka.com">
                            <button className="bg-white text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
                                Contact Security
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Last Updated: February 2026 • Version 2.0.4
                    </p>
                </div>
            </div>
        </div>
    );
}