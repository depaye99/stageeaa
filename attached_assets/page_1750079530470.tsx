"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface TestEntity {
  id: string
  name: string
  description: string
  status: string
  created_at: string
}

export default function TestCrudPage() {
  const [entities, setEntities] = useState<TestEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active"
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  // Fonction pour charger les entités
  const loadEntities = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/test-entities")
      if (!response.ok) throw new Error("Erreur lors du chargement")
      const result = await response.json()
      setEntities(result.data || [])
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les entités",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour créer/modifier une entité
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId ? `/api/test-entities/${editingId}` : "/api/test-entities"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde")

      toast({
        title: "Succès",
        description: `Entité ${editingId ? "modifiée" : "créée"} avec succès`
      })

      setFormData({ name: "", description: "", status: "active" })
      setEditingId(null)
      loadEntities()
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'entité",
        variant: "destructive"
      })
    }
  }

  // Fonction pour supprimer une entité
  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette entité ?")) return

    try {
      const response = await fetch(`/api/test-entities/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Erreur lors de la suppression")

      toast({
        title: "Succès",
        description: "Entité supprimée avec succès"
      })

      loadEntities()
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entité",
        variant: "destructive"
      })
    }
  }

  // Fonction pour éditer une entité
  const handleEdit = (entity: TestEntity) => {
    setFormData({
      name: entity.name,
      description: entity.description,
      status: entity.status
    })
    setEditingId(entity.id)
  }

  // Charger les entités au montage du composant
  useEffect(() => {
    loadEntities()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Chargement...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Test CRUD</h1>
        <Button onClick={() => {
          setFormData({ name: "", description: "", status: "active" })
          setEditingId(null)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle entité
        </Button>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Modifier" : "Créer"} une entité</CardTitle>
          <CardDescription>
            {editingId ? "Modifiez les informations de l'entité" : "Ajoutez une nouvelle entité de test"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Modifier" : "Créer"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({ name: "", description: "", status: "active" })
                    setEditingId(null)
                  }}
                >
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Liste des entités */}
      <Card>
        <CardHeader>
          <CardTitle>Entités de test</CardTitle>
          <CardDescription>
            {entities.length} entité{entities.length > 1 ? "s" : ""} trouvée{entities.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entities.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Aucune entité trouvée
            </div>
          ) : (
            <div className="space-y-4">
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{entity.name}</h3>
                      <Badge variant={entity.status === "active" ? "default" : "secondary"}>
                        {entity.status}
                      </Badge>
                    </div>
                    {entity.description && (
                      <p className="text-sm text-muted-foreground">{entity.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Créé le {new Date(entity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(entity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(entity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}