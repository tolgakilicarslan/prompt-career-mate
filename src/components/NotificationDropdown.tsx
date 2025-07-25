import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertCircle, Calendar, FileText } from "lucide-react"

interface Notification {
  id: string
  type: 'application' | 'document' | 'interview' | 'system'
  title: string
  message: string
  time: string
  read: boolean
}

export function NotificationDropdown() {
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      type: "application",
      title: "Application Update",
      message: "Your application to TechCorp has been viewed",
      time: "2 hours ago",
      read: false
    },
    {
      id: "2", 
      type: "interview",
      title: "Interview Scheduled",
      message: "Interview scheduled for tomorrow at 2 PM",
      time: "1 day ago",
      read: false
    },
    {
      id: "3",
      type: "document",
      title: "Resume Analysis Complete",
      message: "Your resume analysis shows 87% match",
      time: "2 days ago", 
      read: true
    },
    {
      id: "4",
      type: "system",
      title: "New AI Features",
      message: "Check out our enhanced AI assistant",
      time: "3 days ago",
      read: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'application': return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'interview': return <Calendar className="w-4 h-4 text-green-500" />
      case 'document': return <FileText className="w-4 h-4 text-purple-500" />
      case 'system': return <AlertCircle className="w-4 h-4 text-orange-500" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <div className="flex items-center justify-between p-4">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-4">
              <div className="mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full justify-center text-center">
          <span className="text-sm">View all notifications</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}