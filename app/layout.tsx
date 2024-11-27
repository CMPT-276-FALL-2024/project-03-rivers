import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import MenuBar from "@/components/menu-bar";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Footer } from "@/components/footer";
// import { PageTransition } from "@/components/page-transition";

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

export const metadata: Metadata = {
  title: "RNA",
  description: "Recipe and Nutrition Searching App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
            {/* <PageTransition>
                {children}
            </PageTransition> */}


            <footer>
              <Footer />
            </footer>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

