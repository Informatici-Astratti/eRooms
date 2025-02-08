"use client"

import React, { useCallback, useEffect, useState } from 'react'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {Button} from "@/components/ui/button"
import { CalendarX, Ellipsis } from 'lucide-react'
import prisma from '@/app/lib/db'
import { Badge } from './ui/badge'
import { formatEnumValue } from '@/app/lib/formatEnum'
import { cn } from '@/app/lib/utils'
import { stato_prenotazione } from '@prisma/client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { annullaBooking, BookingOspitiPagamenti, getBookingById } from '@/app/admin/booking/bookingAction'
import { useToast } from '@/hooks/use-toast'

interface BookingInfoViewProps{
    idPrenotazione: string
}

export default function BookingInfoView({idPrenotazione}: BookingInfoViewProps) {

    const {toast} = useToast()

    const [bookingInfo, setBookingInfo] = useState<BookingOspitiPagamenti | null>(null)
    
    const fetchBooking = useCallback(async () => {
        try {
          const data = await getBookingById(idPrenotazione);
          if (!data){
            throw new Error()
          }
          setBookingInfo(data);
        } catch (error) {
          console.error("Errore nel fetching dei dati: ", error);
        }
      }, [idPrenotazione]);
    
    useEffect(() => {
        fetchBooking();
    }, [fetchBooking]);

    const handleAnnullaPrenotazione = async () => {
        const res = await annullaBooking(idPrenotazione)

        if (!res.success){
            toast({
                title: "Errore",
                description: res.error,
                variant: "destructive"
            })
        } else {
            fetchBooking()
            toast({
                title: "Prenotazione Annullata",
                description: "La prenotazione è stata annullata correttamente",
                variant: "success"
            })
        }
    }

  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button size={"icon"}>
                <Ellipsis />
            </Button>
        </SheetTrigger>
        <SheetContent className='flex flex-col sm:min-w-fit sm:max-w-[600px] overflow-y-auto'>
            <SheetHeader>
            <SheetTitle>Riepilogo prenotazione</SheetTitle>
            <SheetDescription>
                Visualizza le informazioni sulla prenotazione
            </SheetDescription>
            </SheetHeader>

            <div className='flex flex-col gap-4'>
                <div className='p-4 border rounded-md flex flex-col gap-2'>
                    <p>{`Rif: ${bookingInfo?.idPrenotazione}`}</p>

                    <div className='flex items-center gap-4'>
                        <p>{"Stato: "}</p>
                        <BadgeStatoPrenotazione stato={bookingInfo?.stato}/>
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant={"destructive"}>
                                <CalendarX />
                                Annulla Prenotazione
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          Una volta cancellata la prenotazione non avrà più valenza nella struttura di riferimento
                                      </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>Annulla</AlertDialogCancel>
                                      <AlertDialogAction className='bg-background' onClick={() => handleAnnullaPrenotazione()}>
                                            Si, annulla prenotazione
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                        

                    </div>

                </div>

            </div>


        </SheetContent>
    </Sheet>

  )
}

interface BadgeStatoPrenotazioneProps{
    stato?: stato_prenotazione
}

const BadgeStatoPrenotazione: React.FC<BadgeStatoPrenotazioneProps> = ({stato}) => {

    const variant = () => {switch (stato){
        case stato_prenotazione.PRENOTATA:
            return "attesa"
        case stato_prenotazione.CONFERMATA:
            return "success"
        case stato_prenotazione.ANNULLATA_HOST:
        case stato_prenotazione.ANNULLATA_UTENTE:
            return "destructive"
        default:
            return "outline"
    }}

    return stato && (
        
        <Badge variant={variant()}>
            {formatEnumValue(stato).toUpperCase()}
        </Badge>
    )
}
