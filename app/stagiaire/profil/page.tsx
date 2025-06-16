
'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from "@/components/layout/header"
import { createClient } from "@/lib/supabase/client"

export default function StagiaireProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [stagiaireInfo, setStagiaireInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    entreprise: "",
    poste: "",
    date_debut: "",
    date_fin: ""
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      try {
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

        // Charger les informations du stagiaire
        const { data: stagiaire } = await supabase
          .from("stagiaires")
          .select("*")
          .eq("user_id", profile.id)
          .single()

        setStagiaireInfo(stagiaire)

        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          entreprise: stagiaire?.entreprise || "",
          poste: stagiaire?.poste || "",
          date_debut: stagiaire?.date_debut || "",
          date_fin: stagiaire?.date_fin || ""
        })
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Mettre à jour les informations utilisateur
      const { error: userError } = await supabase
        .from("users")
        .update({
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        })
        .eq("id", user.id)

      if (userError) throw userError

      // Mettre à jour les informations stagiaire
      if (stagiaireInfo) {
        const { error: stagiaireError } = await supabase
          .from("stagiaires")
          .update({
            entreprise: formData.entreprise,
            poste: formData.poste,
            date_debut: formData.date_debut,
            date_fin: formData.date_fin
          })
          .eq("id", stagiaireInfo.id)

        if (stagiaireError) throw stagiaireError
      }

      alert("Profil mis à jour avec succès!")
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      alert("Erreur lors de la mise à jour du profil")
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
        <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <Button type="submit">Mettre à jour</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations de stage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="entreprise">Entreprise</Label>
                <Input 
                  id="entreprise" 
                  value={formData.entreprise}
                  onChange={(e) => setFormData(prev => ({ ...prev, entreprise: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="poste">Poste</Label>
                <Input 
                  id="poste" 
                  value={formData.poste}
                  onChange={(e) => setFormData(prev => ({ ...prev, poste: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="date_debut">Date de début</Label>
                <Input 
                  id="date_debut" 
                  type="date"
                  value={formData.date_debut}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_debut: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="date_fin">Date de fin</Label>
                <Input 
                  id="date_fin" 
                  type="date"
                  value={formData.date_fin}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_fin: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
