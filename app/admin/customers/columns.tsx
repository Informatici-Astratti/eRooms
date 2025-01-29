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
        <Button className="" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
          <Button className="" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Cognome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
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
/*{
    id: "actions",
    cell: ({ row }) => {
      const profile = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(profile.idProfilo)}>
              Copy profile ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View profile details</DropdownMenuItem>
            <DropdownMenuItem>Edit profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },*/
]

