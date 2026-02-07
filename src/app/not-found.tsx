import { Home } from "lucide-react"

import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="space-y-4">
        <h1 className="text-6xl font-extrabold tracking-tighter text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-[500px]">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Overview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
