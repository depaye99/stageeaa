"use client"

import type React from "react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DemandeProlongation() {
  const [duree, setDuree] = useState("")
  const [motif, setMotif] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation d'envoi
    router.push("/stagiaire?success=prolongation")
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

          <h1 className="text-2xl font-bold text-center mb-8">DEMANDE DE PROLONGATION DE STAGE</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-medium">Durée de prolongation souhaitée</Label>
                <Input
                  value={duree}
                  onChange={(e) => setDuree(e.target.value)}
                  className="mt-2"
                  placeholder="Ex: 2 mois"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-medium">Date de début de prolongation</Label>
                  <div className="flex space-x-2 mt-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Jours" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Mois" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Janvier",
                          "Février",
                          "Mars",
                          "Avril",
                          "Mai",
                          "Juin",
                          "Juillet",
                          "Août",
                          "Septembre",
                          "Octobre",
                          "Novembre",
                          "Décembre",
                        ].map((mois, i) => (
                          <SelectItem key={i} value={String(i + 1)}>
                            {mois}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
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
                  <Label className="text-lg font-medium">Date de fin de prolongation</Label>
                  <div className="flex space-x-2 mt-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Jours" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Mois" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Janvier",
                          "Février",
                          "Mars",
                          "Avril",
                          "Mai",
                          "Juin",
                          "Juillet",
                          "Août",
                          "Septembre",
                          "Octobre",
                          "Novembre",
                          "Décembre",
                        ].map((mois, i) => (
                          <SelectItem key={i} value={String(i + 1)}>
                            {mois}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
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
              </div>

              <div>
                <Label className="text-lg font-medium">Motif de la demande de prolongation</Label>
                <Textarea
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  className="mt-2 min-h-[150px]"
                  placeholder="Veuillez expliquer les raisons pour lesquelles vous souhaitez prolonger votre stage..."
                  required
                />
              </div>

              <div>
                <Label className="text-lg font-medium">Objectifs pour la période de prolongation</Label>
                <Textarea
                  className="mt-2 min-h-[150px]"
                  placeholder="Décrivez les objectifs que vous souhaitez atteindre pendant cette période supplémentaire..."
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center">DOCUMENTS JUSTIFICATIFS</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-medium">Lettre de motivation</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">Déposer votre lettre de motivation ici</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      +
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-medium">Accord de l'établissement (si applicable)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">Déposer le document ici</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      +
                    </Button>
                  </div>
                </div>
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
