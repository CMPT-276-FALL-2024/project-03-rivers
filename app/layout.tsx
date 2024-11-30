"use client";

import { useEffect } from "react";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import MenuBar from "@/components/menu-bar";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const handleFavoriteRemoved = () => {
      window.location.reload();
    };

    window.addEventListener('favoriteRemoved', handleFavoriteRemoved);

    return () => {
      window.removeEventListener('favoriteRemoved', handleFavoriteRemoved);
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="module"
          defer
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/spiral.js"
        ></script>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header>
              <MenuBar />
            </header>

            <main className="relative flex justify-center min-h-screen">
              {children}
            </main>   

            <footer>
              <Footer />
            </footer>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

