
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Search, Plus, Filter, Eye } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function DemandesPage() {
  const [user, setUser] = useState<any>(null)
  const [stagiaireInfo, setStagiaireInfo] = useState<any>(null)
  const [demandes, setDemandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push("/auth/login")
          return
        }

        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (!profile || profile.role !== "stagiaire") {
          router.push("/auth/login")
          return
        }

        setUser(profile)

        const { data: stagiaire } = await supabase
          .from("stagiaires")
          .select("*")
          .eq("user_id", profile.id)
          .single()

        setStagiaireInfo(stagiaire)

        if (stagiaire) {
          const { data: demandesData } = await supabase
            .from("demandes")
            .select("*")
            .eq("stagiaire_id", stagiaire.id)
            .order("created_at", { ascending: false })

          setDemandes(demandesData || [])
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const filteredDemandes = demandes.filter((demande) => {
    const matchesSearch =
      demande.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (demande.titre && demande.titre.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || demande.statut === statusFilter
    const matchesType = typeFilter === "all" || demande.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadgeClass = (statut: string) => {
    switch (statut) {
      case "approuvee":
        return "bg-green-100 text-green-800"
      case "rejetee":
        return "bg-red-100 text-red-800"
      case "en_cours":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-orange-100 text-orange-800"
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      "stage_academique": "Stage académique",
      "stage_professionnel": "Stage professionnel",
      "conge": "Congé",
      "prolongation": "Prolongation",
      "attestation": "Attestation"
    }
    return labels[type] || type
  }

  const getStatutLabel = (statut: string) => {
    const labels: { [key: string]: string } = {
      "en_attente": "En attente",
      "approuvee": "Approuvée",
      "rejetee": "Rejetée",
      "en_cours": "En cours",
      "terminee": "Terminée"
    }
    return labels[statut] || statut
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes demandes</h1>
              <p className="text-gray-600">Gérez et suivez toutes vos demandes</p>
            </div>
            <div className="flex gap-2">
              <Link href="/stagiaire/demandes/stage-academique">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Stage académique
                </Button>
              </Link>
              <Link href="/stagiaire/demandes/attestation">
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Attestation
                </Button>
              </Link>
            </div>
          </div>

          {/* Filtres */}
          <Card className="mb-6">
            <CardContent className="pt-6">
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
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="approuvee">Approuvée</SelectItem>
                      <SelectItem value="rejetee">Rejetée</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
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
            </CardContent>
          </Card>

          {/* Liste des demandes */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des demandes</CardTitle>
              <CardDescription>
                {filteredDemandes.length} demande(s) trouvée(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredDemandes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Aucune demande trouvée</p>
                  <Link href="/stagiaire/demandes/attestation">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Créer votre première demande
                    </Button>
                  </Link>
                </div>
              ) : (
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
                          Titre
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
                      {filteredDemandes.map((demande) => (
                        <tr key={demande.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(demande.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getTypeLabel(demande.type)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {demande.titre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusBadgeClass(demande.statut)}>
                              {getStatutLabel(demande.statut)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
