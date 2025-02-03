"use client"

import type { Prenotazioni as PrenotazioniType, Stanze, Ospiti, Profili } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { FileUser, MoreHorizontal, Pencil } from "lucide-react"

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

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ModificaPrenotazione from "./editFormPrenotazioni"
import { useState, useEffect } from "react"
import { getAllRooms } from "./action"
import { Badge } from "@/components/ui/badge"

export type PrenotazioneWithRelations = PrenotazioniType & {
  Stanze: Stanze
  Ospiti: Ospiti[]
  Profili_Prenotazioni_codProfiloToProfili: Profili
}

export const columns: ColumnDef<PrenotazioneWithRelations>[] = [
  {
    accessorKey: "idPrenotazione",
    header: "Codice Prenotazione",
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => {
      const nomeOspite = row.original.Profili_Prenotazioni_codProfiloToProfili
      return nomeOspite?.nome && nomeOspite?.cognome ? nomeOspite.nome.concat(" ", nomeOspite.cognome) : "N/A"
    },
    filterFn: (row, columnId, value) => {
      const nomeOspite = row.original.Profili_Prenotazioni_codProfiloToProfili
      const nomeCompleto =
        nomeOspite?.nome && nomeOspite?.cognome ? nomeOspite.nome.concat(" ", nomeOspite.cognome) : "N/A"

      return nomeCompleto.toLowerCase().includes(value.toLowerCase())
    },
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
    accessorKey: "dataInizio",
    header: "Data Inizio",
    cell: ({ row }) => {
      const date = row.original
      const formattedDate = new Date(date.dataInizio).toLocaleDateString()
      return formattedDate
    },
  },
  {
    accessorKey: "dataFine",
    header: "Data Fine",
    cell: ({ row }) => {
      const date = row.original
      const formattedDate = new Date(date.dataFine).toLocaleDateString()
      return formattedDate
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
      if (stato.stato === "PRENOTATA") {
        return (<Badge variant="attesa">PRENOTATA</Badge>)
      } else if(stato.stato === "CONFERMATA") {
        return (<Badge variant="success">CONFERMATA</Badge>)
      }else if(stato.stato === "ANNULLATA_HOST"){
        return (<Badge variant="destructive">ANNULLATA DALL'HOST</Badge>)
      }else if(stato.stato === "ANNULLATA_UTENTE"){
        return (<Badge variant="destructive">ANNULLATA DALL'UTENTE</Badge>)
      } 
  },
},
  {
    id: "actions",
    cell: ({ row }) => {
      const prenotazione = row.original
      const [isEditModalOpen, setIsEditModalOpen] = useState(false)
      const [allRooms, setAllRooms] = useState<Stanze[]>([])

      useEffect(() => {
        const fetchRooms = async () => {
          const rooms = await getAllRooms()
          setAllRooms(rooms)
        }
        fetchRooms()
      }, [])

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
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}><FileUser />Info cliente</DropdownMenuItem>
              </DialogTrigger>
              <GuestsTable ospiti={prenotazione.Ospiti} />
            </Dialog>
            <DropdownMenuSeparator />
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    setIsEditModalOpen(true)
                  }}
                >
                  <Pencil />
                  Modifica
                </DropdownMenuItem>
              </DialogTrigger>
              <ModificaPrenotazione
                prenotazione={prenotazione}
                onClose={() => setIsEditModalOpen(false)}
                allRooms={allRooms}
              />
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function GuestsTable({ ospiti }: { ospiti: Ospiti[] }) {
  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Info Cliente</DialogTitle>
        <DialogDescription>Dettagli sul cliente.</DialogDescription>
      </DialogHeader>
      <Table>
        <TableCaption>Elenco dettagliato del cliente.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Nome</TableHead>
            <TableHead>Cognome</TableHead>
            <TableHead>Codice Fiscale</TableHead>
            <TableHead>Tipo Documento</TableHead>
            <TableHead>ID Documento</TableHead>
            <TableHead>Data Rilascio</TableHead>
            <TableHead>Data Scadenza</TableHead>
            <TableHead>Foto Documento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ospiti.map((ospite: Ospiti) => (
            <TableRow key={ospite.idDocumento}>
              <TableCell>{ospite.nome}</TableCell>
              <TableCell>{ospite.cognome}</TableCell>
              <TableCell className="font-medium">{ospite.cf}</TableCell>
              <TableCell>{ospite.tipoDocumento}</TableCell>
              <TableCell>{ospite.idDocumento}</TableCell>
              <TableCell>{ospite.dataRilascio?.toLocaleDateString()}</TableCell>
              <TableCell>{ospite.dataScadenza?.toLocaleDateString()}</TableCell>
              <TableCell>
                {ospite.fotoDocumento ? (
                  <img
                    src={ospite.fotoDocumento || "/placeholder.svg"}
                    alt="Foto Documento"
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DialogContent>
  )
}

