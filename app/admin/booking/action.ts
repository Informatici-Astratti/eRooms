"use server"

import prisma from "@/app/lib/db"
import { revalidatePath } from "next/cache"
import type { stato_prenotazione } from "@prisma/client"

export async function getPrenotazioni() {
    try {
        const prenotazioni = await prisma.prenotazioni.findMany({
            include: {
                Stanze: true,
                Ospiti: true,
                Profili_Prenotazioni_codProfiloToProfili: true
            },
        })
        return prenotazioni
    } catch (error) {
        console.error("Errore nel recupero delle prenotazioni:", error)
        throw new Error("Si è verificato un errore nel recupero dei dati.")
    }
}

export async function getAllRooms() {
    try {
        const rooms = await prisma.stanze.findMany()
        return rooms
    } catch (error) {
        console.error("Errore nel recupero delle stanze:", error)
        throw new Error("Si è verificato un errore nel recupero delle stanze.")
    }
}

export async function checkRoomAvailability(roomId: string, startDate: Date, endDate: Date, currentBookingId: string) { //Per gestire la prenotazione della stanza (verificando che non sia gia occupata)
    const overlappingBookings = await prisma.prenotazioni.findMany({
        where: {
            codStanza: roomId,
            NOT: { idPrenotazione: currentBookingId },
            OR: [
                { dataInizio: { lte: endDate }, dataFine: { gte: startDate } },
                { dataInizio: { gte: startDate, lte: endDate } },
                { dataFine: { gte: startDate, lte: endDate } },
            ],
        },
    });

    return overlappingBookings.length === 0
}

export async function updateBooking(
    prevState: any,
    formData: FormData,
): Promise<{ errors?: { descrizione: string }; message?: string }> {
    const bookingId = formData.get("idPrenotazione") as string
    const dataInizio = new Date(formData.get("dataInizio") as string)
    const dataFine = new Date(formData.get("dataFine") as string)
    const stato = formData.get("stato") as stato_prenotazione
    const codStanza = formData.get("codStanza") as string

    const isAvailable = await checkRoomAvailability(codStanza, dataInizio, dataFine, bookingId)

    if (!isAvailable) {
        return {
            errors: {
                descrizione: "La stanza non è disponibile per le date selezionate.",
            },
        }
    }

    try {
        const updatedBooking = await prisma.prenotazioni.update({
            where: { idPrenotazione: bookingId },
            data: {
                dataInizio,
                dataFine,
                stato,
                codStanza,
            },
        })
        revalidatePath("/booking")
        return { message: "Prenotazione aggiornata con successo." }
    } catch (error) {
        console.error("Errore nell'aggiornamento della prenotazione:", error)
        return {
            errors: {
                descrizione: "Si è verificato un errore nell'aggiornamento della prenotazione.",
            },
        }
    }
}

