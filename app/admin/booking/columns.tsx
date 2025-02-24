"use client"

import { type Prenotazioni as PrenotazioniType, type Stanze, type Profili, type Pagamenti, tipo_pagamento } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { CalendarCog, MoreHorizontal } from "lucide-react"

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
import { format } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"

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
      const idPrenotazione = row.original.idPrenotazione
      const nomeCompleto = nomeCliente.Profili_Prenotazioni_codProfiloToProfili.nome && nomeCliente.Profili_Prenotazioni_codProfiloToProfili.cognome ? nomeCliente.Profili_Prenotazioni_codProfiloToProfili.nome.concat(" ", nomeCliente.Profili_Prenotazioni_codProfiloToProfili.cognome) : "N/A"
      return nomeCompleto.toLowerCase().includes(value.toLowerCase()) || idPrenotazione.includes(value.toLowerCase());
    }
  },
  {
    accessorKey: "dataCreazione",
    header: "Data Creazione",
    cell: ({ row }) => {
      const date = row.original
      const formattedDate = new Date(date.dataCreazione)
        .toLocaleDateString("it-IT", {
          timeZone: "UTC",
        });
      return formattedDate
    },
  },
  {
    accessorKey: "data",
    header: "Check-in / Check-out",
    cell: ({ row }) => {
      const date = row.original
      const dataInizio = formatInTimeZone(date.dataInizio, "Europe/Rome", "dd/MM/yyyy");
      const dataFine = formatInTimeZone(date.dataFine, "Europe/Rome", "dd/MM/yyyy");
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
          <div className={`text-sm font-bold ${prenotazioni.stato === "CONFERMATA" ? 'text-green-600' : 'text-red-600'}`}>
            {pagamenti.reduce((sum, pagamento) => sum + (pagamento.importo || 0), 0).toFixed(2)}
          </div>
          
          <div className="text-sm text-muted-foreground">
            {(() => {
              const pagamentoAlloggio = pagamenti.find(p => p.tipoPagamento === tipo_pagamento.ALLOGGIO);
              return pagamentoAlloggio?.dataSaldo
                ? pagamentoAlloggio.dataSaldo.toLocaleDateString("it-IT", { timeZone: "UTC" })
                : "Non Pagata";
            })()}
          </div>
        </>
      );
    },
  },

  {
    accessorKey: "stato",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="hover:text-white hover:bg-primary-700" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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

