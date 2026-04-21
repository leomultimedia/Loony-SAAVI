"use client";

import { useEffect, useState } from 'react';
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState<'ironman' | 'professional'>('ironman');

  useEffect(() => {
    // Initial load
    const saved = localStorage.getItem('vanguard_theme') as any;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'ironman' ? 'professional' : 'ironman';
    setTheme(next);
    localStorage.setItem('vanguard_theme', next);
  };

  return (
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
        {children}

        {/* Global Theme Toggle Widget */}
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
            <button 
              onClick={toggleTheme}
              className="p-4 rounded-full glass-panel shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition group relative"
            >
                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none ${theme === 'ironman' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                {theme === 'ironman' ? (
                    <span className="text-xl group-hover:rotate-12 transition">🛡️</span>
                ) : (
                    <span className="text-xl group-hover:rotate-12 transition">💼</span>
                )}
            </button>
            <div className="text-[9px] font-mono font-bold text-center uppercase tracking-widest opacity-40">
                Switch_HUD
            </div>
        </div>
      </body>
    </html>
  );
}
