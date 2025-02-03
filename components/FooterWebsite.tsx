import { Proprieta } from '@prisma/client'
import { House } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface FooterWebsiteProps {
    propertyInfo: Proprieta
}

export default function FooterWebsite({ propertyInfo }: FooterWebsiteProps) {
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
        <footer className='bg-muted py-16 px-4 mt-auto'>
            <div className='flex items-center justify-around'>
                {/*LOGO*/}
                <div className='flex items-center'>
                    <Link href="/v" className="mr-6 flex items-center space-x-2">
                        {/* DA IMPLEMENTARE POI <Image src="/placeholder.svg" alt="Logo" width={40} height={40} className="rounded-full" />*/}
                        <span className='rounded-full p-2 border'>
                            <House />
                        </span>
                        <span className="text-xl font-bold">{propertyInfo?.nome}</span>
                    </Link>
                </div>

                <div className='flex flex-col items-center gap-3'>
                    <div className='flex gap-2 *:border-x-2 *:px-2'>
                        <p>{`INDIRIZZO: ${propertyInfo.indirizzo}; ${propertyInfo.citta} ${propertyInfo.CAP}`}</p>
                        <p>{`TELEFONO: ${propertyInfo.telefono}`}</p>
                        <a href={`mailto:${propertyInfo.email}`} className='no-underline visited:text-current'>{`${propertyInfo.email?.toUpperCase()}`}</a>
                    </div>
                    <nav className="flex items-center space-x-6 ">
                        {
                            navLinks.map((link) => (
                                <Link key={link.title} href={link.link} className="font-bold">
                                    {link.title.toUpperCase()}
                                </Link>
                            ))
                        }
                    </nav>

                    <p className='font-semibold'>FUNZIONA CON e-Rooms©</p>

                </div>


                {/*Riferimenti*/}

            </div>

        </footer>
    )
}
