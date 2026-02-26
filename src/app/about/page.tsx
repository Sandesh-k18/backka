import { ShieldCheck, Zap, Heart, Eye, MessageSquare, Fingerprint } from 'lucide-react';

export default function AboutPage() {
    // Replaced "10k users" with actual project focus areas
    const projectGoals = [
        { label: "Data Integrity", value: "100%" },
        { label: "Anonymity", value: "Strict" },
        { label: "Open Feedback", value: "Unfiltered" },
    ];

    const features = [
        {
            icon: <Fingerprint className="w-6 h-6 text-indigo-600" />,
            title: "Identity Protection",
            description: "We don't track your identity. Our goal is to provide a platform where the 'Intel' matters more than the sender."
        },
        {
            icon: <Eye className="w-6 h-6 text-indigo-600" />,
            title: "Owl's Vision",
            description: "Like our mascot, backKA is built to see through the noise. We provide clear insights through honest, anonymous feedback."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
            title: "Verified Ownership",
            description: "Our unique verification system ensures that once a username is claimed, the intel remains exclusive and secure."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 pt-20 pb-16">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* Hero Section */}
                <div className="max-w-3xl mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                        <Zap className="w-3 h-3" /> The Project Mission
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                        Unfiltered feedback. <br />
                        <span className="text-indigo-600">Securely whispered.</span>
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        backKA was born from a simple idea: the most valuable information is often the hardest to share.
                        We’re building a secure space where creators and developers can receive honest intel without
                        fear or friction.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {projectGoals.map((stat, i) => (
                        <div key={i} className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50 group">
                            <div className="text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">{stat.value}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, i) => (
                        <div key={i} className="flex flex-col gap-4">
                            <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-2xl shadow-sm">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-gray-900">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="mt-24 pt-12 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h4 className="font-bold text-gray-900">
                                Developed by{" "}
                                <a
                                    href="https://github.com/sandesh-k18"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-all"
                                >
                                    Not Anonymous ❀
                                </a>
                            </h4>
                            <p className="text-sm text-gray-500">Built for the community, driven by transparency.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">
                                <Heart className="w-3.5 h-3.5 fill-indigo-600" /> Open Source Spirit
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}