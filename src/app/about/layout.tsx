import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn more about backKA, our mission for secure anonymous feedback, and the team behind the whispers.",
};

export default function AboutLayout({
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