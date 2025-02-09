import BookingInfoComponent from '@/components/BookingInfoComponent'
import React from 'react'

export default async function AdminBookingInfoPage({ params }: { params: Promise<{ id: string }> }) {

    const idPrenotazione = (await params).id
    
    return (
        <BookingInfoComponent idPrenotazione={idPrenotazione} />
    )
}
