
"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/services/auth-service"
import { stagiaireService } from "@/lib/services/stagiaires-service"
import { evaluationsService } from "@/lib/services/evaluations-service"

export default function EvaluationsPage() {
  const [user, setUser] = useState<any>(null)
  const [stagiaires, setStagiaires] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        const userResult = await authService.getCurrentUser()
        if (!userResult) {
          router.push("/auth/login")
          return
        }

        const profileResult = await authService.getUserProfile(userResult.id)
        if (!profileResult.profile || profileResult.profile.role !== "tuteur") {
          router.push("/auth/login")
          return
        }

        setUser(profileResult.profile)

        // Récupérer les stagiaires assignés à ce tuteur
        const stagiairesData = await stagiairesService.getAll({
          tuteurId: userResult.user.id,
          status: statusFilter !== "all" ? statusFilter : undefined,
        })
        
        // Enrichir avec les évaluations
        const stagiairesWithEvaluations = await Promise.all(
          (stagiairesData || []).map(async (stagiaire) => {
            try {
              const evaluations = await evaluationsService.getByStadiaire(stagiaire.id)
              return { ...stagiaire, evaluations: evaluations || [] }
            } catch (error) {
              console.error(`Erreur lors de la récupération des évaluations pour ${stagiaire.id}:`, error)
              return { ...stagiaire, evaluations: [] }
            }
          })
        )

        setStagiaires(stagiairesWithEvaluations)
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, statusFilter])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    )
  }

  const filteredStagiaires = stagiaires.filter((stagiaire) => {
    const matchesSearch =
      stagiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stagiaire.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stagiaire.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || stagiaire.statut === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <div className="flex flex-1">
        <Sidebar role="tuteur" />

        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Évaluations des stagiaires</h1>
              <p className="text-gray-600">Gérez et suivez les évaluations de vos stagiaires</p>
            </div>
            <Link href="/tuteur/evaluations/new">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="mr-2 h-4 w-4" /> Nouvelle évaluation
              </Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Rechercher un stagiaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom, prénom ou email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Statut" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="termine">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStagiaires.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun stagiaire trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              filteredStagiaires.map((stagiaire) => (
                <Card key={stagiaire.id} className="overflow-hidden">
                  <div className="h-2 bg-blue-500"></div>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-lg font-medium">
                          {stagiaire.prenom.charAt(0)}
                          {stagiaire.nom.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {stagiaire.prenom} {stagiaire.nom}
                          </h3>
                          <p className="text-sm text-gray-500">{stagiaire.specialite}</p>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          stagiaire.statut === "actif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {stagiaire.statut === "actif" ? "Actif" : "Terminé"}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Période:</span>
                        <span>
                          {stagiaire.date_debut_stage && stagiaire.date_fin_stage
                            ? `${new Date(stagiaire.date_debut_stage).toLocaleDateString("fr-FR")} - ${new Date(
                                stagiaire.date_fin_stage
                              ).toLocaleDateString("fr-FR")}`
                            : "Non définie"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Établissement:</span>
                        <span>{stagiaire.etablissement || "Non renseigné"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Évaluations:</span>
                        <span>{stagiaire.evaluations?.length || 0}</span>
                      </div>
                    </div>

                    {stagiaire.evaluations && stagiaire.evaluations.length > 0 ? (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Dernière évaluation</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= (stagiaire.evaluations[0].note_globale || 0)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          {stagiaire.evaluations[0].commentaire}
                        </p>
                      </div>
                    ) : null}

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/tuteur/stagiaires/${stagiaire.id}`}>Profil</Link>
                      </Button>
                      <Button className="flex-1" asChild>
                        <Link href={`/tuteur/evaluations/new?stagiaireId=${stagiaire.id}`}>Évaluer</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
