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
import { BedDouble, Calendar, ChevronLeft, ChevronUp, Home, LogOut, User2, UserPen, UserRoundCog } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { SignOutButton } from "@clerk/nextjs"


interface AppSidebarProps {
  accountName: {
    nome: string | undefined,
    cognome: string | undefined
  }
}


export function AppSidebar({accountName}: AppSidebarProps) {
  
  const items = [
    {
      title: "Il mio Profilo",
      url: "/account/myprofile",
      icon: UserPen,
    },
    {
      title: "Le mie Prenotazioni",
      url: "/account/mybookings",
      icon: Calendar,
    },
  ]

    return (
      <Sidebar variant="inset" collapsible="none" className="h-screen bg-white border border-x-zinc-200">
        <SidebarHeader>
            <div>
              <Button variant={"ghost"} className="pl-0.5">
                <Link href="/" className="flex items-center gap-2">
                  <ChevronLeft />
                  Torna alla Home
                </Link>
              </Button>
            </div>
            <div className="flex gap-2 justify-center items-center py-5">
                <div className="flex size-6 bg-primarflex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <BedDouble className="size-4" />
                </div>
                <p className="font-bold">e-Rooms</p>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>  
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger className="group" asChild>
                      <SidebarMenuButton>
                          <User2 /> {accountName?.nome + " " + accountName?.cognome}
                          <ChevronUp className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                    >
                    <SignOutButton redirectUrl="/">
                      <DropdownMenuItem>
                        <LogOut />
                        Logout
                      </DropdownMenuItem>
                    </SignOutButton>
                    </DropdownMenuContent>
                </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }
  