
"use client"

import { stagiaireService } from "@/lib/services/stagiaires-service"
import { authService } from "@/lib/services/auth-service"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StagiairesPage() {
  const [user, setUser] = useState<any>(null)
  const [stagiaires, setStagiaires] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
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
        if (!profileResult.profile || profileResult.profile.role !== "admin") {
          router.push("/auth/login")
          return
        }

        setUser(profileResult.profile)

        // Load all stagiaires
        const stagiairesResult = await stagiaireService.getStagiaires({
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: searchTerm || undefined,
          department: departmentFilter !== "all" ? departmentFilter : undefined,
        })
        const stagiairesData = stagiairesResult.data || []
        setStagiaires(stagiairesData)
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, statusFilter, searchTerm, departmentFilter])

  const handleDelete = async (stagiaireId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire ?")) return

    try {
      await stagiaireService.delete(stagiaireId)

      // Reload stagiaires
      const stagiairesResult = await stagiaireService.getStagiaires({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
        department: departmentFilter !== "all" ? departmentFilter : undefined,
      })
      const stagiairesData = stagiairesResult.data || []
      setStagiaires(stagiairesData)
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

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des Stagiaires</h1>
        <Link href="/admin/stagiaires/create">
          <Button>Ajouter un Stagiaire</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          type="text"
          placeholder="Rechercher par nom, prénom, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="actif">Actif</SelectItem>
            <SelectItem value="termine">Terminé</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrer par département" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les départements</SelectItem>
            <SelectItem value="informatique">Informatique</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="rh">RH</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableCaption>Liste des stagiaires inscrits.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Nom</TableHead>
            <TableHead>Établissement</TableHead>
            <TableHead>Spécialité</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stagiaires.map((stagiaire) => (
            <tr key={stagiaire.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {stagiaire.prenom?.[0]?.toUpperCase()}
                      {stagiaire.nom?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {stagiaire.prenom} {stagiaire.nom}
                    </div>
                    <div className="text-sm text-gray-500">{stagiaire.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stagiaire.etablissement}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stagiaire.specialite}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(stagiaire.date_debut).toLocaleDateString("fr-FR")} -{" "}
                {new Date(stagiaire.date_fin).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  className={`${
                    stagiaire.statut === "actif"
                      ? "bg-green-100 text-green-800"
                      : stagiaire.statut === "termine"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {stagiaire.statut}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link href={`/admin/stagiaires/${stagiaire.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(stagiaire.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              {stagiaires.length} stagiaires
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
