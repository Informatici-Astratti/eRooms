"use server";

import prisma from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import type { Profili, Stanze, stato_prenotazione } from "@prisma/client";
import { z } from "zod";

export async function getPrenotazioni() {
  try {
    const prenotazioni = await prisma.prenotazioni.findMany({
      include: {
        Stanze: true,
        Ospiti: true,
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

export async function getAllRooms() {
  try {
    const rooms = await prisma.stanze.findMany();
    return rooms;
  } catch (error) {
    console.error("Errore nel recupero delle stanze:", error);
    throw new Error("Si è verificato un errore nel recupero delle stanze.");
  }
}

export async function checkRoomAvailability(
  roomId: string,
  startDate: Date,
  endDate: Date,
  currentBookingId: string
) {
  //Per gestire la prenotazione della stanza (verificando che non sia gia occupata)
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

  return overlappingBookings.length === 0;
}

export async function updateBooking(
  prevState: any,
  formData: FormData
): Promise<{ errors?: { descrizione: string }; message?: string }> {
  const bookingId = formData.get("idPrenotazione") as string;
  const dataInizio = new Date(formData.get("dataInizio") as string);
  const dataFine = new Date(formData.get("dataFine") as string);
  const stato = formData.get("stato") as stato_prenotazione;
  const codStanza = formData.get("codStanza") as string;

  const isAvailable = await checkRoomAvailability(
    codStanza,
    dataInizio,
    dataFine,
    bookingId
  );

  if (!isAvailable) {
    return {
      errors: {
        descrizione: "La stanza non è disponibile per le date selezionate.",
      },
    };
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
    });
    revalidatePath("/booking");
    return { message: "Prenotazione aggiornata con successo." };
  } catch (error) {
    console.error("Errore nell'aggiornamento della prenotazione:", error);
    return {
      errors: {
        descrizione:
          "Si è verificato un errore nell'aggiornamento della prenotazione.",
      },
    };
  }
}

export async function createReservation(
  codProfilo: string,
  dataInizio: Date,
  dataFine: Date,
  codStanza: string,
  importoTotale: number
) {
  try {
    const reservation = await prisma.prenotazioni.create({
      data: {
        codProfilo,
        dataInizio,
        dataFine,
        codStanza,
        stato: "PRENOTATA" as stato_prenotazione,
      },
    });

    await prisma.pagamenti.create({
      data: {
        importo: importoTotale,
        codPrenotazione: reservation.idPrenotazione,
      },
    });

    revalidatePath("/admin/booking");
    return { success: true, message: "Reservation created successfully." };
  } catch (error) {
    console.error("Error creating reservation:", error);
    return { success: false, message: "Failed to create reservation." };
  }
}

export async function getAvailableRooms(
  startDate: Date,
  endDate: Date
): Promise<Stanze[]> {
  try {
    const availableRooms = await prisma.stanze.findMany({
      where: {
        NOT: {
          Prenotazioni: {
            some: {
              AND: [
                { stato: { notIn: ["ANNULLATA_HOST", "ANNULLATA_UTENTE"] } },
                {
                  OR: [
                    // La prenotazione inizia prima o esattamente a endDate e termina dopo o esattamente a startDate.
                    {
                      dataInizio: { lte: endDate },
                      dataFine: { gte: startDate },
                    },
                    // La prenotazione inizia all'interno del range.
                    { dataInizio: { gte: startDate, lte: endDate } },
                    // La prenotazione termina all'interno del range.
                    { dataFine: { gte: startDate, lte: endDate } },
                  ],
                },
              ],
            },
          },
        },
      },
    });
    return availableRooms;
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    throw new Error("Failed to fetch available rooms.");
  }
}

export async function getOspiti(): Promise<Profili[]> {
  try {
    const users = await prisma.profili.findMany({
      where: { ruolo: "CLIENTE" },
    });
    return users
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users.");
  }
}

interface ReservationResponse {
  success: boolean
  errors?: any
  message?: string
}

const ReservationFormSchema = z.object({
  dateFrom: z.string().datetime(),
  dateTo: z.string().datetime(),
  roomId: z.string().min(1, { message: "Seleziona una stanza" }),
  guestId: z.string().min(1, { message: "Seleziona un ospite" }),
  numberOfGuests: z.number().min(1, { message: "Inserisci almeno un ospite" }),
})

export async function createNewReservation(
  prevState: ReservationResponse,
  formData: FormData,
): Promise<ReservationResponse> {
  const data = {
    dateFrom: formData.get("dateFrom") as string,
    dateTo: formData.get("dateTo") as string,
    roomId: formData.get("roomId") as string,
    guestId: formData.get("guestId") as string,
    numberOfGuests: Number(formData.get("numberOfGuests")),
  }

  const result = ReservationFormSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }
  console.log(data)
  try {
    /*
    const newReservation = await prisma.prenotazioni.create({
      data: {
        dataInizio: new Date(result.data.dateFrom),
        dataFine: new Date(result.data.dateTo),
        codStanza: result.data.roomId,
        codProfilo: result.data.guestId,
      },
    })*/

    revalidatePath("/admin/booking")
    return {
      success: true,
      message: "La prenotazione è stata creata con successo",

    }
  } catch (error) {
    console.error("Error creating reservation:", error)
    return {
      success: false,
      errors: {
        general:
          "Si è verificato un errore nella creazione della prenotazione. Verificare i dati o riprovare più tardi",
      },

    }
  }
}