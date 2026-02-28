import { ShieldCheck, Zap, Heart, Eye, MessageSquare, Fingerprint, Cpu } from 'lucide-react';

export default function AboutPage() {
    const projectGoals = [
        { label: "Data Integrity", value: "100%" },
        { label: "AI Accuracy", value: "Hugging Face" },
        { label: "Anonymity", value: "Absolute" },
    ];

    const features = [
        {
            icon: <Fingerprint className="w-6 h-6 text-indigo-600" />,
            title: "Zero-Trace Identity",
            description: "Our architecture is designed to prioritize the 'Whisper' over the sender. We don't store IP logs or tracking metadata."
        },
        {
            icon: <Cpu className="w-6 h-6 text-indigo-600" />,
            title: "HF-Inference Engine",
            description: "Leveraging Hugging Face's open-source models to generate intelligent, context-aware suggestions for your followers."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
            title: "Verified Ownership",
            description: "Claim your unique namespace with confidence. Once verified, your whispers and data belong exclusively to you."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 pt-24 pb-16 selection:bg-indigo-100">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* Hero Section */}
                <div className="max-w-3xl mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 shadow-sm">
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> The Project Mission
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-8 leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-slate-950 via-slate-800 to-indigo-600">
                        Bridging the gap between <br />
                        honesty and security.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
                        backKA was built on the belief that the most valuable feedback is often the hardest to give. We provide the infrastructure for transparency, powered by open-source AI.
                    </p>
                </div>

                {/* Stats Grid - Premium Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {projectGoals.map((stat, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 transition-all hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] group">
                            <div className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 tracking-tight">
                                {stat.value}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {features.map((feature, i) => (
                        <div key={i} className="flex flex-col gap-5">
                            <div className="w-14 h-14 flex items-center justify-center bg-white border border-slate-100 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-slate-900">
                                {feature.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed text-sm font-medium">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom Section - Developer Credit */}
                <div className="mt-32 pt-12 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="space-y-2">
                            <h4 className="font-bold text-slate-900 text-lg">
                                Developed by{" "}
                                <a
                                    href="https://github.com/sandesh-k18"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative inline-block text-indigo-600 group"
                                >
                                    <span className="relative z-10">Not Anonymous ❀</span>
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-100 group-hover:h-full transition-all -z-10 rounded-sm"></span>
                                </a>
                            </h4>
                            <p className="text-sm text-slate-400 font-medium">
                                Built with Next.js 16, Tailwind, and Hugging Face Inference.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2.5 text-[11px] font-bold text-indigo-600 bg-indigo-50/50 border border-indigo-100 px-5 py-2.5 rounded-full uppercase tracking-wider">
                                <Heart className="w-3.5 h-3.5 fill-indigo-600" /> Open Source Spirit
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}