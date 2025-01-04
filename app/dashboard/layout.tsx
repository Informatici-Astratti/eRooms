import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import getUser from "../lib/user"
 
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  const accountName = {
    nome: user?.nome,
    cognome: user?.cognome
  }

  return (
    <SidebarProvider>
      <AppSidebar accountName={accountName} />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}