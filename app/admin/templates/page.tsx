
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { FileText, Plus, Edit, Trash2, Download, Eye, Search, Filter } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DocumentTemplate {
  id: string
  name: string
  type: "convention" | "attestation" | "rapport" | "lettre"
  description: string
  lastModified: string
  createdBy: string
  status: "active" | "draft" | "archived"
  variables: string[]
}

const mockTemplates: DocumentTemplate[] = [
  {
    id: "1",
    name: "Convention de stage académique",
    type: "convention",
    description: "Modèle standard pour les conventions de stage académique",
    lastModified: "15/05/2025",
    createdBy: "Marie Dupont",
    status: "active",
    variables: ["nom_stagiaire", "prenom_stagiaire", "ecole", "periode", "tuteur"],
  },
  {
    id: "2",
    name: "Attestation de fin de stage",
    type: "attestation",
    description: "Attestation délivrée à la fin du stage",
    lastModified: "10/05/2025",
    createdBy: "Thomas Martin",
    status: "active",
    variables: ["nom_stagiaire", "prenom_stagiaire", "date_debut", "date_fin", "evaluation"],
  },
  {
    id: "3",
    name: "Rapport d'évaluation",
    type: "rapport",
    description: "Rapport d'évaluation mensuel du stagiaire",
    lastModified: "08/05/2025",
    createdBy: "Julie Petit",
    status: "draft",
    variables: ["nom_stagiaire", "competences", "commentaires", "note_globale"],
  },
]

export default function TemplatesPage() {
  const [user, setUser] = useState<any>(null)
  const [templates, setTemplates] = useState(mockTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState(mockTemplates)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
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
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  const handleSearch = () => {
    let filtered = templates

    if (searchTerm) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((template) => template.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((template) => template.type === typeFilter)
    }

    setFilteredTemplates(filtered)
  }

  useEffect(() => {
    handleSearch()
  }, [searchTerm, statusFilter, typeFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Brouillon</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archivé</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "convention":
        return "Convention"
      case "attestation":
        return "Attestation"
      case "rapport":
        return "Rapport"
      case "lettre":
        return "Lettre"
      default:
        return type
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
            <h1 className="text-3xl font-bold text-gray-900">Modèles de documents</h1>
            <p className="text-gray-600">Gérer les modèles de documents pour la génération automatique</p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau modèle
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un modèle..."
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
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
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
                    <SelectItem value="convention">Convention</SelectItem>
                    <SelectItem value="attestation">Attestation</SelectItem>
                    <SelectItem value="rapport">Rapport</SelectItem>
                    <SelectItem value="lettre">Lettre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{getTypeLabel(template.type)}</p>
                    </div>
                  </div>
                  {getStatusBadge(template.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{template.description}</p>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Variables disponibles:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 3).map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                    {template.variables.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.variables.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Modifié le {template.lastModified}</p>
                  <p>Par {template.createdBy}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Aperçu
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun modèle trouvé</h3>
            <p className="text-muted-foreground mb-4">Aucun modèle ne correspond à vos critères de recherche.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer un nouveau modèle
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
