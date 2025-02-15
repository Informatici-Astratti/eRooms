"use client"

import React, { useState } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button'
import { Check, LoaderCircle, Pencil } from 'lucide-react'
import { AvailableRooms, searchAvailableRooms } from '@/app/admin/booking/bookingAction'
import { useToast } from '@/hooks/use-toast'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { updateBookingStanza } from '@/app/admin/booking/bookingAction'
import { useRouter } from 'next/navigation'

export interface UpdateAvaiableRoomProps {
    idPrenotazione: string
    dataInizio: Date
    dataFine: Date
    ospiti: number
    disabled?: boolean
}

export default function UpdateAvaiableRoom({idPrenotazione, dataInizio, dataFine, ospiti, disabled = false}: UpdateAvaiableRoomProps) {

    const { toast } = useToast()
    const [room, setRoom] = React.useState<AvailableRooms[]>([])
    const [selectedRoom, setSelectedRoom] = React.useState<string | null>(null)
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const router = useRouter()

    async function fetchAvaiableRooms() {
        const res = await searchAvailableRooms({dataInizio, dataFine, ospiti})

        if(!res){
            toast({
                title: "Errore",
                description: "Si è verificato un errore nel caricamento delle stanze disponibili. Chiudi e riprova",
                variant: "destructive"
            })
        }

        setRoom(res!)

    }

    async function updateRoom() {
        setIsLoading(true)
        const res = await updateBookingStanza({idPrenotazione: idPrenotazione, idStanza: selectedRoom!})
        setIsLoading(false)

        if(!res.success){
            toast({
                title: "Errore",
                description: res.error,
                variant: "destructive"
            })
        }

        if (res.success){
            toast({
                title: "Successo",
                description: "Stanza aggiornata con successo",
                variant: "success"
            })
            setOpen(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => {
            setOpen(!open)
            fetchAvaiableRooms()
        }}>
            <DialogTrigger asChild>
                <Button variant={"outline"} disabled={disabled}>
                    <Pencil />
                    Modifica Stanza
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifica l'assegnazione della stanza</DialogTitle>
                    <DialogDescription>
                        Modifica l'assegnazione della stanza con una tra quelle indicate
                    </DialogDescription>
                </DialogHeader>

                <div className='flex items-center gap-4'>
                    <p>Stanze disponibili: </p>

                    {room.length === 0 && (
                        <div className="w-[180px] h-[40px] bg-gray-200 animate-pulse rounded"></div>
                    )}

                    {room.length > 0 &&(
                    <Select onValueChange={(value) => setSelectedRoom(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Stanze disponibili" />
                        </SelectTrigger>
                        <SelectContent>
                            {room.map((room) => (
                                <SelectItem key={room.idStanza} value={room.idStanza}>
                                    {room.nome} - {room.capienza} posti letto
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    )}

                </div>

                <DialogFooter>
                    <Button onClick={updateRoom} disabled={!selectedRoom || isLoading}>
                        {isLoading ? (
                            <>
                            <LoaderCircle className="animate-spin"/>
                            Caricamento
                            </>
                        ) : (
                            <>
                            <Check />
                            Salva
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
