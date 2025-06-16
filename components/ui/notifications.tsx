"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { Button } from "./button"

export function NotificationCenter() {
  const { notifications, removeNotification } = useAppStore()

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    notifications.forEach((notification) => {
      if (!notification.read) {
        setTimeout(() => {
          removeNotification(notification.id)
        }, 5000)
      }
    })
  }, [notifications, removeNotification])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.slice(-3).map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: {
    id: string
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
    timestamp: Date
  }
  onClose: () => void
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "info":
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className={`max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg p-4 animate-in slide-in-from-right`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
          <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
