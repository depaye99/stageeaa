"use client"

import type React from "react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DemandeAttestation() {
  const [typeAttestation, setTypeAttestation] = useState("presence")
  const [motif, setMotif] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation d'envoi
    router.push("/stagiaire?success=attestation")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={{ name: "Lucas Bernard", role: "stagiaire" }} />

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl bg-white rounded-3xl border-2 border-gray-200 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative mr-3">
                <div className="w-8 h-8 border-2 border-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div>
                <div className="font-bold text-lg text-black">BRIDGE</div>
                <div className="text-sm text-blue-500 font-medium">Technologies</div>
                <div className="text-xs text-gray-500">Solutions</div>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-8">DEMANDE D'ATTESTATION</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-medium">Type d'attestation</Label>
                <RadioGroup value={typeAttestation} onValueChange={setTypeAttestation} className="mt-3 space-y-3">
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
                    Précisez le type d'attestation
                  </Label>
                  <Input
                    id="autreType"
                    className="mt-2"
                    placeholder="Type d'attestation souhaité"
                    required={typeAttestation === "autre"}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="motif" className="text-lg font-medium">
                  Motif de la demande
                </Label>
                <Textarea
                  id="motif"
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  className="mt-2 min-h-[150px]"
                  placeholder="Veuillez expliquer pourquoi vous avez besoin de cette attestation..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="destinataire" className="text-lg font-medium">
                  Destinataire (optionnel)
                </Label>
                <Input
                  id="destinataire"
                  className="mt-2"
                  placeholder="Nom de l'organisme ou de la personne à qui l'attestation est destinée"
                />
              </div>

              <div>
                <Label htmlFor="informations" className="text-lg font-medium">
                  Informations supplémentaires à inclure (optionnel)
                </Label>
                <Textarea
                  id="informations"
                  className="mt-2"
                  placeholder="Précisez toute information spécifique que vous souhaitez voir figurer sur l'attestation..."
                />
              </div>

              <div>
                <Label className="text-lg font-medium">Format de livraison</Label>
                <RadioGroup defaultValue="pdf" className="mt-3 space-y-3">
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
            </div>

            <div className="text-center pt-6">
              <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white px-12 py-3 text-lg">
                Envoyer
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
