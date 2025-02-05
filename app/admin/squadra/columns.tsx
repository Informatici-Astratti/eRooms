"use client"

import type { Profili } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"

export type ProfiliInfo = Profili & { email: string };


export const columns: ColumnDef<ProfiliInfo>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => {
      const nomeCliente = row.original
      return nomeCliente?.nome && nomeCliente?.cognome ? nomeCliente.nome.concat(" ", nomeCliente.cognome) : "N/A"
    },
    filterFn: (row, columnId, value) => {
      const nomeCliente = row.original
      const nomeCompleto =
      nomeCliente?.nome && nomeCliente?.cognome ? nomeCliente.nome.concat(" ", nomeCliente.cognome) : "N/A"

      return nomeCompleto.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.email
      return email
    },
  },
  {
    accessorKey: "ruolo",
    header: "Ruolo",
    cell: ({ row }) => {
      const ruolo = row.original
      return ruolo.ruolo
    },
  }
]



