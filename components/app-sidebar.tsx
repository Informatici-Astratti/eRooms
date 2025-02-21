import * as React from "react"
import { BedDouble, BedSingle, Calendar, ChevronLeft, ChevronRight, ChevronUp, Home, Info, LogOut, ReceiptText, ShieldQuestion, SquareActivity, User2, UserRoundCog, Users, WashingMachine } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { SignOutButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "./ui/button"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Home",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url:"/admin/dashboard",
          icon: SquareActivity
        }
      ],
    },
    {
      title: "Bookings",
      url: "#",
      items: [
        {
          title: "Prenotazioni",
          url: "/admin/booking",
          icon: Calendar,
        },
        {
          title: "Pulizie",
          url: "/admin/pulizie",
          icon: WashingMachine,
        },
      ],
    },
    {
      title: "Gestione Proprietà",
      url: "#",
      items: [
        {
          title: "Proprietà",
          url: "#",
          icon: Home,
          items: [
            {
              title: "Generale",
              url: "/admin/general",
              icon: Info,
            },
            {
              title: "Stanze",
              url: "/admin/room",
              icon: BedSingle,
            },
          ]
        },
        {
          title: "Clienti",
          url: "/admin/customers",
          icon: Users,
        },
        {
          title: "Fatturazioni",
          url: "/admin/payments",
          icon: ReceiptText,
        },
        {
          title: "Squadra",
          url: "/admin/squadra",
          icon: ShieldQuestion,
        },
      ],
    }
  ]
}

interface AppSidebarProps {
  accountName: {
    nome: string | undefined,
    cognome: string | undefined
  }
}

export function AppSidebar({accountName} : AppSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="none" className="h-screen bg-white border border-x-zinc-200">
        <SidebarHeader>
        <div>
              <Button variant={"ghost"} className="pl-0.5">
                <Link href="/v" className="flex items-center gap-2">
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
      <SidebarContent className="gap-0">
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item, index) => (
          <SidebarGroup key={index}>
          <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
          <SidebarMenu>
            {item.items.map((item) => (
              item.items ? (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <p>{item.title}</p>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              {subItem.icon && <subItem.icon />}
                              <p>{subItem.title}</p>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <p>{item.title}</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            ))}
          </SidebarMenu>
        </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
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
                    <DropdownMenuItem>
                        <UserRoundCog />
                        <Link href={"/account/myprofile"}>
                          Impostazioni Account
                        </Link>
                    </DropdownMenuItem>
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
