import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SubReminder | Success-Based Subscription Recovery",
  description: "Track all your subscriptions for free. We only charge if we save you money.",
};

import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ToastProvider } from "@/context/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-display antialiased bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100`}>
        <NextAuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
