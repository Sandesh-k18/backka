import { Code2, Cpu, Globe, Key, Lock, Zap, ArrowLeft, Trash2, MessageSquare, UserCheck, RefreshCw, Mail } from 'lucide-react';
import Link from 'next/link';

export default function APIDocumentation() {
    const endpoints = [
        // Messaging Endpoints
        {
            method: "POST",
            path: "/api/send-message",
            desc: "Deliver an anonymous whisper to a specific user profile.",
            icon: Zap,
            color: "text-amber-500"
        },
        {
            method: "POST",
            path: "/api/accept-messages",
            desc: "Toggle whether your profile is currently accepting new whispers.",
            icon: MessageSquare,
            color: "text-indigo-600"
        },
        {
            method: "GET",
            path: "/api/get-messages",
            desc: "Retrieve the list of whispers received by the authenticated user.",
            icon: Mail,
            color: "text-indigo-600"
        },
        {
            method: "GET",
            path: "/api/suggest-messages",
            desc: "Fetch AI-generated conversation starters for anonymous prompts.",
            icon: Cpu,
            color: "text-purple-500"
        },
        {
            method: "DELETE",
            path: "/api/delete-message",
            desc: "Permanently remove a specific whisper from your inbox.",
            icon: Trash2,
            color: "text-rose-500"
        },
        {
            method: "DELETE",
            path: "/api/delete-all-messages",
            desc: "Wipe your entire whisper history. This action is irreversible.",
            icon: Trash2,
            color: "text-rose-500"
        },

        // Security & Auth Endpoints
        {
            method: "GET",
            path: "/api/verify-code",
            desc: "Verify the OTP or magic link code sent for authentication.",
            icon: UserCheck,
            color: "text-emerald-500"
        },
        {
            method: "GET",
            path: "/api/username-unique",
            desc: "Check real-time availability of a username during registration.",
            icon: Globe,
            color: "text-indigo-600"
        },
        {
            method: "POST",
            path: "/api/auth/change-password",
            desc: "Update the account password while the user is logged in.",
            icon: Lock,
            color: "text-slate-600"
        },
        {
            method: "POST",
            path: "/api/auth/forgot-password",
            desc: "Trigger a password recovery email for a specific account.",
            icon: Mail,
            color: "text-slate-600"
        },
        {
            method: "POST",
            path: "/api/auth/reset-password",
            desc: "Finalize password reset using a secure recovery token.",
            icon: RefreshCw,
            color: "text-slate-600"
        },
        {
            method: "POST",
            path: "/api/sign-up",
            desc: "Initialize a new user account on the backKA protocol.",
            icon: Key,
            color: "text-indigo-600"
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-24 pb-16 selection:bg-indigo-100">
            <div className="container mx-auto px-6 max-w-4xl">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-3 h-3" /> Back to Base
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-slate-950 via-slate-800 to-indigo-600">
                        Developer Interface
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">
                        Endpoints for the backKA anonymity protocol.
                    </p>
                </div>

                {/* API Key Card */}
                <div className="mb-12 p-8 rounded-[2.5rem] bg-slate-950 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Key className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-bold">Authentication</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
                            All requests must include a Bearer Token. 
                            Manage your keys in <Link href="/settings" className="text-white underline underline-offset-4">Settings</Link>.
                        </p>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-300">
                            Authorization: Bearer YOUR_SECRET_TOKEN
                        </div>
                    </div>
                </div>

                {/* Endpoints Grid */}
                <div className="grid gap-4">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-4">Protocol Endpoints</h2>
                    {endpoints.map((api, idx) => (
                        <div key={idx} className="group p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-300">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-6">
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <api.icon className={`w-5 h-5 ${api.color}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                                                api.method === 'POST' ? 'bg-amber-100 text-amber-700' : 
                                                api.method === 'DELETE' ? 'bg-rose-100 text-rose-700' : 
                                                'bg-indigo-100 text-indigo-700'
                                            }`}>
                                                {api.method}
                                            </span>
                                            <code className="text-sm font-bold text-slate-900">{api.path}</code>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium">{api.desc}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Code2 className="w-5 h-5 text-slate-300" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Specs */}
                <div className="mt-12 flex flex-wrap gap-8 justify-center border-t border-slate-100 pt-12">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Cpu className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Rate Limit: 100 req/min</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Globe className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">CORS: Enabled</span>
                    </div>
                </div>
            </div>
        </div>
    );
}