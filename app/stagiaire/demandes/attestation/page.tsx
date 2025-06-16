
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/layout/header"
import { ArrowLeft, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function DemandeAttestation() {
  const [user, setUser] = useState<any>(null)
  const [stagiaireInfo, setStagiaireInfo] = useState<any>(null)
  const [typeAttestation, setTypeAttestation] = useState("presence")
  const [autreType, setAutreType] = useState("")
  const [motif, setMotif] = useState("")
  const [destinataire, setDestinataire] = useState("")
  const [informations, setInformations] = useState("")
  const [formatLivraison, setFormatLivraison] = useState("pdf")
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
      const demandeData = {
        stagiaire_id: stagiaireInfo?.id,
        type: "attestation",
        titre: `Demande d'attestation - ${typeAttestation === "autre" ? autreType : typeAttestation}`,
        description: JSON.stringify({
          type_attestation: typeAttestation === "autre" ? autreType : typeAttestation,
          motif,
          destinataire,
          informations_supplementaires: informations,
          format_livraison: formatLivraison
        }),
        statut: "en_attente"
      }

      const { error } = await supabase
        .from("demandes")
        .insert([demandeData])

      if (error) throw error

      toast({
        title: "Demande envoyée",
        description: "Votre demande d'attestation a été envoyée avec succès",
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

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Demande d'attestation</h1>
          <p className="text-gray-600">Remplissez le formulaire pour demander une attestation</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la demande</CardTitle>
            <CardDescription>
              Veuillez remplir tous les champs requis pour votre demande d'attestation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-lg font-medium">Type d'attestation *</Label>
                <RadioGroup 
                  value={typeAttestation} 
                  onValueChange={setTypeAttestation} 
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="presence" id="presence" />
                    <Label htmlFor="presence" className="font-normal">
                      Attestation de présence
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stage" id="stage" />
                    <Label htmlFor="stage" className="font-normal">
                      Attestation de stage
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fin" id="fin" />
                    <Label htmlFor="fin" className="font-normal">
                      Attestation de fin de stage
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="autre" id="autre" />
                    <Label htmlFor="autre" className="font-normal">
                      Autre (préciser)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {typeAttestation === "autre" && (
                <div>
                  <Label htmlFor="autreType" className="text-lg font-medium">
                    Précisez le type d'attestation *
                  </Label>
                  <Input
                    id="autreType"
                    value={autreType}
                    onChange={(e) => setAutreType(e.target.value)}
                    className="mt-2"
                    placeholder="Type d'attestation souhaité"
                    required={typeAttestation === "autre"}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="motif" className="text-lg font-medium">
                  Motif de la demande *
                </Label>
                <Textarea
                  id="motif"
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  className="mt-2 min-h-[120px]"
                  placeholder="Veuillez expliquer pourquoi vous avez besoin de cette attestation..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="destinataire" className="text-lg font-medium">
                  Destinataire
                </Label>
                <Input
                  id="destinataire"
                  value={destinataire}
                  onChange={(e) => setDestinataire(e.target.value)}
                  className="mt-2"
                  placeholder="Nom de l'organisme ou de la personne à qui l'attestation est destinée"
                />
              </div>

              <div>
                <Label htmlFor="informations" className="text-lg font-medium">
                  Informations supplémentaires à inclure
                </Label>
                <Textarea
                  id="informations"
                  value={informations}
                  onChange={(e) => setInformations(e.target.value)}
                  className="mt-2"
                  placeholder="Précisez toute information spécifique que vous souhaitez voir figurer sur l'attestation..."
                />
              </div>

              <div>
                <Label className="text-lg font-medium">Format de livraison</Label>
                <RadioGroup 
                  value={formatLivraison} 
                  onValueChange={setFormatLivraison} 
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="pdf" />
                    <Label htmlFor="pdf" className="font-normal">
                      Document PDF
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="papier" id="papier" />
                    <Label htmlFor="papier" className="font-normal">
                      Document papier
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="font-normal">
                      Les deux
                    </Label>
                  </div>
                </RadioGroup>
              </div>

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
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
