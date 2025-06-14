import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-xl">Page non trouvée</h2>
      <p className="text-muted-foreground text-center max-w-md">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Button asChild>
        <Link href="/">
          Retour à l'accueil
        </Link>
      </Button>
    </div>
  )
}
