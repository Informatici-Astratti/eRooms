import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import getUser from "../lib/user"
import { ruolo } from "@prisma/client"
import {  redirect } from "next/navigation";
import { headers } from "next/headers";
 
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (user?.ruolo !== ruolo.PROPRIETARIO && user?.ruolo !== ruolo.GOVERNANTE) {
    return redirect("/")
  }

  if(user?.ruolo === ruolo.GOVERNANTE) {
      const currentUrl = new URL((await headers()).get("x-nextjs-url") ?? "", process.env.NEXT_PUBLIC_APP_URL);
      if (!currentUrl.pathname.startsWith("/admin/pulizie")) {
        return redirect("/admin/pulizie");
      }
  }

  const accountName = {
    nome: user?.nome,
    cognome: user?.cognome
  }

  return (
    <SidebarProvider>
      <AppSidebar accountName={accountName} />
      <SidebarInset className="bg-primary-foreground h-screen overflow-y-auto w-full">
        {children}
      </SidebarInset>
      
    </SidebarProvider>
  )
}