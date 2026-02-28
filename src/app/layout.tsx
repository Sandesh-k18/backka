import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AuthProvider from "@/src/context/AuthProvider";
import "./globals.css";
import { Toaster } from "@/src/components/ui/sonner";
import { Navbar } from '@/src/components/pageComponents/Navbar';
import Footer from "../components/pageComponents/Footer";

export const metadata: Metadata = {
  // 1. Metadata Base (Fixes the warning)
  metadataBase: new URL("https://backka.sandeshkharel.com.np"),

  // 2. Titles
  title: {
    default: "backKA | Anonymous Whispers & Feedback",
    template: "%s | backKA"
  },

  // 3. Description & Keywords
  description: "Send and receive anonymous messages securely. Share your link, hear the truth, and keep the conversation safe with backKA.",
  keywords: ["anonymous messages", "whisper app", "secret feedback", "backKA", "anonymous chat"],

  // 4. Open Graph
  openGraph: {
    title: "backKA | Anonymous Whispers",
    description: "What do people really think? Send me an anonymous whisper!",
    url: "https://backka.sandeshkharel.com.np",
    siteName: "backKA",
    images: [
      {
        url: "/og-image.webp", 
        width: 1200,
        height: 630,
        alt: "backKA Anonymous Messaging",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 5. Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "backKA",
    description: "Send anonymous whispers safely. True feedback platform.",
    images: ["/og-image.webp"],
    creator: "@Khar3lSand3sh",
  },

  // 6. Favicons & Icons
  icons: {
    icon: "/backka.webp",
    shortcut: "/backka.webp",
    apple: "/backka.webp",
  },

  // 7. Verification
  verification: {
    google: "Txrgpf0GrAERTWlGg-t3iueVk3KxIj86XBxMreNDAfg",
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${poppins.className} flex flex-col min-h-screen m-0 p-0 overflow-x-hidden`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}