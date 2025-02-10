"use server"

import prisma from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import getUser from "@/app/lib/user";
import { Ospiti, Prisma, ruolo, Stanze, stato_prenotazione, tipo_documento, tipo_pagamento } from "@prisma/client";
import { differenceInDays, format } from "date-fns";
import { z } from "zod";


export async function getPrenotazioni() {
    const user = await getUser()

    if (!user || user.ruolo !== ruolo.PROPRIETARIO) {
        throw new Error("Non sei Autorizzato")
    }

    try {
      const prenotazioni = await prisma.prenotazioni.findMany({
        include: {
          Stanze: true,
          Profili_Prenotazioni_codProfiloToProfili: true,
          Pagamenti: true
        },
      });
      return prenotazioni;
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error);
      throw new Error("Si è verificato un errore nel recupero dei dati.");
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

export type UpdateOspitiFormErrors = z.inferFormattedError<typeof updateOspitiSchema>

export interface UpdateOspitiResponse {
    success: boolean,
    message: string,
    errors?: z.inferFormattedError<typeof updateOspitiSchema> | null
}



// TODO : Implementare
export async function updateOspiti({idPrenotazione, ospiti}: UpdateOspitiProps): Promise<UpdateOspitiResponse> {

    const validatedDataOspiti = updateOspitiSchema.safeParse(ospiti)

    if (!validatedDataOspiti.success) {
        console.log(validatedDataOspiti.error.format())
        return {
            success: false,
            message: "Errore nei dati",
            errors: validatedDataOspiti.error.format()
        }
    }

    try {

        ospiti.forEach(async ospite => {
            const updateOspiteRes = await prisma.ospiti.update({
                data: {
                    nome: ospite.nome,
                    cognome: ospite.cognome,
                    cf: ospite.cf,
                    tipoDocumento: ospite.tipoDocumento,
                    idDocumento: ospite.idDocumento,
                    dataRilascio: ospite.dataRilascio,
                    dataScadenza: ospite.dataScadenza
                },
                where: {
                    idOspite: ospite.idOspite
                }
            })

            if (!updateOspiteRes) {
                throw new Error("Errore nell'aggiornamento dell'ospite")
            }
        })

        return {
            success: true,
            message: "Ospiti aggiornati correttamente",
            errors: null
        }

    } catch (error) {
        return {
            success: false,
            message: "Errore nell'aggiornamento degli ospiti",
            errors: null
        }
    }
    
}

interface GetGuestsActionResponse {
    success: boolean,
    guests?: Ospiti[]
}

export async function getGuestsAction(idPrenotazione: string): Promise<GetGuestsActionResponse> {
    
    try{
        const guests = await prisma.ospiti.findMany({
            where: {
              codPrenotazione: idPrenotazione,
            },
        });

        if (!guests) {
            throw new Error("Nessun ospite trovato");
        }

        return {
            success: true,
            guests
        }
    } catch (e) {
        return {
            success: false
        }
    }
}

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

      // Verifca e creazione di un Customer Stripe per l'utente
  
      const userStripeCustomerId = await prisma.profili.findUnique({
        where: {
          idProfilo: validatedData.data.userId
        }
      })

      let stripeCustomerId = userStripeCustomerId?.stripeCustomerId

      if(!stripeCustomerId){
        const customer = await stripe.customers.create({
            email: userStripeCustomerId?.email,
            name: userStripeCustomerId?.nome + " " + userStripeCustomerId?.cognome,
        })

        stripeCustomerId = customer.id

        const updatedUser = await prisma.profili.update({
            data: {
                stripeCustomerId: stripeCustomerId
            },
            where: {
                idProfilo: validatedData.data.userId
            }
        })

        if(!updatedUser) throw new Error("Errore nell'aggiornamento Stripe utente")
      }

      // Calcolo importo del pernotto
      const importoTotale = (validatedData.data.costoUnitario * validatedData.data.ospiti * differenceInDays(validatedData.data.dataFine, validatedData.data.dataInizio))

      // Creazione Metadati per il pagamento

      const roomData = await prisma.stanze.findUnique({
        where: {
          idStanza: validatedData.data.idStanza
        },
        select: {
            nome: true
        }
      })

      const propertyData = await prisma.proprieta.findFirst({
        select: {
            nome: true
        }
      })

        const nomePagamento = `Prenotazione ${propertyData?.nome} - ${roomData?.nome}`
        const descrizionePagamento = `Prenotazione dal ${format(validatedData.data.dataInizio, "dd/MM/yyyy")} al ${format(validatedData.data.dataFine, "dd/MM/yyyy")} x ${validatedData.data.ospiti} ospiti`

      const paymentSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
            {
                price_data: {
                    currency: "EUR",
                    product_data: {
                        name: nomePagamento,
                        description: descrizionePagamento,
                    },
                    unit_amount: importoTotale * 100,
                },
                quantity: 1,
            }
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/mybookings/${createdBooking.idPrenotazione}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/mybookings/${createdBooking.idPrenotazione}`

      })

      if (!paymentSession) throw new Error("Non è stato possibile creare il pagamento con Stripe")

      const createPayment = await prisma.pagamenti.create({
        data: {
          codPrenotazione: createdBooking.idPrenotazione,
          stripePaymentId: paymentSession.id,
          nome: nomePagamento,
          descrizione: descrizionePagamento,
          importo: importoTotale,
          tipoPagamento: tipo_pagamento.ALLOGGIO,
        }
      })
  
      if (!createPayment) throw new Error("Non è stato possibile creare il pagamento")
    } catch (e) {
     
      return false;
    }
  
    return true;
  }
