import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Header showAuth />

      <main className="flex-1">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Bienvenue sur
                <br />
                Bridge Technologies Solutions
              </h1>

              <p className="text-xl text-gray-800 leading-relaxed">
                Explorez et soumettez vos demandes de stage en toute simplicité grâce à notre plateforme intuitive.
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-4 right-4 w-24 h-24 bg-blue-600 rounded-full"></div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="Workspace with laptop"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-16 space-y-8">
            <h2 className="text-3xl font-bold text-white">Commencez dès maintenant et boostez votre carrière !</h2>
            <p className="text-lg text-gray-800">
              Déposez votre candidature en un click et suivez son avancé en temps réel
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8">
                  Commencer →
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="px-8 bg-white">
                  J'ai déjà un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
