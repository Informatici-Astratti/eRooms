"use server"

import prisma from "@/app/lib/db"
import { Prisma, Stanze, stato_prenotazione } from "@prisma/client"
import { differenceInDays, format, formatDate } from "date-fns"
import { z } from "zod"

export interface SearchAvailableRoomsParams {
  dataInizio: Date
  dataFine: Date
  ospiti: number
}

export type AvailableRooms = Stanze & {
  fotoUrls: string[],
  costoEffettivo: number
}

export async function searchAvailableRooms(query: SearchAvailableRoomsParams): Promise<AvailableRooms[] | undefined> {

  const rooms = await prisma.stanze.findMany({
    where: {
      capienza: {
        gte: query.ospiti,
      },
      Prenotazioni: {
        // Se non esiste prenotazione che si sovrappone al periodo richiesto:
        none: {
          AND: [
            { dataInizio: { lt: query.dataFine } },
            { dataFine: { gt: query.dataInizio } },
            { stato: { notIn: [stato_prenotazione.ANNULLATA_HOST, stato_prenotazione.ANNULLATA_UTENTE] } }
          ]
        }
      }
    },
    include: {
      FotoStanze: {
        select: { url: true },
      },
      // Supponendo che esista una relazione "Tariffe" sulla stanza
      Tariffe: {
        where: {
          dataInizio: { lte: query.dataInizio },
          dataFine: { gte: query.dataFine }
        },
        select: { tipoVariazione: true, variazione: true },
        take: 1
      },
    }
  });

  if (!rooms) {
    return []
  }

  const avaiableRooms: AvailableRooms[] = rooms.map((room) => {

    let costoEffettivo = room.costoStandard

    if (room.Tariffe.length > 0) {
      switch (room.Tariffe[0].tipoVariazione) {
        case "AUMENTO_PERCENTUALE":
          costoEffettivo = room.costoStandard * (1 + (room.Tariffe[0].variazione / 100))
        case "SCONTO_PERCENTUALE":
          costoEffettivo = room.costoStandard * (1 - (room.Tariffe[0].variazione / 100))
        case "AUMENTO_FISSO":
          costoEffettivo = room.costoStandard + room.Tariffe[0].variazione
        case "SCONTO_FISSO":
          costoEffettivo = room.costoStandard - room.Tariffe[0].variazione
        case "NULLA":
          costoEffettivo = room.costoStandard
      }
    }

    return {
      idStanza: room.idStanza,
      nome: room.nome,
      capienza: room.capienza,
      descrizione: room.descrizione,
      costoStandard: room.costoStandard,
      fotoUrls: room.FotoStanze.map(foto => foto.url),
      costoEffettivo: costoEffettivo
    }

  })

  return avaiableRooms
}

export interface BookingData {
  dataInizio: Date
  dataFine: Date
  ospiti: number
  idStanza: string
  nomeStanza: string
  costoUnitario: number
  userId: string
  nome: string
  cognome: string
  dataNascita: Date
}

const CreateBookingSchema = z.object({
  dataInizio: z.date(),
  dataFine: z.date(),
  ospiti: z.number().min(1),
  idStanza: z.string(),
  costoUnitario: z.number().min(0.01),
  userId: z.string()
})

export async function createBooking(bookingData: Partial<BookingData>): Promise<boolean> {

  const validatedData = CreateBookingSchema.safeParse(bookingData)

  try {
    if (!validatedData.success) {
      console.log(validatedData.error.flatten().fieldErrors)
      throw new Error("Errore nei dati");
    }

    const createdBooking = await prisma.prenotazioni.create({
      data: {
        dataInizio: validatedData.data.dataInizio.toISOString(),
        dataFine: validatedData.data.dataFine.toISOString(),
        codStanza: validatedData.data.idStanza,
        codProfilo: validatedData.data.userId
      }
    });

    if (!createdBooking) throw new Error("Prenotazione non è stata creata")

    for (let i = 0; i < validatedData.data.ospiti; i++) {
      const createdGuest = await prisma.ospiti.create({
        data: {
          codPrenotazione: createdBooking.idPrenotazione
        }
      })

      if (!createdGuest) throw new Error("Non è stato possibile creare gli ospiti")
    }

    const createPayment = await prisma.pagamenti.create({
      data: {
        codPrenotazione: createdBooking.idPrenotazione,
        importo: (validatedData.data.costoUnitario * validatedData.data.ospiti * differenceInDays(validatedData.data.dataFine, validatedData.data.dataInizio)),
      }
    })

    if (!createPayment) throw new Error("Non è stato possibile creare il pagamento")
  } catch (e) {
   
    return false;
  }

  return true;
}