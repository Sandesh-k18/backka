import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Protocol",
    description: "Learn how backKA handles your data. Our privacy-first architecture ensures your whispers remain anonymous and your metadata stays private.",
};

export default function PrivacyLayout({
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