"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react"
import type { stato_prenotazione } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Update the Payment type to match the structure of the fetched data
type Payment = {
  idPagamento: string
  tipoPagamento: string
  importo: number
  created_at: Date
  descrizione: string | null
  dataSaldo: Date | null
  Prenotazioni: {
    idPrenotazione: string
    stato: stato_prenotazione
    Profili_Prenotazioni_codProfiloToProfili: {
      nome: string
      cognome: string
    }
  } | null
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "cliente",
    header: "Cliente e Prenotazione",
    cell: ({ row }) => {
      const nomeOspite = row.original.Prenotazioni?.Profili_Prenotazioni_codProfiloToProfili;
      const idPrenotazione = row.original.Prenotazioni?.idPrenotazione;

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
      const nomeCliente = row.original.Prenotazioni?.Profili_Prenotazioni_codProfiloToProfili
      const nomeCompleto = nomeCliente?.nome && nomeCliente.cognome ? nomeCliente.nome.concat(" ", nomeCliente.cognome) : "N/A"
      return nomeCompleto.toLowerCase().includes(value.toLowerCase());
    }
  },
  {
    accessorKey: "tipoPagamento",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="w-full" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tipo di Pagamento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const tipo = row.original.tipoPagamento
      return (
        <div className="font-bold text-center">{tipo}</div>
      )
    }
  },
  {
    accessorKey: "descrizione",
    header: "Descrizione",
    cell: ({ row }) => {
      const descrizione = row.original.descrizione

      return (
        <>
          <div>
            {descrizione}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Data Creazione",
    cell: ({ row }) => {
      const dataCreazione = row.original.created_at

      return (
        <>
          <div>
            {dataCreazione.toLocaleDateString("it-IT", {
              timeZone: "UTC",
            })}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "importo",
    header: "Importo",
    cell: ({ row }) => {
      const pagamenti = row.original;
      const prenotazioni = row.original.Prenotazioni

      return (
        <>
          <div className="text-sm font-bold text-green-600">
            {prenotazioni?.stato === "CONFERMATA" && pagamenti.importo.toFixed(2).concat(" €")}
          </div>
          <div className="text-sm font-bold text-red-600">
            {(prenotazioni?.stato === "ANNULLATA_HOST" || prenotazioni?.stato === "ANNULLATA_UTENTE" || prenotazioni?.stato === "PRENOTATA") && pagamenti.importo.toFixed(2).concat(" €")}
          </div>
          <div className="text-sm text-muted-foreground">
            {pagamenti.dataSaldo?.toLocaleDateString() ?? "Non pagata"}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "Prenotazioni.stato",
    header: "Stato Pagamento",
    cell: ({ row }) => {
      const stato = row.original
      if (stato.Prenotazioni?.stato === "CONFERMATA") {
        return (<Badge variant="success">EFFETTUATO</Badge>)
      } else if (stato.Prenotazioni?.stato === "PRENOTATA") {
        return (<Badge variant="destructive">NON EFFETTUATO</Badge>)
      } else {
        return ("Non definito")
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Azioni</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => {
              if (payment.Prenotazioni) {
                navigator.clipboard.writeText(payment.Prenotazioni.idPrenotazione)
              }
            }}>
              Copia ID Prenotazione
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },

]
