"use client"

import { demandesService } from "@/lib/services/demandes-service"
import { authService } from "@/lib/services/auth-service"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function TuteurDemandesPage() {
  const [user, setUser] = useState<any>(null)
  const [demandes, setDemandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
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
        if (!profileResult.profile || profileResult.profile.role !== "tuteur") {
          router.push("/auth/login")
          return
        }

        setUser(profileResult.profile)

        // Load demandes for this tuteur
        const demandesData = await demandesService.getAll({
          tuteurId: userResult.user.id,
          status: statusFilter !== "all" ? statusFilter : undefined,
          type: typeFilter !== "all" ? typeFilter : undefined,
        })
        setDemandes(demandesData || [])
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, statusFilter, typeFilter])

  const handleApprove = async (demandeId: string) => {
    try {
      await demandesService.approve(demandeId, user.id, "tuteur")

      // Reload demandes
      const demandesData = await demandesService.getAll({
        tuteurId: user.id,
        status: statusFilter !== "all" ? statusFilter : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      })
      setDemandes(demandesData || [])
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error)
    }
  }

  const handleReject = async (demandeId: string) => {
    try {
      await demandesService.reject(demandeId, user.id, "tuteur")

      // Reload demandes
      const demandesData = await demandesService.getAll({
        tuteurId: user.id,
        status: statusFilter !== "all" ? statusFilter : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      })
      setDemandes(demandesData || [])
    } catch (error) {
      console.error("Erreur lors du rejet:", error)
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

  const filteredDemandes = demandes.filter((demande) => {
    const matchesSearch =
      demande.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (demande.description && demande.description.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesSearch
  })
}
