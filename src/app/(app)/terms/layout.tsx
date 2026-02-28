import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Platform Terms",
    description: "The rules of engagement for backKA. Read our terms of service regarding anonymous communication, prohibited content, and user responsibility.",
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="animate-in fade-in duration-500">
            {children}
        </div>
    );
}