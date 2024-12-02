import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import MenuBar from "@/components/menu-bar";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Footer } from "@/components/footer";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";
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
          
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <DynamicBreadcrumb />                
                </div>

                <ModeToggle />
              </header>
              <main>
                {children}
              </main>
              <footer >
                <Footer />
              </footer>
            </SidebarInset>
          </SidebarProvider>    

          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

