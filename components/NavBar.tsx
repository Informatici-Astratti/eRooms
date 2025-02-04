import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import prisma from '@/app/lib/db'
import { CalendarCheck2, House, LogIn, LogOut, UserRound, UserRoundCog } from 'lucide-react'
import getUser from '@/app/lib/user'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton } from '@clerk/nextjs'
import CreateBookingCliente from './CreateBookingCliente'
import { Proprieta } from '@prisma/client'

interface NavBarProps{
    propertyInfo: Proprieta 
}

export default async function NavBar({propertyInfo} : NavBarProps) {

  

  const user = await getUser()

  const navLinks = [
    {
      title: "Home",
      link: "/v"
    },
    {
      title: "Stanze",
      link: "/v/rooms"
    },
    {
      title: "Contatti",
      link: "/v/contacts"
    }
  ]


  return (
    <header className="border-b">
      <div className="flex h-20 items-center px-4 max-w-7xl mx-auto">
        <Link href="/v" className="mr-6 flex items-center space-x-2">
          {/* DA IMPLEMENTARE POI <Image src="/placeholder.svg" alt="Logo" width={40} height={40} className="rounded-full" />*/}
          <span className='rounded-full p-2 border'>
            <House />
          </span>
          <span className="text-xl font-bold">{propertyInfo?.nome}</span>
        </Link>
        <nav className="flex items-center space-x-6 ml-6">
          {
            navLinks.map((link) => (
              <Link key={link.title} href={link.link} className="font-medium transition-colors hover:text-primary relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                {link.title}
              </Link>
            ))
          }
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {
            user ?
              (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={'outline'} className='shadow-none'>
                      <UserRound />
                      {`${user?.nome} ${user?.cognome}`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Il Mio Profilo</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={"#"}>
                        <CalendarCheck2 />
                        Le Mie Prenotazioni
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={"#"}>
                        <UserRoundCog />
                        Impostazioni Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <SignOutButton>
                      <DropdownMenuItem>
                        <LogOut />
                        Logout
                      </DropdownMenuItem>
                    </SignOutButton>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
              :
              (
                <Button variant={'outline'} className='shadow-none' asChild>
                  <Link href={"/login"}>
                    <LogIn />
                    Log-In
                  </Link>
                </Button>
              )
          }
          <CreateBookingCliente />
        </div>
      </div>
    </header>
  )
}
