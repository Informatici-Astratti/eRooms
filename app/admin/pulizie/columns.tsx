"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Stanze as StanzaType, Pulizie, TurniPulizie, Profili, Prenotazioni } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { CirclePlus, MoreHorizontal, Pencil } from "lucide-react"
import { useState } from "react"
import ModificaStatus from "./editStatus"

export type StanzeWithRelations = StanzaType & {
  Pulizie: Pulizie | null
  TurniPulizie: (TurniPulizie & {
    Profili: Profili
  })[]
  Prenotazioni?: Prenotazioni[]
}

export const columns: ColumnDef<StanzeWithRelations>[] = [
  {
    accessorKey: "nomeStanza",
    header: "Nome Stanza",
    cell: ({ row }) => {
      const stanze = row.original;
      return stanze.nome || ''; // Restituisce una stringa vuota se 'nome' è null
    },
    filterFn: (row, columnId, value) => {
      const stanze = row.original;
      const nomeStanza = stanze.nome || ''; // Se nome è null, usa una stringa vuota
      return nomeStanza.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "stato",
    header: "Stato",
    cell: ({ row }) => {
      const stanza = row.original
      if (stanza.Pulizie?.stato == "PULITA") {
        return (<Badge variant="success">PULITA</Badge>)
      } else {
        return (<Badge variant="destructive">DA PULIRE</Badge>)
      }
    },
  },
  {
    accessorKey: "assegnazione",
    header: "Assegnato a:",
    cell: ({ row }) => {
      const turni = row.original.TurniPulizie
      const lastTurno = turni[turni.length - 1]
      return lastTurno?.Profili?.nome && lastTurno?.Profili.cognome ? lastTurno.Profili?.nome.concat(" ", lastTurno.Profili?.cognome) : "Non assegnato"
    },
  },
  {
    accessorKey: "dataInizio",
    header: "Data Inizio",
    cell: ({ row }) => {
      const dataInzio = row.original;
      if (dataInzio.TurniPulizie && dataInzio.TurniPulizie.length > 0) {
        return dataInzio.TurniPulizie[0].dataInizio.toLocaleDateString();
      } else {
        return "Non definita"; 
      }
    },
  },
  {
    accessorKey: "dataFine",
    header: "Data Fine",
    cell: ({ row }) => {
      const dataFine = row.original;
      if (dataFine.TurniPulizie && dataFine.TurniPulizie.length > 0 && dataFine.TurniPulizie[0].dataFine) {
        return dataFine.TurniPulizie[0].dataFine.toLocaleDateString();
      } else {
        return "Non definita";
      }
    },
  },

  {
    accessorKey: "checkOut",
    header: "Check-out",
    cell: ({ row }) => {
      const stanza = row.original
      const hasCheckoutToday = stanza.Prenotazioni && stanza.Prenotazioni.length > 0
      return hasCheckoutToday ? "Si" : "No"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const pulizie = row.original.Pulizie
      const [isEditModalOpen, setIsEditModalOpen] = useState(false)


      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-400 bg-gray-200">
              <span className="sr-only">Apri menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Azioni</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}><CirclePlus />Assegna Pulizia</DropdownMenuItem>
              </DialogTrigger>
              {/*<GuestsTable ospiti={prenotazione.Ospiti} /> -*/}
            </Dialog>
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    setIsEditModalOpen(true)
                  }}
                >
                  <Pencil />
                  Modifica Stato
                </DropdownMenuItem>
              </DialogTrigger>
              <ModificaStatus
                pulizie={pulizie}
                onClose={() => setIsEditModalOpen(false)}
              />
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]


