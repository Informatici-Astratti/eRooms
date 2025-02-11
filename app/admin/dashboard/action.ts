"use server"

import prisma from "@/app/lib/db"

// Funzione per ottenere le prenotazioni di oggi
async function getTodayBookings() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const bookings = await prisma.prenotazioni.findMany({
    where: {
      OR: [
        { dataInizio: { gte: today, lt: tomorrow } },
        { dataFine: { gte: today, lt: tomorrow } },
        { AND: [{ dataInizio: { lt: tomorrow } }, { dataFine: { gt: today } }] },
      ],
    },
    include: {
      Profili_Prenotazioni_codProfiloToProfili: {
        select: {
          nome: true,
          cognome: true,
        },
      },
      Stanze: {
        select: {
          nome: true,
        },
      },
      Pagamenti: {
        select: {
          importo: true,
          dataSaldo: true,
        },
      },
    },
  })

  // Funzione per mappare le prenotazioni
  const mapBookings = (bookings: any[]) =>
    bookings.map((booking) => ({
      idPrenotazione: booking.idPrenotazione,
      cliente: {
        nome: booking.Profili_Prenotazioni_codProfiloToProfili.nome,
        cognome: booking.Profili_Prenotazioni_codProfiloToProfili.cognome,
      },
      stanze: [
        {
          quantita: 1,
          nome: booking.Stanze.nome,
        },
      ],
      dataInizio: booking.dataInizio.toISOString(),
      dataFine: booking.dataFine.toISOString(),
      stato: booking.stato,
      importo: booking.Pagamenti.reduce((sum: any, payment: { importo: any }) => sum + payment.importo, 0),
      dataPagamento: booking.Pagamenti[0]?.dataSaldo?.toISOString() || "",
    }))

  // Filtra le prenotazioni per arrivi, partenze e soggiorni attuali
  const todayArrivals = bookings.filter( //ARRIVI
    (b) =>
      b.dataInizio >= today &&
      b.dataInizio < tomorrow &&
      b.stato !== "ANNULLATA_UTENTE" &&
      b.stato !== "ANNULLATA_HOST" &&
      b.stato != "PRENOTATA"
  )
  const todayDepartures = bookings.filter( //PARTENZE
    (b) =>
      b.dataFine >= today && b.dataFine < tomorrow && b.stato !== "ANNULLATA_UTENTE" && b.stato !== "ANNULLATA_HOST" && b.stato != "PRENOTATA",
  )
  const todayCurrentStays = bookings.filter( //PERNOTTAMENTI (ESCLUDENDO LE PARTENZE)
    (b) =>
      b.dataInizio < tomorrow &&
      b.dataFine > today &&
      b.dataFine >= tomorrow && // Esclude le prenotazioni che terminano oggi
      b.stato !== "ANNULLATA_UTENTE" &&
      b.stato !== "ANNULLATA_HOST" &&
      b.stato != "PRENOTATA"
  )

  return {
    todayArrivals: mapBookings(todayArrivals),
    todayDepartures: mapBookings(todayDepartures),
    todayCurrentStays: mapBookings(todayCurrentStays),
  }
}

// Funzione principale per ottenere le statistiche
export async function getStatistics() {
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1)
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999)

  const [newBookingsThisMonth, confirmedPaymentsThisMonth, confirmedPaymentsThisYear, dailyStats, todayBookings] =
    await Promise.all([
      // Nuove prenotazioni create questo mese
      prisma.prenotazioni.count({
        where: {
          dataCreazione: {
            gte: firstDayOfMonth,
          },
        },
      }),
      // Pagamenti confermati per questo mese
      prisma.pagamenti.aggregate({
        _sum: {
          importo: true,
        },
        where: {
          dataSaldo: {
            gte: firstDayOfMonth,
          },
        },
      }),
      // Pagamenti confermati per quest'anno
      prisma.pagamenti.aggregate({
        _sum: {
          importo: true,
        },
        where: {
          dataSaldo: {
            gte: firstDayOfYear,
            lte: lastDayOfYear,
          }
        },
      }),
      // Statistiche giornaliere
      getDailyStatistics(),
      // Prenotazioni di oggi
      getTodayBookings(),
    ])

  return {
    newBookingsThisMonth,
    confirmedPaymentsThisMonth: confirmedPaymentsThisMonth._sum.importo || 0,
    confirmedPaymentsThisYear: confirmedPaymentsThisYear._sum.importo || 0,
    ...dailyStats,
    ...todayBookings,
  }
}

// Funzione per ottenere le statistiche giornaliere
async function getDailyStatistics() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [newBookings, arrivals, departures, currentStays] = await Promise.all([
    // Nuove prenotazioni create oggi
    prisma.prenotazioni.count({
      where: {
        dataCreazione: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),
    // Arrivi (prenotazioni che iniziano oggi)
    prisma.prenotazioni.count({
      where: {
        dataInizio: {
          gte: today,
          lt: tomorrow,
        },
        NOT: {
          stato: { in: ["ANNULLATA_UTENTE", "ANNULLATA_HOST", "PRENOTATA"] },
        },
      },
    }),
    // Partenze (prenotazioni che terminano oggi)
    prisma.prenotazioni.count({
      where: {
        dataFine: {
          gte: today,
          lt: tomorrow,
        },
        NOT: {
          stato: { in: ["ANNULLATA_UTENTE", "ANNULLATA_HOST", "PRENOTATA"] },
        },
      },
    }),
    // Soggiorni attuali (prenotazioni che includono oggi, escluse le partenze)
    prisma.prenotazioni.count({
      where: {
        AND: [
          { dataInizio: { lt: tomorrow } },
          { dataFine: { gt: today } },
          { dataFine: { gte: tomorrow } }, // Esclude le prenotazioni che terminano oggi
          { NOT: { stato: { in: ["ANNULLATA_UTENTE", "ANNULLATA_HOST", "PRENOTATA"] } } },
        ],
      },
    }),
  ])

  return {
    newBookings,
    arrivals,
    departures,
    currentStays,
  }
}

// Funzione per cercare le prenotazioni
export async function searchBookings(query: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const bookings = await prisma.prenotazioni.findMany({
    where: query
      ? {
        OR: [
          { Profili_Prenotazioni_codProfiloToProfili: { nome: { contains: query, mode: "insensitive" } } },
          { Profili_Prenotazioni_codProfiloToProfili: { cognome: { contains: query, mode: "insensitive" } } },
        ],
      }
      : {},
    include: {
      Profili_Prenotazioni_codProfiloToProfili: {
        select: {
          nome: true,
          cognome: true,
        },
      },
      Stanze: {
        select: {
          nome: true,
        },
      },
      Pagamenti: {
        select: {
          importo: true,
          dataSaldo: true,
        },
      },
    },
  })

  const mapBookings = (bookings: any[]) =>
    bookings.map((booking) => ({
      idPrenotazione: booking.idPrenotazione,
      cliente: {
        nome: booking.Profili_Prenotazioni_codProfiloToProfili.nome,
        cognome: booking.Profili_Prenotazioni_codProfiloToProfili.cognome,
      },
      stanze: [
        {
          quantita: 1,
          nome: booking.Stanze.nome,
        },
      ],
      dataInizio: booking.dataInizio.toISOString(),
      dataFine: booking.dataFine.toISOString(),
      stato: booking.stato,
      importo: booking.Pagamenti.reduce((sum: any, payment: { importo: any }) => sum + payment.importo, 0),
      dataPagamento: booking.Pagamenti[0]?.dataSaldo?.toISOString() || "",
    }))

  const mappedBookings = mapBookings(bookings)

  // Filtra le prenotazioni per oggi
  return {
    todayArrivals: mappedBookings.filter(
      (b) =>
        new Date(b.dataInizio) >= today &&
        new Date(b.dataInizio) < tomorrow &&
        b.stato !== "ANNULLATA_UTENTE" &&
        b.stato !== "ANNULLATA_HOST" &&
        b.stato != "PRENOTATA"
    ),
    todayDepartures: mappedBookings.filter(
      (b) =>
        new Date(b.dataFine) >= today &&
        new Date(b.dataFine) < tomorrow &&
        b.stato !== "ANNULLATA_UTENTE" &&
        b.stato !== "ANNULLATA_HOST" &&
        b.stato != "PRENOTATA"
    ),
    todayCurrentStays: mappedBookings.filter(
      (b) =>
        new Date(b.dataInizio) < tomorrow &&
        new Date(b.dataFine) > today &&
        new Date(b.dataFine) >= tomorrow && // Esclude le prenotazioni che terminano oggi
        b.stato !== "ANNULLATA_UTENTE" &&
        b.stato !== "ANNULLATA_HOST" &&
        b.stato != "PRENOTATA"
    ),
  }
}

