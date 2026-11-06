import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import GlobalAuthGate from "@/components/GlobalAuthGate";
import TelegramWebAppInit from "@/components/TelegramWebAppInit";

export const metadata: Metadata = {
  title: "Prepora — Complete IELTS & SAT Preparation Platform",
  description: "Prepora is an AI-powered education platform for IELTS Academic, General Training, and the SAT with interactive testing, AI evaluation, and full mock exams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased selection:bg-blue-900 selection:text-white">
        <GlobalAuthGate />
        <TelegramWebAppInit />
        {children}
      </body>
    </html>
  );
}
