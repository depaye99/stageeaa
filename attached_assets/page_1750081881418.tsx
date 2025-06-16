"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Calendar, FileText, Mail, MapPin, Phone, School, User, Briefcase, Clock, Plus } from "lucide-react"
import Link from "next/link"

export default function StagiaireDetailPage() {
  const user = { name: "ADMINISTRATEUR", role: "admin" }
  const params = useParams()
  const stagiaireId = params.id as string
  const [stagiaire, setStagiaire] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [demandes, setDemandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // TODO: Remplacer par les vrais appels API
        const [stagiaireRes, documentsRes, demandesRes] = await Promise.all([
          fetch(`/api/stagiaires/${stagiaireId}`),
          fetch(`/api/documents?stagiaireId=${stagiaireId}`),
          fetch(`/api/demandes?stagiaireId=${stagiaireId}`)
        ])
        
        if (stagiaireRes.ok) setStagiaire(await stagiaireRes.json())
        if (documentsRes.ok) setDocuments(await documentsRes.json())
        if (demandesRes.ok) setDemandes(await demandesRes.json())
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [stagiaireId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={user} />
        <div className="flex flex-1">
          <Sidebar role="admin" />
          <main className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">Chargement...</div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  if (!stagiaire) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={user} />
        <div className="flex flex-1">
          <Sidebar role="admin" />
          <main className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Stagiaire non trouvé</h1>
              <Link href="/admin/stagiaires">
                <Button>Retour à la liste</Button>
              </Link>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <div className="flex flex-1">
        <Sidebar role="admin" />

        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Profil du stagiaire</h1>
              <p className="text-gray-600">Détails et informations sur le stagiaire</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/stagiaires/${stagiaireId}/edit`}>
                <Button variant="outline">Modifier</Button>
              </Link>
              <Button className="bg-blue-500 hover:bg-blue-600">Générer une attestation</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                        {stagiaire.prenom.charAt(0)}
                        {stagiaire.nom.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">
                      {stagiaire.prenom} {stagiaire.nom}
                    </h2>
                    <Badge
                      className={`mt-2 ${
                        stagiaire.statut === "actif"
                          ? "bg-green-100 text-green-800"
                          : stagiaire.statut === "termine"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {stagiaire.statut === "actif"
                        ? "Actif"
                        : stagiaire.statut === "termine"
                          ? "Terminé"
                          : "En attente"}
                    </Badge>

                    <div className="w-full mt-6 space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm">{stagiaire.email}</span>
                      </div>
                      {stagiaire.telephone && (
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm">{stagiaire.telephone}</span>
                        </div>
                      )}
                      {stagiaire.adresse && (
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm">{stagiaire.adresse}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <School className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <span className="text-sm block">{stagiaire.formation}</span>
                          <span className="text-xs text-gray-500">{stagiaire.ecole}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm">{stagiaire.departement}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm">Tuteur: {stagiaire.tuteur}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <span className="text-sm block">Période de stage</span>
                          <span className="text-xs text-gray-500">{stagiaire.periode}</span>
                        </div>
                      </div>
                      {stagiaire.dateDebut && stagiaire.dateFin && (
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <span className="text-sm block">Durée restante</span>
                            <span className="text-xs text-gray-500">70 jours</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="demandes">Demandes</TabsTrigger>
                  <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
                </TabsList>

                <TabsContent value="documents" className="mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Documents</CardTitle>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" /> Ajouter
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {documents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>Aucun document disponible</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <div
                                  className={`p-2 rounded-md mr-3 ${
                                    doc.format === "PDF"
                                      ? "bg-red-100 text-red-600"
                                      : doc.format === "DOC"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-green-100 text-green-600"
                                  }`}
                                >
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium">{doc.nom}</p>
                                  <p className="text-xs text-gray-500">
                                    {doc.date} • {doc.taille}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  Télécharger
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500">
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="demandes" className="mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Demandes</CardTitle>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" /> Nouvelle demande
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {demandes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>Aucune demande disponible</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {demandes.map((demande) => (
                            <div key={demande.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <Badge
                                    className={`mr-2 ${
                                      demande.statut === "Validé"
                                        ? "bg-green-100 text-green-800"
                                        : demande.statut === "Refusé"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-orange-100 text-orange-800"
                                    }`}
                                  >
                                    {demande.statut}
                                  </Badge>
                                  <h3 className="font-medium">{demande.type.replace("_", " ")}</h3>
                                </div>
                                <span className="text-xs text-gray-500">{demande.date}</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{demande.details}</p>
                              {demande.commentaires && demande.commentaires.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-xs font-medium mb-2">Commentaires</p>
                                  {demande.commentaires.map((comment: any, idx: number) => (
                                    <div key={idx} className="mb-2 text-xs">
                                      <span className="font-medium">{comment.userName}</span>
                                      <span className="text-gray-500"> ({comment.date}): </span>
                                      {comment.message}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="flex justify-end gap-2 mt-2">
                                <Button variant="outline" size="sm">
                                  Détails
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="evaluations" className="mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Évaluations</CardTitle>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" /> Ajouter une évaluation
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {!stagiaire?.evaluations || stagiaire.evaluations.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>Aucune évaluation disponible</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {stagiaire.evaluations.map((evaluation: any) => (
                            <div key={evaluation.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">Évaluation du {evaluation.date}</h3>
                                <Badge className="bg-blue-100 text-blue-800">Note: {evaluation.noteGlobale}/5</Badge>
                              </div>

                              <div className="space-y-3 mb-4">
                                {evaluation.competences.map((comp: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between">
                                    <span className="text-sm">{comp.nom}</span>
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                          key={star}
                                          className={`h-4 w-4 ${star <= comp.note ? "text-yellow-400" : "text-gray-300"}`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm font-medium mb-1">Commentaire:</p>
                                <p className="text-sm text-gray-600">{evaluation.commentaire}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
