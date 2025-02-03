"use server"

import prisma from "@/app/lib/db"
import type { stato_pulizia } from "@prisma/client"

export async function getPulizie() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const roomsWithCheckouts = await prisma.prenotazioni.findMany({
      where: {
        dataFine: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      select: {
        codStanza: true,
      },
    })

    for (const room of roomsWithCheckouts) {
      await prisma.pulizie.upsert({
        where: { codStanza: room.codStanza },
        update: { stato: "DA_PULIRE", ultimoAggiornamento: new Date() },
        create: { codStanza: room.codStanza, stato: "DA_PULIRE", ultimoAggiornamento: new Date() },
      })
    }

    const stanze = await prisma.stanze.findMany({
      include: {
        Pulizie: true,
        TurniPulizie: {
          include: {
            Profili: true,
          },
          orderBy: {
            dataInizio: "desc",
          },
          take: 1,
        },
        Prenotazioni: {
          where: {
            dataFine: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // next day
            },
          },
        },
      },
    })

    return stanze
  } catch (error) {
    console.error("Errore nel recupero delle stanze:", error)
    throw new Error("Si è verificato un errore nel recupero dei dati.")
  }
}

export async function updatePuliziaStato(prevState: any, formData: FormData) {
  const codStanza = formData.get("codStanza") as string
  const newStato = formData.get("newStato") as stato_pulizia

  if (!codStanza || !newStato) {
    return { message: "", errors: { descrizione: "Dati mancanti" } }
  }

  try {
    const puliziaAttuale = await prisma.pulizie.findUnique({
      where: { codStanza },
      select: { stato: true, ultimoAggiornamento: true },
    })

    if (!puliziaAttuale) {
      return { message: "", errors: { descrizione: "Pulizia non trovata" } }
    }

    const now = new Date()
    const lastUpdate = puliziaAttuale.ultimoAggiornamento
    const isToday = lastUpdate.toDateString() === now.toDateString()

    if (isToday && puliziaAttuale.stato === "DA_PULIRE" && newStato === "PULITA") {
      return {
        message: "",
        errors: { descrizione: "Non è possibile cambiare lo stato da DA PULIRE a PULITA nello stesso giorno" },
      }
    }

    if (puliziaAttuale.stato === newStato) {
      return {
        message: "",
        errors: { descrizione: "Lo stato attuale è già quello selezionato" },
      }
    }

    await prisma.pulizie.update({
      where: { codStanza },
      data: {
        stato: newStato,
        ultimoAggiornamento: now,
      },
    })

    return { message: "Stato aggiornato con successo", errors: { descrizione: "" } }
  } catch (error) {
    console.error("Errore nell'aggiornamento dello stato:", error)
    return { message: "", errors: { descrizione: "Errore nell'aggiornamento dello stato" } }
  }
}

