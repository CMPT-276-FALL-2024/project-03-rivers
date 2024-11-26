import Link from 'next/link'
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex flex-wrap justify-center gap-6 mb-6">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/recipe" className="text-muted-foreground hover:text-primary transition-colors">
            Search Recipe
          </Link>
          <Link href="/calendar" className="text-muted-foreground hover:text-primary transition-colors">
            View Plan
          </Link>
          <Link href="/developers" className="text-muted-foreground hover:text-primary transition-colors">
            Developers
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </nav>
        <Separator className="mb-6" />
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CMPT276 - Rivers. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

