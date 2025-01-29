"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react"
import type { stato_prenotazione } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Update the Payment type to match the structure of the fetched data
type Payment = {
  idPagamento: string
  metodo: string | null
  importo: number
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
    accessorKey: "Prenotazioni",
    header: "Prenotazione",
    cell: ({ row }) => {
      const prenotazione = row.getValue("Prenotazioni") as Payment["Prenotazioni"]
      return prenotazione
        ? `${prenotazione.Profili_Prenotazioni_codProfiloToProfili.nome} ${prenotazione.Profili_Prenotazioni_codProfiloToProfili.cognome}`
        : "N/A"
    },
  },
  {
    accessorKey: "metodo",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Metodo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "importo",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Importo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("importo"))
      const formatted = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "dataSaldo",
    header: ({ column }) => {
      return (
        <Button  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Data Saldo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("dataSaldo") as Date | null
      if (!date) return "N/A"
      return date.toLocaleDateString("it-IT")
    },
  },
  {
    accessorKey: "Prenotazioni.stato",
    header: "Stato Pagamento",
    cell: ({ row }) => {
      const stato = row.original.Prenotazioni?.stato
      if (stato == "CONFERMATA") {return "EFFETTUATO"}
      else if (stato == "PRENOTATA") {return "NON EFFETTUATO"}
      else {return "N/A"}
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
