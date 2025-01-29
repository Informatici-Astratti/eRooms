import {
  ClerkProvider
} from '@clerk/nextjs'
import { itIT } from '@clerk/localizations'

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from '@/components/ui/toaster';

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "e-Rooms",
  description: "App per gestione di BNB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={itIT}>
      <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <main>
        {children}

        </main>
        <Toaster />
      </body>
      </html>
    </ClerkProvider>
    
  );
}
