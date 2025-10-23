import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IndiGLM - India's Advanced AI Platform",
  description: "IndiGLM is India's most advanced AI platform, offering cutting-edge language models with deep understanding of Indian languages, culture, and context.",
  keywords: ["IndiGLM", "AI", "India", "language models", "machine learning", "Indian languages", "cultural context"],
  authors: [{ name: "IndiGLM Team" }],
  icons: {
    icon: "/indiglm-logo.svg",
  },
  openGraph: {
    title: "IndiGLM - India's Advanced AI Platform",
    description: "India's most advanced AI platform with deep understanding of Indian languages and culture",
    url: "https://indiglm.com",
    siteName: "IndiGLM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IndiGLM - India's Advanced AI Platform",
    description: "India's most advanced AI platform with deep understanding of Indian languages and culture",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
