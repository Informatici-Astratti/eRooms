"use client"

import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button'
import { Pencil } from 'lucide-react'
import { AvailableRooms, searchAvailableRooms } from '@/app/v/rooms/_BookingUtente/action'
import { useToast } from '@/hooks/use-toast'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

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

    return (
        <Dialog onOpenChange={() => fetchAvaiableRooms()}>
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
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Stanze disponibili" />
                        </SelectTrigger>
                        <SelectContent>
                            {room.map((room) => (
                                <SelectItem key={room.idStanza} value={room.idStanza}>
                                    {room.nome} - {room.costoEffettivo}€
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    )
}
