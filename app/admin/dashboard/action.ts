"use server"

import prisma from "@/lib/db"

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
  const todayArrivals = bookings.filter((b) => b.dataInizio >= today && b.dataInizio < tomorrow)
  const todayDepartures = bookings.filter((b) => b.dataFine >= today && b.dataFine < tomorrow)
  const todayCurrentStays = bookings.filter((b) => b.dataInizio < tomorrow && b.dataFine > today)

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
          Prenotazioni: {
            stato: "CONFERMATA",
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
          },
          Prenotazioni: {
            stato: "CONFERMATA",
          },
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
      },
    }),
    // Partenze (prenotazioni che terminano oggi)
    prisma.prenotazioni.count({
      where: {
        dataFine: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),
    // Soggiorni attuali (prenotazioni che includono oggi, escluse le partenze)
    prisma.prenotazioni.count({
      where: {
        AND: [{ dataInizio: { lt: tomorrow } }, { dataFine: { gt: today } }],
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
    todayArrivals: mappedBookings.filter((b) => new Date(b.dataInizio) >= today && new Date(b.dataInizio) < tomorrow),
    todayDepartures: mappedBookings.filter((b) => new Date(b.dataFine) >= today && new Date(b.dataFine) < tomorrow),
    todayCurrentStays: mappedBookings.filter((b) => new Date(b.dataInizio) < tomorrow && new Date(b.dataFine) > today),
  }
}

