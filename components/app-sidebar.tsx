import { BedDouble, BedSingle, Calendar, ChevronUp, Home, LogOut, ReceiptText,User2,UserRoundCog,WashingMachine } from "lucide-react"

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Link from "next/link"
import { SignOutButton } from "@clerk/nextjs"
import getUser from "@/app/lib/user"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { redirect } from "next/navigation"

interface AppSidebarProps {
  accountName: {
    nome: string | undefined,
    cognome: string | undefined
  }
}


// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Stanze",
    url: "/dashboard/stanze",
    icon: BedSingle,
  },
  {
    title: "Prenotazioni",
    url: "/dashboard/booking",
    icon: Calendar,
  },
  {
    title: "Fatturazioni",
    url: "/dashboard/payments",
    icon: ReceiptText,
  },
  {
    title: "Pulizie",
    url: "/dashboard/pulizie",
    icon: WashingMachine,
  },
]

export function AppSidebar( {accountName} : AppSidebarProps) {
  return (
    <Sidebar>
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
            <SidebarGroupLabel>Menù</SidebarGroupLabel>
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
        {
            //TO DO: Da completare la parte per l'utente con il logout e il Nome Visualizzato
        }
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                        <User2 /> {accountName?.nome + " " + accountName?.cognome}
                        <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                    >
                    <DropdownMenuItem>
                        <UserRoundCog />
                        <Link href={"#"}>
                          Impostazioni Account
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <LogOut />
                        <SignOutButton>
                          Logout
                        </SignOutButton>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
