import { HelpCircle, ChevronRight, MessageSquare, Shield, Zap, Lock, Globe, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
    const faqs = [
        {
            question: "How do I verify my account?",
            answer: "To verify your account, simply enter the unique 6-digit OTP (One-Time Password) sent to your registered email address. Once submitted, your account will be fully activated."
        },
        {
            question: "What happens if I don't verify my username?",
            answer: "Unverified accounts are temporary. If a legitimate owner verifies that username, all existing whispers and data on the unverified profile are permanently erased to ensure security."
        },
        {
            question: "Is my data secure with backKA?",
            answer: "Absolutely. We use MongoDB Atlas with AES-256 encryption at rest and TLS 1.2+ for data in transit. We maintain a strict minimal-data policy to keep your whispers private."
        },
        {
            question: "How do I reset or change my password?",
            answer: "You can update your password anytime via the Security Center in your Dashboard settings. For security reasons, you will be logged out and asked to sign back in after a successful change."
        },
        {
            question: "Are the messages truly anonymous?",
            answer: "Yes. We do not attach sender metadata (like IP addresses or account IDs) to the messages. The recipient sees only the content of the 'whisper'."
        },
        {
            question: "Can I change my username later?",
            answer: "Usernames are currently unique and permanent once verified. We recommend choosing a name you are comfortable with for the long term."
        },
        {
            question: "Is there a limit to how many messages I can receive?",
            answer: "Our free tier allows for unlimited received messages. However, we implement rate limiting on how fast messages can be sent to a single profile to prevent spam."
        },
        {
            question: "Can I use backKA for free?",
            answer: "Yes! We offer a generous free tier for individuals. Professional plans with advanced analytics and custom branding will be available soon."
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-24 pb-16 selection:bg-indigo-100">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                        Help Center
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-slate-950 via-slate-800 to-indigo-600">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">
                        Everything you need to know about backKA whispers.
                    </p>
                </div>

                {/* FAQ List - Premium Cards */}
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="group p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 transition-all duration-300 hover:bg-white hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:border-indigo-100 cursor-default"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 -ml-6 transition-all hidden md:flex" />
                                        {faq.question}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed text-sm font-medium antialiased">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Grid for Extra Context */}
                <div className="grid md:grid-cols-3 gap-6 mt-20">
                    {[
                        { icon: Shield, title: "Privacy First", desc: "Encrypted & No Tracking" },
                        { icon: Zap, title: "Fast Delivery", desc: "Instant Real-time Updates" },
                        { icon: MessageSquare, title: "AI Enhanced", desc: "Smart Prompt Generation" }
                    ].map((item, idx) => (
                        <div key={idx} className="p-8 bg-white rounded-[2rem] border border-slate-100 text-center shadow-sm hover:shadow-md transition-shadow">
                            <item.icon className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
                            <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20 p-10 rounded-[2.5rem] bg-slate-950 text-center text-white shadow-2xl shadow-indigo-100 overflow-hidden relative">
                    {/* Background Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600 rounded-full blur-[100px] opacity-50" />
                    
                    <h3 className="text-2xl font-bold mb-3 relative z-10">Still have questions?</h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto relative z-10">
                        Can't find the answer you're looking for? Reach out to our team.
                    </p>
                    <Link
                        href="https://github.com/sandesh-k18"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10"
                    >
                        <button className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg">
                            Get in Touch
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}