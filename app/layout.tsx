import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vortex Manager",
  description: "Админка, ёпт",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            <div className="dark bg-obackground min-h-screen text-otext">
              {children}
            </div>
          </Providers>
        </body>
    </html>
  );
}
