import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p>We are sorry, this page is under construction.</p>
      <Link 
        href="/"
        className="text-primary hover:underline"
      >
        Go back to home
      </Link>
    </div>
  )
}

