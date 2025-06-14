"use client"

import { documentsService } from "@/lib/services/documents-service"
import { authService } from "@/lib/services/auth-service"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RHDocumentsPage() {
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
        if (!profileResult.profile || profileResult.profile.role !== "rh") {
          router.push("/auth/login")
          return
        }

        setUser(profileResult.profile)

        // Load all documents for RH
        const documentsData = await documentsService.getAll({
          type: typeFilter !== "all" ? typeFilter : undefined,
          format: formatFilter !== "all" ? formatFilter : undefined,
        })
        setDocuments(documentsData || [])
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, typeFilter, formatFilter])

  const handleDownload = async (documentId: string) => {
    try {
      await documentsService.download(documentId)
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
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

    return matchesSearch
  })
}
