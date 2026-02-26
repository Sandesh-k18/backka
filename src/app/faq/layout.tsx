import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQ",
    description: "Have questions about backKA? Find answers about anonymity, security, and how to use our whisper platform.",
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (


        <div className="animate-in fade-in duration-500" >
            {children}
        </div>

    );
}