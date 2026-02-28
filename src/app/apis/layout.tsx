import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Developer Interface & Documentation",
    description: "Access the backKA API documentation. Integrate anonymous messaging, profile fetching, and security protocols into your own applications.",
};

export default function APILayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            {children}
        </div>
    );
}