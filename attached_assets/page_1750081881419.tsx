"use client"

import { ProtectedPage } from '@/components/auth/ProtectedPage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminProfilePage() {
  return (
    <ProtectedPage requiredRoles={['admin']}>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Profil Administrateur</h1>

        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" defaultValue="" />
            </div>
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" defaultValue="" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="" />
            </div>
            <Button>Mettre à jour</Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedPage>
  )
}