"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Users, FileText, Calendar, TrendingUp, Settings, UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DashboardStats {
  users_total: number
  stagiaires_total: number
  demandes_total: number
  demandes_en_attente: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/login")
        return
      }

      // Récupérer le profil utilisateur
      const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

      if (!profile || profile.role !== "admin") {
        router.push("/auth/login")
        return
      }

      setUser(profile)
      await loadStats()
      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const loadStats = async () => {
    try {
      const [usersCount, stagiairesCount, demandesCount, demandesEnAttenteCount] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("stagiaires").select("id", { count: "exact", head: true }),
        supabase.from("demandes").select("id", { count: "exact", head: true }),
        supabase.from("demandes").select("id", { count: "exact", head: true }).eq("statut", "en_attente"),
      ])

      setStats({
        users_total: usersCount.count || 0,
        stagiaires_total: stagiairesCount.count || 0,
        demandes_total: demandesCount.count || 0,
        demandes_en_attente: demandesEnAttenteCount.count || 0,
      })
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
          <p className="text-gray-600">Bienvenue, {user?.name}</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.users_total || 0}</div>
              <p className="text-xs text-muted-foreground">Total des utilisateurs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stagiaires</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.stagiaires_total || 0}</div>
              <p className="text-xs text-muted-foreground">Stagiaires actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demandes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.demandes_total || 0}</div>
              <p className="text-xs text-muted-foreground">Total des demandes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.demandes_en_attente || 0}</div>
              <p className="text-xs text-muted-foreground">Demandes en attente</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>Gérer les comptes utilisateurs et leurs rôles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/admin/users")}>
                <Users className="mr-2 h-4 w-4" />
                Gérer les utilisateurs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des stagiaires</CardTitle>
              <CardDescription>Superviser tous les stagiaires et leurs stages</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/admin/stagiaires")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Gérer les stagiaires
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Demandes</CardTitle>
              <CardDescription>Traiter les demandes en attente</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/admin/demandes")}>
                <FileText className="mr-2 h-4 w-4" />
                Voir les demandes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rapports</CardTitle>
              <CardDescription>Générer des rapports et statistiques</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/admin/reports")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Voir les rapports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
              <CardDescription>Configuration du système</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/admin/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
