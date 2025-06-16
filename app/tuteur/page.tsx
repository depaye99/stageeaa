
"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/services/auth-service"
import { demandesService } from "@/lib/services/demandes-service"
import { stagiairesService } from "@/lib/services/stagiaires-service"

export default function TuteurDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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

        // Récupérer les statistiques du tuteur
        const dashboardResponse = await fetch(`/api/dashboard?userId=${userResult.user.id}&role=tuteur`)
        const dashboardStats = await dashboardResponse.json()

        // Récupérer les demandes récentes pour ce tuteur
        const demandesData = await demandesService.getAll({
          tuteurId: userResult.user.id,
          limit: 5,
        })

        setStats({
          ...dashboardStats,
          recentDemandes: demandesData || [],
        })
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "En attente": { color: "bg-orange-100 text-orange-800", text: "En attente" },
      "Validé": { color: "bg-green-100 text-green-800", text: "Validé" },
      "Rejeté": { color: "bg-red-100 text-red-800", text: "Rejeté" },
      "en_attente": { color: "bg-orange-100 text-orange-800", text: "En attente" },
      "approuve": { color: "bg-green-100 text-green-800", text: "Approuvé" },
      "refuse": { color: "bg-red-100 text-red-800", text: "Refusé" },
    }

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", text: status }
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    )
  }

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <div className="flex flex-1">
        <Sidebar role="tuteur" />

        <main className="flex-1 p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Tableau de bord - Tuteur</h1>
            <p className="text-gray-600">
              Bienvenue {user?.first_name || user?.name}. Voici un aperçu de vos stagiaires et demandes.
            </p>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border border-gray-200 rounded-lg">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold">{stats?.stagiaires_total || 0}</span>
                  <div className="ml-2 w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Mes stagiaires</h3>
                <p className="text-sm text-gray-600">Stagiaires sous votre supervision</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-lg">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold">{stats?.demandes_en_cours || 0}</span>
                  <div className="ml-2 w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Demandes en attente</h3>
                <p className="text-sm text-gray-600">À valider ou traiter</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-lg">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold">{stats?.demandes_validees || 0}</span>
                  <div className="ml-2 w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Demandes validées</h3>
                <p className="text-sm text-gray-600">Ce mois-ci</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-lg">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold">{stats?.evaluations_a_faire || 0}</span>
                  <div className="ml-2 w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Évaluations à faire</h3>
                <p className="text-sm text-gray-600">En attente de votre évaluation</p>
              </CardContent>
            </Card>
          </div>

          {/* Demandes récentes */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Demandes récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentDemandes && stats.recentDemandes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stagiaire</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Détails</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.recentDemandes.map((demande) => (
                        <tr key={demande.id}>
                          <td className="px-6 py-4 text-sm">{formatDate(demande.created_at)}</td>
                          <td className="px-6 py-4 text-sm">
                            {demande.stagiaires?.profiles?.first_name} {demande.stagiaires?.profiles?.last_name}
                          </td>
                          <td className="px-6 py-4 text-sm">{demande.type}</td>
                          <td className="px-6 py-4">{getStatusBadge(demande.statut)}</td>
                          <td className="px-6 py-4 text-sm">{demande.titre || demande.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucune demande récente
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          {stats?.demandes_en_cours > 0 && (
            <div className="mt-6 bg-blue-100 border border-blue-300 rounded-lg p-4">
              <p className="text-blue-800 font-medium">Notification</p>
              <p className="text-blue-700">
                Vous avez {stats.demandes_en_cours} demande(s) en attente de validation
              </p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
