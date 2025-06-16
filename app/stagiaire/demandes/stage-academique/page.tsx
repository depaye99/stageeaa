
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function DemandeStageAcademique() {
  const [user, setUser] = useState<any>(null)
  const [stagiaireInfo, setStagiaireInfo] = useState<any>(null)
  const [formData, setFormData] = useState({
    ecole: "",
    niveau: "",
    formation: "",
    specialite: "",
    jour: "",
    mois: "",
    annee: "",
    nombreMois: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
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

      if (!profile || profile.role !== "stagiaire") {
        router.push("/auth/login")
        return
      }

      setUser(profile)

      const { data: stagiaire } = await supabase
        .from("stagiaires")
        .select("*")
        .eq("user_id", profile.id)
        .single()

      setStagiaireInfo(stagiaire)
      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dateDebut = `${formData.annee}-${formData.mois.padStart(2, '0')}-${formData.jour.padStart(2, '0')}`
      
      const demandeData = {
        stagiaire_id: stagiaireInfo?.id,
        type: "stage_academique",
        titre: `Demande de stage académique - ${formData.formation}`,
        description: JSON.stringify({
          ecole: formData.ecole,
          niveau: formData.niveau,
          formation: formData.formation,
          specialite: formData.specialite,
          date_debut: dateDebut,
          duree_mois: formData.nombreMois
        }),
        statut: "en_attente",
        documents_requis: [
          "CV",
          "Certificat de scolarité",
          "Lettre de motivation",
          "Lettre de recommandation",
          "Pièce d'identité",
          "Plan de localisation"
        ]
      }

      const { error } = await supabase
        .from("demandes")
        .insert([demandeData])

      if (error) throw error

      toast({
        title: "Demande envoyée",
        description: "Votre demande de stage académique a été envoyée avec succès",
      })

      router.push("/stagiaire/demandes")
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre demande",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
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

      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Demande de stage académique</h1>
          <p className="text-gray-600">Remplissez le formulaire pour demander un stage académique</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations académiques */}
          <Card>
            <CardHeader>
              <CardTitle>Informations académiques</CardTitle>
              <CardDescription>Renseignez vos informations scolaires et universitaires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="ecole" className="text-lg font-medium">École / Université *</Label>
                  <Input
                    id="ecole"
                    name="ecole"
                    value={formData.ecole}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Nom de votre établissement"
                    required
                  />
                </div>

                <div>
                  <Label className="text-lg font-medium">Niveau d'études *</Label>
                  <Select value={formData.niveau} onValueChange={(value) => handleSelectChange("niveau", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionner votre niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bac+1">Bac+1</SelectItem>
                      <SelectItem value="bac+2">Bac+2</SelectItem>
                      <SelectItem value="bac+3">Bac+3</SelectItem>
                      <SelectItem value="bac+4">Bac+4</SelectItem>
                      <SelectItem value="bac+5">Bac+5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="formation" className="text-lg font-medium">Formation *</Label>
                  <Input
                    id="formation"
                    name="formation"
                    value={formData.formation}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Intitulé de votre formation"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="specialite" className="text-lg font-medium">Spécialité</Label>
                  <Input
                    id="specialite"
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Votre spécialité"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Période de stage */}
          <Card>
            <CardHeader>
              <CardTitle>Période de stage</CardTitle>
              <CardDescription>Indiquez la période souhaitée pour votre stage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-medium">Date de début *</Label>
                  <div className="flex space-x-2 mt-2">
                    <Select value={formData.jour} onValueChange={(value) => handleSelectChange("jour", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Jour" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={formData.mois} onValueChange={(value) => handleSelectChange("mois", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Mois" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
                        ].map((mois, i) => (
                          <SelectItem key={i} value={String(i + 1)}>
                            {mois}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={formData.annee} onValueChange={(value) => handleSelectChange("annee", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="nombreMois" className="text-lg font-medium">Durée (en mois) *</Label>
                  <Input
                    id="nombreMois"
                    name="nombreMois"
                    value={formData.nombreMois}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Ex: 3"
                    type="number"
                    min="1"
                    max="12"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents requis */}
          <Card>
            <CardHeader>
              <CardTitle>Documents requis</CardTitle>
              <CardDescription>
                Les documents suivants devront être fournis après validation de votre demande
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "CV",
                  "Certificat de scolarité",
                  "Lettre de motivation",
                  "Lettre de recommandation",
                  "Pièce d'identité",
                  "Plan de localisation"
                ].map((doc) => (
                  <div key={doc} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{doc}</p>
                    <p className="text-xs text-gray-400 mt-1">À fournir ultérieurement</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer la demande"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
