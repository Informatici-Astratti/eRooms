"use server"

import prisma from "@/app/lib/db";
import getUser from "@/app/lib/user";
import { Ospiti, Prisma, ruolo, stato_prenotazione, tipo_documento } from "@prisma/client";
import { differenceInDays } from "date-fns";
import { z } from "zod";

export async function getAllBookings() {

    const user = await getUser()

    if (!user || user.ruolo !== ruolo.PROPRIETARIO) {
        throw new Error("Non sei Autorizzato")
    }

    try {
        const allBookings = await prisma.prenotazioni.findMany()
        return allBookings

    } catch (e) {
        throw new Error("Errore nel Database")
    }

}

interface GetUserBookingProps {
    userId: string
}

export async function getUserBooking({ userId }: GetUserBookingProps) {

    try {
        const bookings = await prisma.prenotazioni.findMany({
            select: {
                idPrenotazione: true
            },
            where: {
                codProfilo: userId
            }
        })
    } catch (e) {
        throw new Error("Errore nel Database")
    }
}


export type BookingOspitiPagamenti = Prisma.PrenotazioniGetPayload<{
    include: {
        Ospiti: true,
        Pagamenti: true
    }
}>

export async function getBookingById(idPrenotazione: string): Promise<BookingOspitiPagamenti | null> {
    try {
        const bookingInfo = await prisma.prenotazioni.findUnique({
            where: { idPrenotazione: idPrenotazione },
            include: {
                Pagamenti: true,
                Ospiti: true
            }
        })

        return bookingInfo
    } catch (e) {
        console.log(e)
        return null
    }
}

interface BookingResponse {
    success: boolean,
    error?: string
}

export async function annullaBooking(idPrenotazione: string): Promise<BookingResponse> {

    try {
        const user = await getUser()

        if (!user) {
            throw new Error("Devi loggarti per forza")
        }

        let userBooking;

        if (user.ruolo === ruolo.PROPRIETARIO) {
            userBooking = await prisma.prenotazioni.update({
                data: {
                    stato: stato_prenotazione.ANNULLATA_HOST
                },
                where: {
                    idPrenotazione: idPrenotazione
                }
            })
        } else if (user.ruolo === ruolo.CLIENTE) {
            userBooking = await prisma.prenotazioni.update({
                data: {
                    stato: stato_prenotazione.ANNULLATA_UTENTE
                },
                where: {
                    idPrenotazione: idPrenotazione,
                    codProfilo: user.idProfilo
                }
            })
        } else {
            throw new Error("Ruolo non riconosciuto")
        }



        if (!userBooking) {
            throw new Error("Questa prenotazione non è esistente o non appartiene all'utente loggato")
        }

        return {
            success: true
        }
    } catch (error) {

        let errorMessage = "Si è verificato un errore"
        if (error instanceof Error) {
            errorMessage = error.message
        } else {
            errorMessage = String(error)
        }

        return {
            success: false,
            error: errorMessage
        }

    }
}

interface UpdateBookingStanzaProps {
    idPrenotazione: string
    idStanza: string
}

export async function updateBookingStanza({ idPrenotazione, idStanza }: UpdateBookingStanzaProps) {

    try {

        const user = await getUser()

        if (!user || !(user?.ruolo === ruolo.PROPRIETARIO)) {
            throw new Error("Devi essere loggato con un account amministratore")
        }

        const booking = await prisma.prenotazioni.findUnique({
            where: { idPrenotazione },
            select: {
                Ospiti: true,
                dataInizio: true,
                dataFine: true,
            }
        });

        if (!booking) {
            throw new Error("Prenotazione non trovata");
        }

        const stanzaDisponibile = await prisma.stanze.findFirst({
            where: {
                idStanza: idStanza,
                capienza: {
                    gte: booking.Ospiti.length,
                },
                Prenotazioni: {
                    none: {
                        AND: [
                            { dataInizio: { lt: booking.dataFine } },
                            { dataFine: { gt: booking.dataInizio } },
                            { stato: { notIn: [stato_prenotazione.ANNULLATA_HOST, stato_prenotazione.ANNULLATA_UTENTE] } }
                        ]
                    }
                }
            },
            include: {
                Tariffe: {
                    where: {
                        dataInizio: { lte: booking.dataInizio },
                        dataFine: { gte: booking.dataFine }
                    },
                    select: { tipoVariazione: true, variazione: true },
                    take: 1
                }
            }
        });

        if (!stanzaDisponibile) {
            throw new Error("La stanza selezionata non è disponibile o non ha capacità sufficiente per il numero di ospiti");
        }

        const updateBookingRoom = await prisma.prenotazioni.update({
            data: {
                codStanza: idStanza,
            },
            where: {
                idPrenotazione,
            }
        });

        if (!updateBookingRoom) {
            throw new Error("Errore nell'aggiornamento della stanza")
        }

        const firstPagamento = await prisma.pagamenti.findFirst({
            select: {
                idPagamento: true
            },
            where: {
                codPrenotazione: idPrenotazione,
            },
            orderBy: {
                created_at: 'asc'
            }
        });

        if (!firstPagamento) {
            throw new Error("Nessun pagamento trovato per questa prenotazione");
        }

        let costoEffettivo = stanzaDisponibile.costoStandard

        if (stanzaDisponibile.Tariffe.length > 0) {
            switch (stanzaDisponibile.Tariffe[0].tipoVariazione) {
                case "AUMENTO_PERCENTUALE":
                    costoEffettivo = stanzaDisponibile.costoStandard * (1 + (stanzaDisponibile.Tariffe[0].variazione / 100))
                case "SCONTO_PERCENTUALE":
                    costoEffettivo = stanzaDisponibile.costoStandard * (1 - (stanzaDisponibile.Tariffe[0].variazione / 100))
                case "AUMENTO_FISSO":
                    costoEffettivo = stanzaDisponibile.costoStandard + stanzaDisponibile.Tariffe[0].variazione
                case "SCONTO_FISSO":
                    costoEffettivo = stanzaDisponibile.costoStandard - stanzaDisponibile.Tariffe[0].variazione
                case "NULLA":
                    costoEffettivo = stanzaDisponibile.costoStandard
            }
        }

        const updatePagamento = await prisma.pagamenti.update({
            data: {
                importo: costoEffettivo * booking.Ospiti.length * differenceInDays(booking.dataFine, booking.dataInizio),
            },
            where: {
                idPagamento: firstPagamento.idPagamento,
            }
        });

        if (!updatePagamento) {
            throw new Error("Errore nell'aggiornamento del pagamento");
        }

        return {
            success: true
        }

    } catch (error) {

        let errorMessage = "Si è verificato un errore"
        if (error instanceof Error) {
            errorMessage = error.message
        } else {
            errorMessage = String(error)
        }

        return {
            success: false,
            error: errorMessage
        }


    }

}

const updateOspitiSchema = z.array(z.object({
    idOspite: z.string(),
    nome: z.string({
        message: "Nome Richiesto"
    }),
    cognome: z.string({
        message: "Cognome Richiesto"
    }),
    cf: z.string().trim().length(16).regex(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i, { message: "Codice Fiscale non valido" }),
    tipoDocumento: z.nativeEnum(tipo_documento, {
        message: "Tipo documento non valido"
    }),
    idDocumento: z.string({
        message: "Identificativo del documento non valido"
    }),
    dataRilascio: z.date(),
    dataScadenza: z.date(),
    codPrenotazione: z.string()
}).refine(data => {
    return data.dataRilascio < data.dataScadenza
},
    {
        message: "Le date non sono valide",
        path: ["dataScadenza"]
    }
))

interface UpdateOspitiProps {
    idPrenotazione: string
    ospiti: Ospiti[]
}

interface UpdateOspitiResponse {
    success: boolean,
    message: string,
    errors: z.inferFlattenedErrors<typeof updateOspitiSchema>["fieldErrors"]
}

// TODO : Implementare
export async function updateOspiti({ idPrenotazione, ospiti }: UpdateOspitiProps) {
    const validatedDataOspiti = updateOspitiSchema.safeParse(ospiti)

    try {

        if (!validatedDataOspiti.success) {
            console.log(validatedDataOspiti.error.flatten().fieldErrors)
            throw new Error("I dati non sono validi")
        }

    } catch (error) {

    }
}
