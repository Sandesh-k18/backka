import { HelpCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
    const faqs = [
        {
            question: "How do I verify my account?",
            answer: "Account verification is handled through your dashboard settings. Once you complete your profile information, our team reviews it within 24 hours."
        },
        {
            question: "Is my data secure with backKA?",
            answer: "Absolutely. We use industry-standard AES-256 encryption for all data at rest and TLS for data in transit."
        },
        {
            question: "Can I use backKA for free?",
            answer: "Yes! We offer a generous free tier for individuals. Professional and Enterprise plans are available for larger teams requiring more resources."
        },
        {
            question: "How do I reset my password?",
            answer: "On the Sign In page, click 'Forgot Password' and follow the instructions sent to your registered email address."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pt-20 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6">
                        <HelpCircle className="w-4 h-4" />
                        Help Center
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-500">Everything you need to know about backKA and how it works.</p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="group p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-default"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 -ml-6 transition-all" />
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 p-8 rounded-3xl bg-indigo-600 text-center text-white shadow-xl shadow-indigo-200">
                    <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                    <p className="text-indigo-100 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <Link
                        href="https://github.com/sandesh-k18"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold text-sm hover:bg-indigo-50 transition-colors">
                            Get in Touch
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}