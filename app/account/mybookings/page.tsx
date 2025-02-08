import prisma from '@/app/lib/db'
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
      idPrenotazione: true
    },
    where: {
      codProfilo: userId
    }
  })

  return (
    <div className='p-4 flex flex-col gap-3'>

      {
      bookings.length > 0 ? 
      
      (bookings.map(booking => (
        <div className='flex gap-2'>
          <p>{booking.idPrenotazione}</p>
          <Button variant='outline'>
            <Link href={`/account/mybookings/${booking.idPrenotazione}`}>
              <Luggage />
              Dettagli
            </Link>
          </Button>

        </div>
      )))
      :
      (<p>Non ci sono prenotazioni</p>)
    }
        
    </div>
  )
}
