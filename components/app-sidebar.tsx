import { BedDouble, BedSingle, Calendar, ChevronUp, Home, ReceiptText,User2,WashingMachine } from "lucide-react"

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

export function AppSidebar() {
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
                        <User2 /> Username
                        <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                    >
                    <DropdownMenuItem>
                        <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>Sign out</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
