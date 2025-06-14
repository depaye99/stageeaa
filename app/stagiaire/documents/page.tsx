"use client"

import type React from "react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, Download, Trash2, FileText, FileImage, FileIcon as FilePdf } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { documentsService } from "@/lib/services/documents-service"
import { authService } from "@/lib/services/auth-service"
import { useRouter } from "next/navigation"

export default function DocumentsPage() {
  const [user, setUser] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [formatFilter, setFormatFilter] = useState("all")
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

        // Load documents for this stagiaire
        const documentsData = await documentsService.getAll({
          stagiaireId: userResult.user.id,
        })
        setDocuments(documentsData || [])
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const file = formData.get("file") as File
    const nom = formData.get("nom") as string
    const description = formData.get("description") as string
    const type = formData.get("type") as string

    if (!file || !nom || !user) return

    try {
      await documentsService.upload(file, {
        nom,
        description,
        type,
        stagiaire_id: user.id,
      })

      // Reload documents
      const documentsData = await documentsService.getAll({
        stagiaireId: user.id,
      })
      setDocuments(documentsData || [])
    } catch (error) {
      console.error("Erreur lors de l'upload:", error)
    }
  }

  const handleDownload = async (documentId: string) => {
    try {
      await documentsService.download(documentId)
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
    }
  }

  const handleDelete = async (documentId: string) => {
    try {
      await documentsService.delete(documentId)

      // Reload documents
      const documentsData = await documentsService.getAll({
        stagiaireId: user.id,
      })
      setDocuments(documentsData || [])
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
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

  const filteredDocuments = documents.filter((document) => {
    const matchesSearch =
      document.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (document.description && document.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFormat = formatFilter === "all" || document.format === formatFilter
    const matchesType = typeFilter === "all" || document.type === typeFilter

    return matchesSearch && matchesFormat && matchesType
  })

  const getDocumentIcon = (format: string) => {
    switch (format) {
      case "PDF":
        return <FilePdf className="h-5 w-5" />
      case "DOC":
        return <FileText className="h-5 w-5" />
      case "IMG":
        return <FileImage className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getDocumentColor = (format: string) => {
    switch (format) {
      case "PDF":
        return "bg-red-100 text-red-600"
      case "DOC":
        return "bg-blue-100 text-blue-600"
      case "IMG":
        return "bg-green-100 text-green-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <div className="flex flex-1">
        <Sidebar role="stagiaire" />

        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Mes documents</h1>
              <p className="text-gray-600">Gérez tous vos documents</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter un document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau document</DialogTitle>
                  <DialogDescription>Téléchargez un nouveau document à votre dossier</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFileUpload}>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="nom" className="text-right">
                        Nom du document
                      </Label>
                      <Input id="nom" name="nom" className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea id="description" name="description" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="type" className="text-right">
                        Type de document
                      </Label>
                      <Select name="type" required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cv">CV</SelectItem>
                          <SelectItem value="lettre_motivation">Lettre de motivation</SelectItem>
                          <SelectItem value="lettre_recommandation">Lettre de recommandation</SelectItem>
                          <SelectItem value="piece_identite">Pièce d'identité</SelectItem>
                          <SelectItem value="certificat_scolarite">Certificat de scolarité</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="file" className="text-right">
                        Fichier
                      </Label>
                      <Input type="file" name="file" className="mt-1" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Télécharger</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un document..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={formatFilter} onValueChange={setFormatFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Format" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les formats</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="DOC">DOC</SelectItem>
                      <SelectItem value="IMG">Image</SelectItem>
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
                      <SelectItem value="cv">CV</SelectItem>
                      <SelectItem value="lettre_motivation">Lettre de motivation</SelectItem>
                      <SelectItem value="lettre_recommandation">Lettre de recommandation</SelectItem>
                      <SelectItem value="piece_identite">Pièce d'identité</SelectItem>
                      <SelectItem value="certificat_scolarite">Certificat de scolarité</SelectItem>
                      <SelectItem value="convention">Convention</SelectItem>
                      <SelectItem value="attestation">Attestation</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun document trouvé</h3>
                <p className="text-gray-500">
                  Essayez de modifier vos critères de recherche ou ajoutez un nouveau document
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-md ${getDocumentColor(document.format)}`}>
                        {getDocumentIcon(document.format)}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDownload(document.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(document.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-medium text-gray-900 mb-1 truncate">{document.nom}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{document.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{document.date}</span>
                      <span>{document.taille}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {document.type.replace("_", " ")}
                        </span>
                        <span className="text-xs font-medium text-gray-900">{document.format}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredDocuments.length > 0 && (
              <div className="p-4 flex justify-between items-center border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Affichage de {filteredDocuments.length} documents sur {documents.length}
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
