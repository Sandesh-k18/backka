import { ShieldCheck, Zap, Heart, Globe } from 'lucide-react';

export default function AboutPage() {
    const stats = [
        { label: "Active Users", value: "10K+" },
        { label: "Security Score", value: "99.9%" },
        { label: "Countries", value: "40+" },
    ];

    const features = [
        {
            icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
            title: "Security First",
            description: "Your data is encrypted and handled with the highest security standards available today."
        },
        {
            icon: <Zap className="w-6 h-6 text-indigo-600" />,
            title: "Lightning Fast",
            description: "Built on Next.js 15+ to ensure that your experience is seamless and lag-free."
        },
        {
            icon: <Heart className="w-6 h-6 text-indigo-600" />,
            title: "User Centric",
            description: "Every feature we build is based on direct feedback from our community."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 pt-20 pb-16">
            <div className="container mx-auto px-6">
                {/* Hero Section */}
                <div className="max-w-3xl mb-16">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6">
                        We are building the future of <span className="text-indigo-600">backKA.</span>
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed">
                        Our mission is to simplify complex workflows and provide a secure, 
                        intuitive environment for creators and developers worldwide.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 shadow-sm">
                            <div className="text-3xl font-bold text-indigo-600 mb-1">{stat.value}</div>
                            <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, i) => (
                        <div key={i} className="flex flex-col gap-4">
                            <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-2xl">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}