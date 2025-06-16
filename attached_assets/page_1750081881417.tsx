
"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportMenu } from "@/components/ui/export-menu"
import { Calendar, TrendingUp, Users, FileText } from "lucide-react"
import { useState, useEffect } from "react"
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
  const [selectedPeriod, setSelectedPeriod] = useState("2025")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [monthlyData, setMonthlyData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [performanceData, setPerformanceData] = useState([])
  const [topSchools, setTopSchools] = useState([])
  const [requestTypes, setRequestTypes] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Récupération des stats du dashboard existant
        const response = await fetch('/api/dashboard?userId=admin&role=admin')
        const stats = await response.json()
        setDashboardStats(stats)

        // Appels API réels maintenant disponibles
        const monthlyResponse = await fetch(`/api/reports/monthly?period=${selectedPeriod}&department=${selectedDepartment}`)
        const monthlyStats = await monthlyResponse.json()
        setMonthlyData(monthlyStats)

        const deptResponse = await fetch(`/api/reports/departments?period=${selectedPeriod}`)
        const deptStats = await deptResponse.json()
        setDepartmentData(deptStats)

        const perfResponse = await fetch(`/api/reports/performance?period=${selectedPeriod}`)
        const perfStats = await perfResponse.json()
        setPerformanceData(perfStats)

        const schoolsResponse = await fetch(`/api/reports/schools?period=${selectedPeriod}`)
        const schoolsStats = await schoolsResponse.json()
        setTopSchools(schoolsStats)

        const typesResponse = await fetch(`/api/reports/request-types?period=${selectedPeriod}`)
        const typesStats = await typesResponse.json()
        setRequestTypes(typesStats)

      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedPeriod, selectedDepartment])

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={{ name: "ADMINISTRATEUR", role: "admin" }} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 bg-background">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Rapports et analyses</h1>
              <p className="text-muted-foreground">Tableaux de bord et statistiques détaillées</p>
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
              <ExportMenu type="stagiaires" />
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
                    <p className="text-xs text-muted-foreground">documents uploadés</p>
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
                      {monthlyData.length > 0 ? (
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
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          Aucune donnée disponible pour cette période
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par département</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {departmentData.length > 0 ? (
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
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          Aucune donnée disponible pour cette période
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {performanceData.length > 0 ? performanceData.map((metric: any, index: number) => (
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
                )) : (
                  <div className="col-span-2 text-center text-muted-foreground">
                    Aucune donnée de performance disponible pour cette période
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendances sur 6 mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {monthlyData.length > 0 ? (
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
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Aucune donnée de tendances disponible pour cette période
                      </div>
                    )}
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
                      {topSchools.length > 0 ? topSchools.map((school: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium">{school.name}</span>
                          <span className="text-muted-foreground">{school.count} stagiaires</span>
                        </div>
                      )) : (
                        <div className="text-center text-muted-foreground">
                          Aucune donnée disponible pour cette période
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Types de demandes populaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {requestTypes.length > 0 ? requestTypes.map((item: any, index: number) => (
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
                      )) : (
                        <div className="text-center text-muted-foreground">
                          Aucune donnée disponible pour cette période
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <Footer />
    </div>
  )
}
