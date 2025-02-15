import ImageCarousel from '@/components/ImageCarousel'
import { Button } from '@/components/ui/button'
import { Prisma } from '@prisma/client'
import Link from 'next/link'
import React from 'react'

interface RoomPreviewProps {
    room: Prisma.StanzeGetPayload<{
        include: {FotoStanze: true}
    }>
    reverse: boolean
}

export default function RoomPreview ({room, reverse}: RoomPreviewProps) {

    const heightFoto = 500
  return (
    <div className={`w-full h-fit flex  ${reverse && "flex-row-reverse"}`}>
        <div className='basis-1/2'>
        <ImageCarousel images={room.FotoStanze.map(foto => foto.url)} animation='slide'/>

        </div>
        <div className='basis-1/2 h-full flex flex-col gap-4 items-center justify-center px-20'>
            <h1 className='text-4xl text-[#dfbf89]'>{room.nome}</h1>
            <p className='text-center line-clamp-3'>{room.descrizione}</p>
            <Button>
                <Link href={`/v/rooms/${room.idStanza}`}>
                    SCOPRI
                </Link>
            </Button>

        </div>


    </div>
  )
}
