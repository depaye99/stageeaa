
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  UserPlus, 
  FolderOpen,
  Home,
  ClipboardList
} from "lucide-react"

interface SidebarProps {
  role?: string
}

export function Sidebar({ role = "admin" }: SidebarProps) {
  const pathname = usePathname()

  const adminMenuItems = [
    {
      title: "Tableau de bord",
      href: "/admin",
      icon: Home
    },
    {
      title: "Utilisateurs",
      href: "/admin/users",
      icon: Users
    },
    {
      title: "Stagiaires",
      href: "/admin/stagiaires",
      icon: UserPlus
    },
    {
      title: "Demandes",
      href: "/admin/demandes",
      icon: ClipboardList
    },
    {
      title: "Templates",
      href: "/admin/templates",
      icon: FileText
    },
    {
      title: "Rapports",
      href: "/admin/reports",
      icon: BarChart3
    },
    {
      title: "Documents",
      href: "/admin/documents",
      icon: FolderOpen
    },
    {
      title: "Paramètres",
      href: "/admin/settings",
      icon: Settings
    }
  ]

  const menuItems = role === "admin" ? adminMenuItems : []

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
