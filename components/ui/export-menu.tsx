"use client"

import { useState } from "react"
import { Download, FileText, Table } from "lucide-react"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"
import { exportService } from "@/lib/services/export-service"
import { useAppStore } from "@/lib/store"

interface ExportMenuProps {
  type: "demandes" | "stagiaires" | "documents"
  filters?: any
  data?: any[]
}

export function ExportMenu({ type, filters, data }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { addNotification } = useAppStore()

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      setIsExporting(true)

      let blob: Blob
      if (format === "csv") {
        blob = await exportService.exportToCSV(type, filters)
      } else {
        blob = await exportService.exportToPDF(type, filters)
      }

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${type}_export_${new Date().toISOString().split("T")[0]}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      addNotification({
        id: Date.now().toString(),
        type: "success",
        title: "Export réussi",
        message: `Les données ont été exportées en ${format.toUpperCase()}`,
        timestamp: new Date(),
        read: false,
      })
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        type: "error",
        title: "Erreur d'export",
        message: "Impossible d'exporter les données",
        timestamp: new Date(),
        read: false,
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Export en cours..." : "Exporter"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <Table className="h-4 w-4 mr-2" />
          Exporter en CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="h-4 w-4 mr-2" />
          Exporter en PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
