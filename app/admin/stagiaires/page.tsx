
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { UserPlus, Plus, Edit, Eye, Search, Filter, School, Calendar, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function StagiairesPage() {
  const [user, setUser] = useState<any>(null)
  const [stagiaires, setStagiaires] = useState<any[]>([])
  const [filteredStagiaires, setFilteredStagiaires] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
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

        if (!profile || profile.role !== "admin") {
          router.push("/auth/login")
          return
        }

        setUser(profile)
        await loadStagiaires()
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  const loadStagiaires = async () => {
    try {
      const { data, error } = await supabase
        .from("stagiaires")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setStagiaires(data || [])
      setFilteredStagiaires(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des stagiaires:", error)
      // Mock data en cas d'erreur
      const mockData = [
        {
          id: "1",
          prenom: "Marie",
          nom: "Dupont",
          email: "marie.dupont@example.com",
          telephone: "0123456789",
          formation: "Master Informatique",
          ecole: "École Supérieure d'Informatique",
          departement: "Développement",
          tuteur: "Thomas Martin",
          statut: "actif",
          periode: "3 mois",
          dateDebut: "2025-01-15",
          dateFin: "2025-04-15",
          created_at: "2025-01-10"
        },
        {
          id: "2",
          prenom: "Pierre",
          nom: "Bernard",
          email: "pierre.bernard@example.com",
          telephone: "0987654321",
          formation: "License Commerce",
          ecole: "Université de Commerce",
          departement: "Marketing",
          tuteur: "Julie Petit",
          statut: "termine",
          periode: "6 mois",
          dateDebut: "2024-09-01",
          dateFin: "2025-02-28",
          created_at: "2024-08-25"
        }
      ]
      setStagiaires(mockData)
      setFilteredStagiaires(mockData)
    }
  }

  const handleSearch = () => {
    let filtered = stagiaires

    if (searchTerm) {
      filtered = filtered.filter(
        (stagiaire) =>
          stagiaire.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stagiaire.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stagiaire.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stagiaire.ecole?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((stagiaire) => stagiaire.statut === statusFilter)
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((stagiaire) => stagiaire.departement === departmentFilter)
    }

    setFilteredStagiaires(filtered)
  }

  useEffect(() => {
    handleSearch()
  }, [searchTerm, statusFilter, departmentFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "termine":
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>
      case "en_attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "suspendu":
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>
      default:
        return <Badge>{status}</Badge>
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des stagiaires</h1>
            <p className="text-gray-600">Superviser tous les stagiaires et leurs stages</p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau stagiaire
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un stagiaire..."
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
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Département" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    <SelectItem value="Développement">Développement</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStagiaires.map((stagiaire) => (
            <Card key={stagiaire.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <UserPlus className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{stagiaire.prenom} {stagiaire.nom}</CardTitle>
                      <p className="text-sm text-muted-foreground">{stagiaire.email}</p>
                    </div>
                  </div>
                  {getStatusBadge(stagiaire.statut)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <School className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <span className="font-medium">{stagiaire.formation}</span>
                      <p className="text-xs text-gray-500">{stagiaire.ecole}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{stagiaire.departement} • Tuteur: {stagiaire.tuteur}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{stagiaire.periode} • {stagiaire.dateDebut} - {stagiaire.dateFin}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Créé le {new Date(stagiaire.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/admin/stagiaires/${stagiaire.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStagiaires.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun stagiaire trouvé</h3>
            <p className="text-muted-foreground mb-4">Aucun stagiaire ne correspond à vos critères de recherche.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un nouveau stagiaire
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
