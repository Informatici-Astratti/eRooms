import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar-profile"
import getUser from "../lib/user"
 
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
    const accountName = {
      nome: user?.nome,
      cognome: user?.cognome
    }

  return (
    <SidebarProvider>
      <AppSidebar accountName={accountName}  />
      <SidebarInset className="bg-primary-foreground h-screen overflow-y-auto w-full">
        {children}
      </SidebarInset>
      
    </SidebarProvider>
  )
}