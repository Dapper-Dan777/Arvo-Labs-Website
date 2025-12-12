import type { Metadata } from "next";
import React from "react";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Arvo } from "next/font/google";
import "./globals.css";
import ConditionalNavigation from "@/components/ConditionalNavigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageLoader from "@/components/PageLoader";

const arvo = Arvo({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-arvo',
});

export const metadata: Metadata = {
  title: "Arvo Labs",
  description: "Arvo Labs - Automatisierung und Produktivität",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInUrl="/"
      signUpUrl="/"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <ThemeProvider>
        <html lang="de" className={arvo.variable}>
          <head>
            <link href="https://fonts.cdnfonts.com/css/theoris" rel="stylesheet" />
          </head>
          <body>
            <PageLoader />
            <ConditionalNavigation />
            {children}
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}


