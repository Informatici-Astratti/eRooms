import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { BedDouble, Calendar, Home, UserPen } from "lucide-react"





export function AppSidebar() {
  
  const items = [
    {
      title: "Torna alla Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Il mio Profilo",
      url: "/account/myprofile",
      icon: UserPen,
    },
    {
      title: "Le mie Prenotazioni",
      url: "/account/bookings",
      icon: Calendar,
    },
  ]

    return (
      <Sidebar variant="inset" collapsible="none" className="h-screen bg-white">
        <SidebarHeader>
            <div className="flex gap-2 justify-center items-center py-5">
                <div className="flex size-6 bg-primarflex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <BedDouble className="size-4" />
                </div>
                <p className="font-bold">e-Rooms</p>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>  
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  }
  