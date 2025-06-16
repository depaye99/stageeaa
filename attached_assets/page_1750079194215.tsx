"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { demandesService } from "@/lib/services/demandes-service"
import { authService } from "@/lib/services/auth-service"

export default function DemandesPage() {
  const [user, setUser] = useState<any>(null)
  const [demandes, setDemandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
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
        if (!profileResult.profile || profileResult.profile.role !== "stagiaire") {
          router.push("/auth/login")
          return
        }

        setUser(profileResult.profile)

        // Load demandes for this stagiaire
        const demandesData = await demandesService.getAll({
          stagiaireId: userResult.user.id,
        })
        setDemandes(demandesData || [])
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

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

  const filteredDemandes = demandes.filter((demande) => {
    const matchesSearch =
      demande.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (demande.description && demande.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || demande.statut === statusFilter
    const matchesType = typeFilter === "all" || demande.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <div className="flex flex-1">
        <Sidebar role="stagiaire" />

        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Mes demandes</h1>
              <p className="text-gray-600">Gérez et suivez toutes vos demandes</p>
            </div>
            <div className="flex gap-2">
              <Link href="/stagiaire/demande/conge">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Demande de congé
                </Button>
              </Link>
              <Link href="/stagiaire/demande/prolongation">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Demande de prolongation
                </Button>
              </Link>
              <Link href="/stagiaire/demande/attestation">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="mr-2 h-4 w-4" /> Demande d'attestation
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une demande..."
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
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Validé">Validé</SelectItem>
                      <SelectItem value="Refusé">Refusé</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="stage_academique">Stage académique</SelectItem>
                      <SelectItem value="stage_professionnel">Stage professionnel</SelectItem>
                      <SelectItem value="conge">Congé</SelectItem>
                      <SelectItem value="prolongation">Prolongation</SelectItem>
                      <SelectItem value="attestation">Attestation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Détails
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDemandes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        Aucune demande trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredDemandes.map((demande) => (
                      <tr key={demande.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(demande.created_at).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {demande.type.replace("_", " ")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {demande.description || demande.titre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={`${
                              demande.statut === "approuve"
                                ? "bg-green-100 text-green-800"
                                : demande.statut === "refuse"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {demande.statut}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/stagiaire/demande/${demande.id}`}>
                            <Button variant="ghost" size="sm">
                              Voir détails
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredDemandes.length > 0 && (
              <div className="p-4 flex justify-between items-center border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Affichage de {filteredDemandes.length} demandes sur {demandes.length}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    ‹
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-50">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    ›
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
