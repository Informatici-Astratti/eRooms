"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Profili } from "@prisma/client"
// Define the Profiles type based on your actual database schema


export const columns: ColumnDef<Profili>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button className="hover:text-white hover:bg-primary-700" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "cognome",
    header: ({ column }) => {
        return (
          <Button className="hover:text-white hover:bg-primary-700" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Cognome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },

    filterFn: (row, columId, value) => {
      const cognomeCliente = row.original.cognome;
      const filtro = cognomeCliente;
      return filtro.toLowerCase().includes(value.toLowerCase());
    }
    
  },
  {
    accessorKey: "telefono",
    header: "Telefono",
  },
  {
    accessorKey: "cf",
    header: "Codice Fiscale",
  },
  {
    accessorKey: "dataNascita",
    header: "Data di Nascita",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dataNascita"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "genere",
    header: "Genere",
  },
]

