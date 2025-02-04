import React from 'react'

import prisma from '../lib/db'
import ImageCarousel from '@/components/ImageCarousel'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


export default async function HomePage() {

  const foto = await prisma.fotoStanze.findMany({
    select: {
      url: true
    },
    take: 10
  })

  const rooms = await prisma.stanze.findMany({
    select: {
      nome: true,
      idStanza: true,
      FotoStanze: {
        select: {
          url: true
        }
      }
    }
  })



  return (
    <div className='w-full flex flex-col'>
      <ImageCarousel images={foto.map(foto => foto.url)} fullScreen={true} animation='fade' autoplay={true} autoplayInterval={2000} />
      <div className='flex flex-col gap-2 items-center justify-center py-20 '>
        <h2 className='font-medium text-4xl text-[#dfbf89]'>Nel centro della Puglia</h2>
        <p className='text-center'>Un moderno Bed & Breakfast, poco distante dall’Aeroporto di Bari, <br />
          in una posizione strategica per raggiungere i più suggestivi punti d’interesse in Puglia <br />
          ed in pochi minuti il centro di Bari. <br />
          Perfetto per tutte le esigenze come lavoro, turismo e relax!</p>
      </div>

      <span className='py-4 bg-zinc-900'></span>

      <div className='grid grid-cols-4 w-full'>
        {rooms.map(room => (

          <div key={room.idStanza} className="relative bg-gray-200 overflow-hidden group h-64 w-full" >
            <div className="absolute inset-0 transition-transform duration-300 ease-in-out group-hover:scale-110">
              <Image
                src={room.FotoStanze?.[0]?.url ?? "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"}
                alt={"Foto anteprima di "+room.nome}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end items-center p-4">
              <p className="text-white text-xl font-semibold mb-4">{room.nome}</p>
              <Button asChild>
              <Link href={`/v/rooms/${room.idStanza}`}>
                SCOPRI
              </Link>
            </Button>
            </div>
          </div>
        ))}

      </div>



    </div>
  )
}
