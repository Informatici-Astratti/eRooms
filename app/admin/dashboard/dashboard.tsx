"use client"

import { useState, useCallback } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { searchBookings } from "./action"
import { Input } from "@/components/ui/input"

interface Booking {
  idPrenotazione: string
  cliente: { nome: string; cognome: string }
  stanze: Array<{ quantita: number; nome: string }>
  dataInizio: string
  dataFine: string
  stato: string
  importo: number
  dataPagamento: string
}

interface Stats {
  newBookingsThisMonth: number
  confirmedPaymentsThisMonth: number
  confirmedPaymentsThisYear: number
  newBookings: number
  arrivals: number
  departures: number
  currentStays: number
  todayArrivals: Booking[]
  todayDepartures: Booking[]
  todayCurrentStays: Booking[]
}

// Gestione del tempo SEARCH (attende che l'utente abbia terminato di digitare per recuperare le informazioni)
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Funzione per raggruppare le prenotazioni per cliente
const groupBookingsByClient = (bookings: Booking[]) => {
  const groupedBookings: { [key: string]: Booking[] } = {}

  bookings.forEach((booking) => {
    const key = booking.cliente.nome.concat(" ", booking.cliente.cognome);
    if (!groupedBookings[key]) {
      groupedBookings[key] = []
    }
    groupedBookings[key].push(booking)
  })

  return groupedBookings
}

export default function Dashboard({ initialStats }: { initialStats: Stats }) {
  const [stats, setStats] = useState<Stats>(initialStats)
  const [searchQuery, setSearchQuery] = useState("")

  //BARRA DI RICERCA
  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim()) {
        const results = await searchBookings(query);
        setStats((prevStats) => ({
          ...prevStats,
          todayArrivals: results.todayArrivals,
          todayDepartures: results.todayDepartures,
          todayCurrentStays: results.todayCurrentStays,
        }));
      } else {
        setStats(initialStats);
      }
    }, 300),
    [],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    handleSearch(query)
  }

  const renderBookingTable = (title: string, bookings: Booking[]) => {
    const groupedBookings = groupBookingsByClient(bookings)

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Camere</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="text-right">Importo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(groupedBookings).length > 0 ? (
                Object.entries(groupedBookings).map(([key, bookings]) => (
                  <TableRow key={key}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{key}</div>
                        <div className="text-sm text-muted-foreground">
                          {bookings.map((b) => (
                            <div key={b.idPrenotazione}>Rif: {b.idPrenotazione}</div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {bookings.flatMap((booking) =>
                        booking.stanze.map((stanza, index) => (
                          <div
                            key={booking.idPrenotazione.concat("-", stanza.nome, "-", index.toString())}
                            className="text-sm text-muted-foreground"
                          >
                            {stanza.quantita} x {stanza.nome}
                          </div>
                        ))
                      )}
                    </TableCell>
                    <TableCell>
                      {bookings.map((booking) => (
                        <div key={booking.idPrenotazione} className="text-sm">
                          <div>{new Date(booking.dataInizio).toLocaleDateString()}</div>
                          <div>{new Date(booking.dataFine).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {bookings.map((booking) => (
                        <div
                          key={booking.idPrenotazione}
                          className={`text-sm font-medium ${booking.stato === "CONFERMATA"
                            ? "status-confermata"
                            : booking.stato === "PRENOTATA"
                              ? "status-prenotata"
                              : "status-default"
                            }`}
                        >
                          {booking.stato}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-right">
                      {bookings.map((booking) => (
                        <div key={booking.idPrenotazione}>
                          <div className="text-sm font-medium">{booking.importo.toFixed(2)} €</div>
                          <div className="text-xs text-muted-foreground">
                            {booking.dataPagamento ? new Date(booking.dataPagamento).toLocaleDateString() : "N/A"}
                          </div>
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nessuna prenotazione trovata
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Cerca per nome o cognome..."
              className="w-full bg-white pl-8 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Pannello di controllo</h2>
        </div>

        <div className="space-y-4">
          <Card className="bg-[#3366FF] text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-base font-medium">Le tue statistiche di questo mese</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-5xl font-bold">{stats.newBookingsThisMonth}</div>
                  <p className="text-sm">Nuove prenotazioni questo mese</p>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold">{stats.confirmedPaymentsThisMonth.toFixed(2)} €</div>
                  <p className="text-sm">L&apos;ultimo mese</p>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold">{stats.confirmedPaymentsThisYear.toFixed(2)} €</div>
                  <p className="text-sm">Da gennaio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#3366FF] text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-base font-medium">Cosa succede oggi</CardTitle>
              <Button variant="secondary" size="sm" className="bg-white hover:bg-gray-100 text-black">
                <Link href="/admin/booking">Vedi Prenotazioni</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-5xl font-bold">{stats.newBookings}</div>
                  <p className="text-sm">Nuove prenotazioni</p>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold">{stats.arrivals}</div>
                  <p className="text-sm">Arrivi</p>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold">{stats.departures}</div>
                  <p className="text-sm">Partenze</p>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold">{stats.currentStays}</div>
                  <p className="text-sm">Pernottamenti</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {renderBookingTable("Arrivi di oggi", stats.todayArrivals)}
          {renderBookingTable("Partenze di oggi", stats.todayDepartures)}
          {renderBookingTable("Pernottamenti di oggi", stats.todayCurrentStays)}
        </div>
      </div>
    </div>
  )
}