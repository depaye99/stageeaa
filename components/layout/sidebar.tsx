"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { SidebarNavItem } from "@/types"
import { auth } from "@/lib/auth"
import { Settings } from "lucide-react"

interface SidebarProps {
  items: SidebarNavItem[]
  role?: string
}

function SidebarNav({ items }: SidebarProps) {
  const pathname = usePathname()
  return (
    <div className="flex flex-col space-y-2">
      {items?.length
        ? items.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm", className: "w-full justify-start" }),
                    pathname === item.href
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.icon && <Icons.arrowRight className="mr-2 h-4 w-4" />}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        : null}
      {/* Add more items here */}
    </div>
  )
}

interface SidebarMenuProps {
  children: React.ReactNode
}

function SidebarMenu({ children }: SidebarMenuProps) {
  return <ul className="mt-2 border-t pt-4">{children}</ul>
}

interface SidebarMenuItemProps {
  children: React.ReactNode
}

function SidebarMenuItem({ children }: SidebarMenuItemProps) {
  return <li>{children}</li>
}

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface SidebarMenuButtonProps {
  children: ReactNode
  asChild?: boolean
}

function SidebarMenuButton({ children, asChild }: SidebarMenuButtonProps) {
  if (asChild) {
    return <>{children}</>
  }
  return (
    <Button variant="ghost" size="sm" className="w-full justify-start">
      {children}
    </Button>
  )
}

export async function Sidebar({role}: {role?: string}) {
  const user = await auth()?.user

  return (
    <div className="flex flex-col space-y-6 w-[280px]">
      <div className="flex-1 space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Administration</h2>
        <p className="text-sm text-muted-foreground">Navigation et gestion de votre compte.</p>
        <SidebarNav
          items={[
            {
              title: "Aperçu",
              href: "/admin",
              icon: true,
            },
            {
              title: "Facturation",
              href: "/admin/billing",
              icon: true,
            },
            {
              title: "Paramètres",
              href: "/admin/settings",
              icon: true,
            },
          ]}
        />
      </div>
      {(role === "admin" || user?.role === "admin") && (
        <div className="flex-1 space-y-2">
          <h2 className="text-sm font-semibold tracking-tight">Section Admin</h2>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/users" className="flex items-center gap-2">
                  <Icons.users className="h-4 w-4" />
                  Utilisateurs
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/products" className="flex items-center gap-2">
                  <Icons.package className="h-4 w-4" />
                  Produits
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/orders" className="flex items-center gap-2">
                  <Icons.shoppingCart className="h-4 w-4" />
                  Commandes
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/reports" className="flex items-center gap-2">
                  <Icons.barChart className="h-4 w-4" />
                  Rapports
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {(role === "admin" || user?.role === "admin") && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/test-crud" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Test CRUD
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </div>
      )}
    </div>
  )
}