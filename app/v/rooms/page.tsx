import prisma from '@/app/lib/db'
import React from 'react'
import RoomPreview from './RoomPreview'

export default async function RoomsPage() {

    const rooms = await prisma.stanze.findMany({
        include:{
            FotoStanze: true
        }
    })

  return (
    <div className='w-full flex flex-col'>
        {rooms.map((room, index) => (
            <RoomPreview key={room.idStanza} room={room} reverse={index % 2 == 0} />
        ))}

    </div>
  )
}
