import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { NotificationDropdown } from "@/components/NotificationDropdown"
import logo from "@/assets/logo.png"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-accent rounded-md p-2" />
                <div className="flex items-center gap-3">
                  <img src={logo} alt="AI Career Assistant" className="w-8 h-8" />
                  <div className="text-sm text-muted-foreground">
                    Welcome to your AI-powered career assistant
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <NotificationDropdown />
                <ProfileDropdown />
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}