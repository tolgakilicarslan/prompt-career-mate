import { useState } from "react"
import { 
  FileText, 
  Search, 
  BarChart3, 
  MessageSquare, 
  Upload, 
  Brain,
  Briefcase,
  User,
  Settings,
  LogOut
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Job Search", url: "/job-search", icon: Search },
  { title: "Job Tracker", url: "/job-tracker", icon: Briefcase },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "AI Assistant", url: "/ai-assistant", icon: Brain },
]

const documentItems = [
  { title: "Upload Resume", url: "/upload-resume", icon: Upload },
  { title: "Upload Cover Letter", url: "/upload-cover-letter", icon: Upload },
]

const userItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"
  const { user, signOut } = useAuth()

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-accent/50 text-foreground"

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-card">
        {/* Brand header */}
        {!collapsed && (
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--gradient-primary)] rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gradient">CareerAI</h1>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup className="sidebar-section">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Document Management */}
        <SidebarGroup className="sidebar-section">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Documents
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {documentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <div className="mt-auto">
          <SidebarGroup className="sidebar-section">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {/* User info */}
                <SidebarMenuItem>
                  <div className="flex items-center gap-3 px-3 py-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {!collapsed && (
                      <span className="text-muted-foreground truncate text-xs">
                        {user?.email}
                      </span>
                    )}
                  </div>
                </SidebarMenuItem>

                {userItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-10">
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {/* Sign out button */}
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={signOut}
                    className="h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4" />
                    {!collapsed && <span>Sign Out</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}