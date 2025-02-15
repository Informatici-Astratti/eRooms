"use client"

import React, { use } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { CalendarX, Router } from 'lucide-react'
import { Button } from './ui/button'
import { annullaBooking } from '@/app/admin/booking/bookingAction'
import { useRouter } from 'next/navigation'

interface AnnullaPrenotazioneDialogProps {
    idPrenotazione: string
}

export default function AnnullaPrenotazioneDialog({idPrenotazione}: AnnullaPrenotazioneDialogProps) {

    const {toast} = useToast()

    const router = useRouter()

    async function annullaPrenotazione() {
        const res = await annullaBooking(idPrenotazione)

        if(!res.success){
            toast({
                title: "Errore",
                description: "Si è verificato un errore nell'annullamento della prenotazione. Chiudi e riprova",
                variant: "destructive"
            })
        }
        toast({
            title: "Successo",
            description: "Prenotazione annullata con successo",
            variant: "success"
        })

        router.refresh()
    }
    return (
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
                    <AlertDialogAction className='bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90' onClick={annullaPrenotazione}>
                        Si, annulla prenotazione
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
