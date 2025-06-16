
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Calendar, TrendingUp, Users, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"

export default function ReportsPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("2025")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Mock data for charts
  const [monthlyData] = useState([
    { month: "Jan", stagiaires: 12, demandes: 18, validees: 15, refusees: 3 },
    { month: "Fev", stagiaires: 15, demandes: 22, validees: 18, refusees: 4 },
    { month: "Mar", stagiaires: 18, demandes: 25, validees: 20, refusees: 5 },
    { month: "Avr", stagiaires: 22, demandes: 30, validees: 25, refusees: 5 },
    { month: "Mai", stagiaires: 20, demandes: 28, validees: 23, refusees: 5 },
    { month: "Jun", stagiaires: 25, demandes: 35, validees: 30, refusees: 5 },
  ])

  const [departmentData] = useState([
    { name: "Développement", value: 40, color: "#0088FE" },
    { name: "Marketing", value: 25, color: "#00C49F" },
    { name: "Finance", value: 20, color: "#FFBB28" },
    { name: "RH", value: 15, color: "#FF8042" },
  ])

  const [performanceData] = useState([
    { metric: "Taux de satisfaction", value: 85, target: 90, unit: "%", status: "warning" },
    { metric: "Temps de traitement", value: 95, target: 85, unit: "%", status: "success" },
    { metric: "Documents générés", value: 120, target: 100, unit: "", status: "success" },
  ])

  const [topSchools] = useState([
    { name: "École Supérieure d'Informatique", count: 25 },
    { name: "Université de Commerce", count: 18 },
    { name: "Institut de Technologie", count: 15 },
    { name: "École de Management", count: 12 },
    { name: "Université des Sciences", count: 10 },
  ])

  const [requestTypes] = useState([
    { type: "Convention de stage", count: 45, percentage: 40 },
    { type: "Attestation de fin", count: 35, percentage: 31 },
    { type: "Rapport d'activité", count: 20, percentage: 18 },
    { type: "Lettre de recommandation", count: 12, percentage: 11 },
  ])

  useEffect(() => {
    const checkAuth = async () => {
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

        if (!profile || profile.role !== "admin") {
          router.push("/auth/login")
          return
        }

        setUser(profile)
        await loadStats()
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  const loadStats = async () => {
    try {
      const [usersCount, stagiairesCount, demandesCount] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("stagiaires").select("id", { count: "exact", head: true }),
        supabase.from("demandes").select("id", { count: "exact", head: true }),
      ])

      setDashboardStats({
        users_total: usersCount.count || 0,
        stagiaires_total: stagiairesCount.count || 0,
        demandes_total: demandesCount.count || 0,
        documents_total: 156,
        demandes_en_cours: 8,
      })
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
      // Fallback to mock data
      setDashboardStats({
        users_total: 45,
        stagiaires_total: 120,
        demandes_total: 89,
        documents_total: 156,
        demandes_en_cours: 8,
      })
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

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Rapports et analyses</h1>
            <p className="text-gray-600">Tableaux de bord et statistiques détaillées</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                <SelectItem value="dev">Développement</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="rh">RH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="detailed">Détaillé</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Stagiaires</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.stagiaires_total || 0}</div>
                  <p className="text-xs text-muted-foreground">vs mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Demandes totales</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.demandes_total || 0}</div>
                  <p className="text-xs text-muted-foreground">vs mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Demandes en cours</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.demandes_en_cours || 0}</div>
                  <p className="text-xs text-muted-foreground">à traiter</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documents</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.documents_total || 0}</div>
                  <p className="text-xs text-muted-foreground">documents générés</p>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques principaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution mensuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="stagiaires" fill="#0088FE" name="Stagiaires" />
                        <Bar dataKey="demandes" fill="#00C49F" name="Demandes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par département</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {departmentData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {performanceData.map((metric: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{metric.metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl font-bold">
                        {metric.value}
                        {metric.unit || "%"}
                      </div>
                      <div
                        className={`text-sm px-2 py-1 rounded ${
                          metric.status === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        Objectif: {metric.target}
                        {metric.unit || "%"}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.status === "success" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                        style={{
                          width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendances sur 6 mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="stagiaires" stroke="#0088FE" strokeWidth={2} name="Stagiaires" />
                      <Line
                        type="monotone"
                        dataKey="validees"
                        stroke="#00C49F"
                        strokeWidth={2}
                        name="Demandes validées"
                      />
                      <Line
                        type="monotone"
                        dataKey="refusees"
                        stroke="#FF8042"
                        strokeWidth={2}
                        name="Demandes refusées"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Écoles partenaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSchools.map((school: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{school.name}</span>
                        <span className="text-muted-foreground">{school.count} stagiaires</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Types de demandes populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requestTypes.map((item: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.type}</span>
                          <span className="text-muted-foreground">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
