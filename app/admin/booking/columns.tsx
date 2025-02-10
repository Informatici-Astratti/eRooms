"use client"

import type { Prenotazioni as PrenotazioniType, Stanze, Profili, Pagamenti } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { CalendarCog,  MoreHorizontal} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"

import BadgeStatoPrenotazione from "@/components/BadgeStatoPrenotazione"
import Link from "next/link"

export type PrenotazioneWithRelations = PrenotazioniType & {
  Stanze: Stanze
  Profili_Prenotazioni_codProfiloToProfili: Profili
  Pagamenti: Pagamenti[]
}

export const columns: ColumnDef<PrenotazioneWithRelations>[] = [
  {
    accessorKey: "cliente",
    header: "Cliente e Prenotazione",
    cell: ({ row }) => {
      const nomeOspite = row.original.Profili_Prenotazioni_codProfiloToProfili;
      const idPrenotazione = row.original.idPrenotazione;

      return (
        <>
          <div className="font-medium">
            {nomeOspite?.nome && nomeOspite?.cognome
              ? nomeOspite.nome.concat(" ", nomeOspite.cognome)
              : "N/A"}
          </div>
          <div className="text-sm text-muted-foreground">Rif:{idPrenotazione}</div>
        </>
      );
    },
    filterFn: (row, columId, value) => {
      const nomeCliente = row.original
      const nomeCompleto = nomeCliente.Profili_Prenotazioni_codProfiloToProfili.nome && nomeCliente.Profili_Prenotazioni_codProfiloToProfili.cognome ? nomeCliente.Profili_Prenotazioni_codProfiloToProfili.nome.concat(" ", nomeCliente.Profili_Prenotazioni_codProfiloToProfili.cognome) : "N/A" 
      return nomeCompleto.toLowerCase().includes(value.toLowerCase());
    }
  },
  {
    accessorKey: "dataCreazione",
    header: "Data Creazione",
    cell: ({ row }) => {
      const date = row.original
      const formattedDate = new Date(date.dataCreazione).toLocaleDateString()
      return formattedDate
    },
  },
  {
    accessorKey: "data",
    header: "Check-in / Check-out",
    cell: ({ row }) => {
      const date = row.original
      const dataInizio = new Date(date.dataInizio).toLocaleDateString()
      const dataFine = new Date(date.dataFine).toLocaleDateString()
      return (
        <>
          <div>
            {dataInizio}
          </div>
          <div>
            {dataFine}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "nomeStanza",
    header: "Nome Stanza",
    cell: ({ row }) => {
      const stanze = row.original.Stanze
      return stanze.nome
    },
  },
  {
    accessorKey: "importo",
    header: "Importo",
    cell: ({ row }) => {
      const pagamenti = row.original.Pagamenti ?? [];
      const prenotazioni = row.original

      return (
        <>
          <div className="text-sm font-bold text-green-600">
            {prenotazioni.stato === "CONFERMATA" && pagamenti[0].importo.toFixed(2).concat(" €")}
          </div>
          <div className="text-sm font-bold text-red-600">
            {(prenotazioni.stato === "ANNULLATA_HOST" || prenotazioni.stato === "ANNULLATA_UTENTE" || prenotazioni.stato === "PRENOTATA") && pagamenti[0].importo.toFixed(2).concat(" €")}
          </div>
          <div className="text-sm text-muted-foreground">
            {pagamenti[0].dataSaldo?.toLocaleDateString() ?? "Non pagata"}
          </div>
        </>
      );
    },
  },

  {
    accessorKey: "stato",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Stato
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stato = row.original
      return <BadgeStatoPrenotazione stato={stato.stato} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const prenotazione = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size={"icon"}>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Azioni Prenotazione</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button variant="ghost" asChild>
                <Link href={`/admin/booking/${prenotazione.idPrenotazione}`}>
                    <CalendarCog className="size-4" />
                    Dettagli Prenotazione
                </Link>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

