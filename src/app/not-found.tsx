import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-56px-3rem)]">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-muted-foreground/50">404</h1>
          <h2 className="text-2xl font-semibold">Stránka nenalezena</h2>
          <p className="text-muted-foreground max-w-md">
            Omlouváme se, ale požadovaná stránka neexistuje nebo byla přesunuta.
          </p>
        </div>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Zpět na úvod
          </Link>
        </Button>
      </div>
    </div>
  )
}
