"use server"

import prisma from "@/app/lib/db"
import type { stato_pulizia } from "@prisma/client"

export async function getPulizie() {
  try {
    const today = new Date()

    const stanze = await prisma.stanze.findMany({
      include: {
        Pulizie: true,
        TurniPulizie: {
          where: {
            dataInizio: {
              gte: today,
            },
          },
          include: {
            Profili: true,
          },
          orderBy: {
            dataInizio: "asc",
          },
        },
        Prenotazioni: {
          where: {
            stato: {
              notIn: ["ANNULLATA_HOST", "ANNULLATA_UTENTE", "PRENOTATA"]
            }
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
    return { message: "", success: false, errors: { descrizione: "Dati mancanti" } }
  }

  try {
    const puliziaAttuale = await prisma.pulizie.findUnique({
      where: { codStanza },
      select: { stato: true, ultimoAggiornamento: true },
    })

    if (!puliziaAttuale) {
      return { message: "", success: false, errors: { descrizione: "Pulizia non trovata" } }
    }

    const now = new Date()

    if (puliziaAttuale.stato === newStato) {
      return {
        message: "",
        success: false,
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

    return { message: "Stato aggiornato con successo", success: true, errors: { descrizione: "" } }
  } catch (error) {
    console.error("Errore nell'aggiornamento dello stato:", error)
    return { message: "", success: false, errors: { descrizione: "Errore nell'aggiornamento dello stato" } }
  }
}

export default async function getGovernanti() {
  try {
    const governante = await prisma.profili.findMany({
      where: { ruolo: "GOVERNANTE" },
    })
    return governante
  } catch (e) {
    console.log(e)
  }
}

export async function addTurnoPulizia(prevState: any, formData: FormData) {
  const codStanza = formData.get("codStanza") as string
  const codGovernante = formData.get("codGovernante") as string
  const dataInizio = formData.get("dataInizio") as string
  const dataFine = formData.get("dataFine") as string

  if (!codStanza || !codGovernante || !dataInizio || !dataFine) {
    return { message: "", success: false, errors: { descrizione: "Dati mancanti" } }
  }

  try {
    // Verifica se per una specifica stanza esiste già una prenotazione per quel giorno
    const existingShift = await prisma.turniPulizie.findFirst({
      where: {
        codStanza,
        OR: [
          {
            dataInizio: {
              gte: new Date(dataInizio),  
            },
          },
          {
            dataFine: {
              gte: new Date(dataInizio),
            },
          },
        ],
      },
    })

    if (existingShift) {
      return {
        message: "",
        success: false,
        errors: {
          descrizione: "Esiste già un turno di pulizia per questa stanza in questa data.",
        },
      }
    }

    await prisma.turniPulizie.create({
      data: {
        codStanza,
        codGovernante,
        dataInizio: new Date(dataInizio),
        dataFine: new Date(dataFine),
      },
    })

    return { message: "Turno di pulizia assegnato con successo", success: true, errors: { descrizione: "" } }
  } catch (error) {
    console.error("Errore nell'assegnazione del turno di pulizia:", error)
    return { message: "", success: false, errors: { descrizione: "Errore nell'assegnazione del turno di pulizia" } }
  }
}

