import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AuthProvider from "@/src/context/AuthProvider";
import "./globals.css";
import { Toaster } from "@/src/components/ui/sonner";
import { Navbar } from '@/src/components/pageComponents/Navbar';
import Footer from "../components/pageComponents/Footer";

export const metadata: Metadata = {
  // 1. Titles
  title: {
    default: "backKA | Anonymous Whispers & Feedback",
    template: "%s | backKA" // Allows sub-pages like /about to be "About | backKA"
  },

  // 2. Description & Keywords
  description: "Send and receive anonymous messages securely. Share your link, hear the truth, and keep the conversation safe with backKA.",
  keywords: ["anonymous messages", "whisper app", "secret feedback", "backKA", "anonymous chat"],

  // 3. Open Graph (How it looks on Facebook/WhatsApp/Discord)
  openGraph: {
    title: "backKA | Anonymous Whispers",
    description: "What do people really think? Send me an anonymous whisper!",
    url: "https://backka.sandeshkharel.com.np",
    siteName: "backKA",
    images: [
      {
        url: "/og-image.webp", // Place a 1200x630 image in your public folder
        width: 1200,
        height: 630,
        alt: "backKA Anonymous Messaging",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 4. Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "backKA",
    description: "Send anonymous whispers safely. True feedback platform.",
    images: ["/og-image.webp"],
    creator: "@Khar3lSand3sh",
  },

  // 5. Favicons & Icons
  icons: {
    icon: "/backka.webp",
    shortcut: "/backka.webp",
    apple: "/backka.webp",
  },

  // 6. Verification (For Google Search Console)
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
      <AuthProvider>
        <body className={`${poppins.className} flex flex-col min-h-screen m-0 p-0 overflow-x-hidden`}>
          <Navbar />
          {children}
          <Toaster />
          <Footer />
        </body>
      </AuthProvider>

    </html>
  );
}
