"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"
import { stagiairesApiService, demandesApiService, documentsApiService } from "@/lib/services/api"
import { authService } from "@/lib/services/auth-service"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    stagiaires: { total: 0, actifs: 0, termines: 0, en_attente: 0 },
    demandes: { total: 0, en_attente: 0, validees: 0, refusees: 0 },
    documents: { total: 0, par_format: {}, par_type: {} },
  })
  const [recentDemandes, setRecentDemandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Vérifier l'authentification
      const userResult = await authService.getCurrentUser()
      if (!userResult) {
        router.push("/auth/login")
        return
      }

      const profile = await authService.getUserProfile(userResult.id)
      if (!profile.profile || profile.profile.role !== "admin") {
        router.push("/auth/login")
        return
      }

      setUser(profile.profile)

      // Charger les statistiques en parallèle
      const [stagiaireStats, demandeStats, documentStats, demandes] = await Promise.all([
        stagiairesApiService.getStagiairesStats(),
        demandesApiService.getDemandesStats(),
        documentsApiService.getDocumentsStats(),
        demandesApiService.getAllDemandes(),
      ])

      setStats({
        stagiaires: {
          total: stagiaireStats.total || 0,
          actifs: stagiaireStats.actifs || 0,
          termines: stagiaireStats.inactifs || 0,
          en_attente: 0
        },
        demandes: {
          total: demandeStats.total || 0,
          en_attente: demandeStats.en_attente || 0,
          validees: demandeStats.approuvees || 0,
          refusees: demandeStats.refusees || 0
        },
        documents: {
          total: documentStats.total || 0,
          par_format: {},
          par_type: documentStats.par_type || {}
        },
      })

      // Prendre les 5 dernières demandes
      setRecentDemandes(demandes.slice(0, 5))
    } catch (error) {
      console.error("Erreur lors du chargement du dashboard:", error)
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "En attente":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            En attente
          </Badge>
        )
      case "Validé":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Validé
          </Badge>
        )
      case "Refusé":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Refusé
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      stage_academique: "Stage Académique",
      stage_professionnel: "Stage Professionnel",
      conge: "Congé",
      prolongation: "Prolongation",
      attestation: "Attestation",
    }
    return types[type] || type
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
          <p className="text-gray-600">Vue d'ensemble de la plateforme Bridge</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/stagiaires">Gérer les stagiaires</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/reports">Rapports</Link>
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stagiaires Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stagiaires.actifs}</div>
            <p className="text-xs text-muted-foreground">sur {stats.stagiaires.total} stagiaires au total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes en cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.demandes.en_attente}</div>
            <p className="text-xs text-muted-foreground">sur {stats.demandes.total} demandes au total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documents.total}</div>
            <p className="text-xs text-muted-foreground">documents stockés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de validation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.demandes.total > 0 ? Math.round((stats.demandes.validees / stats.demandes.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">{stats.demandes.validees} demandes validées</p>
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes récentes</CardTitle>
          <CardDescription>Les dernières demandes soumises sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDemandes.length > 0 ? (
              recentDemandes.map((demande) => (
                <div key={demande.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {demande.statut === "En attente" && <Clock className="h-5 w-5 text-yellow-500" />}
                      {demande.statut === "Validé" && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {demande.statut === "Refusé" && <AlertCircle className="h-5 w-5 text-red-500" />}
                    </div>
                    <div>
                      <p className="font-medium">
                        {demande.stagiaire?.prenom} {demande.stagiaire?.nom}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getTypeLabel(demande.type)} • {new Date(demande.date).toLocaleDateString("fr-FR")}
                      </p>
                      {demande.tuteur?.name && <p className="text-xs text-gray-500">Tuteur: {demande.tuteur.name}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(demande.statut)}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/demandes/${demande.id}`}>Voir</Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Aucune demande récente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}