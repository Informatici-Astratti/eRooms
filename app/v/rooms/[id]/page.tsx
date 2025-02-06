import prisma from '@/app/lib/db'
import ImageCarousel from '@/components/ImageCarousel'
import { HousePlus, Info, UsersRound } from 'lucide-react'
import React from 'react'

export default async function RoomPage({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {

    const id = (await params).id

    const room = await prisma.stanze.findUnique({
        where:{
            idStanza: id
        },
        include: {
            FotoStanze: {
                select:{
                    url: true
                }
            }
        }
    })

    const roomServices = [
        "Wi-Fi gratuito",
        "TV satellitare",
        "Minibar",
        "Aria condizionata",
        "Asciugacapelli",
        "Cassaforte",
        "Servizio in camera 24/7",
        "Macchina del caffè",
        "Vista panoramica",
        "Vasca idromassaggio",
        "Accappatoi e pantofole",
        "Colazione inclusa",
        "Scrivania e sedia da lavoro",
        "Smart TV con Netflix",
        "Telefono con linea diretta",
        "Pulizia giornaliera",
        "Prodotti da bagno di lusso",
        "Ferro e asse da stiro",
        "Tende oscuranti",
        "Accesso alla spa dell'hotel"
      ];
  return (
    <div className='w-full flex flex-col gap-5 my-5'>
        <h1 className='text-center font-medium text-4xl text-[#dfbf89]'>{room?.nome}</h1>
        {room?.FotoStanze && <ImageCarousel images={room?.FotoStanze.map((foto) => foto.url)} imageFit='contain' height={300}/>}
        <div className='flex justify-around bg-[#dfbf89] py-4'>
            <span className='flex gap-3'>
                <UsersRound />
                {`ACCOGLIE ${room?.capienza} PERSONE`}
            </span>
        </div>

        <div className='flex flex-col items-center gap-2'>
            <span className='flex justify-center items-center gap-3 text-[#dfbf89]'>
                <Info />
                <h2 className='text-center font-medium text-2xl '>DESCRIZIONE DELLA CAMERA</h2>
            </span>
            <p className='text-center font-medium w-1/2'>{room?.descrizione}</p>
        </div>

        <div className='flex flex-col items-center gap-2'>
            <span className='flex justify-center items-center gap-3 text-[#dfbf89]'>
                <HousePlus />
                <h2 className='text-center font-medium text-2xl '>ACCESSORI/SERVIZI DELLA CAMERA</h2>
            </span>
            <ul className='text-center'>
                {roomServices.map((service, index) => <li key={index}>{service}</li>)}
            </ul>
        </div>


    </div>
  )
}
