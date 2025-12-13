import type { Metadata } from "next";
import React from "react";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import ConditionalNavigation from "@/components/ConditionalNavigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageLoader from "@/components/PageLoader";

/* ============================================
   MODERNE SAAS-TYPOGRAFIE - GOOGLE FONTS
   ============================================
   Design-Update: Ersetzt Serif-Schrift (Arvo) durch moderne Sans-Serif-Kombination
   
   Neue Font-Token:
   - --font-heading: Space Grotesk
     → Verwendet für: H1-H6, Logo, wichtige Überschriften
     → Gewichte: 400, 500, 600, 700
     → Modern, professionell, nicht "KI-generiert" wirkend
   
   - --font-body: Inter
     → Verwendet für: Body-Text, Fließtext, Labels, kleine Texte
     → Gewichte: 400, 500, 600
     → Optimiert für Bildschirmlesbarkeit, hohe Lesbarkeit
   
   Beide Fonts werden über Google Fonts geladen und sind als CSS-Variablen
   verfügbar für konsistente Verwendung im gesamten Design-System.
   ============================================ */
const spaceGrotesk = Space_Grotesk({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const inter = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
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
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <ThemeProvider>
        <html lang="de" className={`${spaceGrotesk.variable} ${inter.variable}`}>
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


