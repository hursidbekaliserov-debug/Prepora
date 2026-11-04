import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased selection:bg-blue-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
