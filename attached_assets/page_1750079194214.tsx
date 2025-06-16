"use client"

import type React from "react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DemandeStageAcademique() {
  const [formData, setFormData] = useState({
    dateDebut: "",
    mois: "",
    annee: "",
    nombreMois: "",
    ecole: "",
    niveau: "",
    formation: "",
  })
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation d'envoi
    router.push("/stagiaire?success=stage")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={{ name: "Lucas Bernard", role: "stagiaire" }} />

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl bg-white rounded-3xl border-2 border-gray-200 p-8">
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

          <h1 className="text-2xl font-bold text-center mb-8">FORMULAIRE DE DEMANDE DE STAGE ACADÉMIQUE</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations académiques */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center">INFORMATIONS ACADÉMIQUES</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-medium">École / Université</Label>
                  <Input
                    name="ecole"
                    value={formData.ecole}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Nom de votre établissement"
                    required
                  />
                </div>

                <div>
                  <Label className="text-lg font-medium">Niveau d'études</Label>
                  <Select>
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
                  <Label className="text-lg font-medium">Formation</Label>
                  <Input
                    name="formation"
                    value={formData.formation}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Intitulé de votre formation"
                    required
                  />
                </div>

                <div>
                  <Label className="text-lg font-medium">Spécialité</Label>
                  <Input className="mt-2" placeholder="Votre spécialité" />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center">DOCUMENTS</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-medium">CV</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">Déposer votre CV ici</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      +
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-medium">Certificat de scolarité</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">Déposer votre certificat de scolarité ici</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      +
                    </Button>
                  </div>
                </div>

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
                  <Label className="text-lg font-medium">Lettre de recommandation</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">Déposer votre lettre de recommandation ici</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center">INFORMATIONS PERSONNELLES</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-medium">Pièce d'identité</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">Déposer votre pièce d'identité ici</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      +
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-medium">Plan de localisation</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">Déposer votre plan de localisation ici</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Périodes */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center">PÉRIODES</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-medium">Date de début</Label>
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
                  <Label className="text-lg font-medium">Nombre de mois</Label>
                  <Input
                    name="nombreMois"
                    value={formData.nombreMois}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Ex: 3 mois"
                    required
                  />
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
