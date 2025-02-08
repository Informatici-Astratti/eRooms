import prisma from '@/app/lib/db'
import BookingCard from '@/components/BookingCardUI'
import BookingInfoView from '@/components/BookingInfoView'
import { Button } from '@/components/ui/button'
import { auth } from '@clerk/nextjs/server'
import { Luggage } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default async function MyBookingsPage() {

  const {userId} = await auth()

  if (!userId) {
    return ("/")
  }

  const bookings = await prisma.prenotazioni.findMany({
    select: {
      idPrenotazione: true,
      dataInizio: true,
      dataFine: true,
      stato: true,
      Stanze: {
        select: {
          nome: true,
          FotoStanze: {
            select: {
              url: true
            },
            take: 1,
          }
        }
      },
    },
    where: {
      codProfilo: userId
    }
  })

  return (
    <div className='p-4 flex flex-col gap-3'>
      <h1 className="text-4xl font-bold">Le mie Prenotazioni</h1>
      {
      bookings.length > 0 ? 
      
      (bookings.map(booking => (
        <div className='flex gap-2'>
          <BookingCard 
            idPrenotazione={booking.idPrenotazione} 
            nome={booking.Stanze.nome} 
            dataInizio={booking.dataInizio} 
            dataFine={booking.dataFine} 
            stato={booking.stato} 
            urlFoto={booking.Stanze.FotoStanze[0]?.url}
          />
        </div>
      )))
      :
      (<p>Non ci sono prenotazioni</p>)
    }
        
    </div>
  )
}
