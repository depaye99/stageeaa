"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdvancedSearch } from "@/components/ui/advanced-search"
import { ExportMenu } from "@/components/ui/export-menu"
import { FileText, Plus, Edit, Trash2, Download, Eye } from "lucide-react"
import { useState } from "react"

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
  const user = { name: "ADMINISTRATEUR", role: "admin" }
  const [templates, setTemplates] = useState(mockTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState(mockTemplates)

  const handleSearch = (query: string, filters: any) => {
    let filtered = templates

    if (query) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(query.toLowerCase()) ||
          template.description.toLowerCase().includes(query.toLowerCase()),
      )
    }

    if (filters.status) {
      filtered = filtered.filter((template) => template.status === filters.status)
    }

    if (filters.type) {
      filtered = filtered.filter((template) => template.type === filters.type)
    }

    setFilteredTemplates(filtered)
  }

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <div className="flex flex-1">
        <Sidebar role="admin" />

        <main className="flex-1 p-6 bg-background">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Modèles de documents</h1>
              <p className="text-muted-foreground">Gérer les modèles de documents pour la génération automatique</p>
            </div>
            <div className="flex gap-2">
              <ExportMenu type="documents" data={filteredTemplates} />
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau modèle
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <AdvancedSearch
                onSearch={handleSearch}
                searchPlaceholder="Rechercher un modèle..."
                filterOptions={{
                  status: ["active", "draft", "archived"],
                  type: ["convention", "attestation", "rapport", "lettre"],
                }}
              />
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

      <Footer />
    </div>
  )
}
