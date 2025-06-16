"use client"

import type React from "react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { authService } from '@/lib/services/auth-service'

export default function NewEvaluationPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const [stagiaireId, setStagiaireId] = useState("")
  const [commentaire, setCommentaire] = useState("")
  const [stagiaires, setStagiaires] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [competences, setCompetences] = useState([
    { nom: "Travail en équipe", note: 0 },
    { nom: "Compétences techniques", note: 0 },
    { nom: "Communication", note: 0 },
    { nom: "Autonomie", note: 0 },
    { nom: "Ponctualité", note: 0 },
  ])

  useEffect(() => {
    async function checkAuth() {
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
        setLoading(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])

  const updateNote = (index: number, note: number) => {
    const newCompetences = [...competences]
    newCompetences[index].note = note
    setCompetences(newCompetences)
  }

  useEffect(() => {
    const loadStagiaires = async () => {
      try {
        if (!user) return

        const tuteurId = user.id
        const response = await fetch(`/api/stagiaires?tuteurId=${tuteurId}&statut=actif`)
        if (response.ok) {
          setStagiaires(await response.json())
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stagiaires:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadStagiaires()
    }
  }, [user])

  const handleNoteChange = (index: number, note: number) => {
    const newCompetences = [...competences]
    newCompetences[index].note = note
    setCompetences(newCompetences)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/tuteur/evaluations?success=created")
  }

  const noteGlobale = competences.reduce((acc, comp) => acc + comp.note, 0) / competences.length
  const isFormValid = stagiaireId && commentaire.trim() && competences.every((comp) => comp.note > 0)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <div className="flex flex-1">
        <Sidebar role="tuteur" />

        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Nouvelle évaluation</h1>
              <p className="text-gray-600">Évaluez les compétences et le travail d'un stagiaire</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/tuteur/evaluations")}>
              Annuler
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Évaluation des compétences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="stagiaire">Stagiaire à évaluer</Label>
                        <Select value={stagiaireId} onValueChange={setStagiaireId}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionner un stagiaire" />
                          </SelectTrigger>
                          <SelectContent>
                            {stagiaires.map((stagiaire) => (
                              <SelectItem key={stagiaire.id} value={stagiaire.id}>
                                {stagiaire.prenom} {stagiaire.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-base font-medium mb-4">Compétences</h3>

                        <div className="space-y-6">
                          {competences.map((competence, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-2">
                                <Label>{competence.nom}</Label>
                                <span className="text-sm font-medium">
                                  {competence.note > 0 ? `${competence.note}/5` : "Non évalué"}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((note) => (
                                  <button
                                    key={note}
                                    type="button"
                                    onClick={() => handleNoteChange(index, note)}
                                    className={`flex-1 h-10 rounded-md transition-colors ${
                                      competence.note >= note
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                  >
                                    {note}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <Label htmlFor="commentaire">Commentaire général</Label>
                        <Textarea
                          id="commentaire"
                          value={commentaire}
                          onChange={(e) => setCommentaire(e.target.value)}
                          placeholder="Donnez votre appréciation générale sur le travail du stagiaire..."
                          className="mt-1 min-h-[150px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Résumé</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-2">Note globale</h3>
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-xl font-bold">
                          {noteGlobale ? noteGlobale.toFixed(1) : "-"}
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-5 w-5 ${star <= Math.round(noteGlobale) ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-base font-medium mb-2">Informations</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Cette évaluation sera visible par le stagiaire et le service RH. Elle sera utilisée pour le
                        suivi du stagiaire et pourra être incluse dans son attestation de fin de stage.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={!isFormValid}>
                      Soumettre l'évaluation
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  )
}