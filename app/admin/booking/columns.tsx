"use client"

import type { Prenotazioni as PrenotazioniType, Stanze, Ospiti, Profili, Pagamenti } from "@prisma/client"
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
      if (stato.stato === "PRENOTATA") {
        return (<Badge variant="attesa">PRENOTATA</Badge>)
      } else if (stato.stato === "CONFERMATA") {
        return (<Badge variant="success">CONFERMATA</Badge>)
      } else if (stato.stato === "ANNULLATA_HOST") {
        return (<Badge variant="destructive">ANNULLATA DALL'HOST</Badge>)
      } else if (stato.stato === "ANNULLATA_UTENTE") {
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
            <DropdownMenuSeparator />
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}><FileUser />Info cliente</DropdownMenuItem>
              </DialogTrigger>
              <GuestsTable ospiti={prenotazione.Ospiti} />
            </Dialog>
            {(prenotazione.stato === "PRENOTATA") && (
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setIsEditModalOpen(true);
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
            )}
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
            {/* <TableHead>Foto Documento</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ospiti.length > 0 ? (
            ospiti.map((ospite: Ospiti) => (
              <TableRow key={ospite.idDocumento}>
                <TableCell>{ospite.nome}</TableCell>
                <TableCell>{ospite.cognome}</TableCell>
                <TableCell className="font-medium">{ospite.cf}</TableCell>
                <TableCell>{ospite.tipoDocumento}</TableCell>
                <TableCell>{ospite.idDocumento}</TableCell>
                <TableCell>{ospite.dataRilascio?.toLocaleDateString()}</TableCell>
                <TableCell>{ospite.dataScadenza?.toLocaleDateString()}</TableCell>
                {/* <TableCell>
                {ospite.fotoDocumento ? (
                  <img
                    src={ospite.fotoDocumento || "/placeholder.svg"}
                    alt="Foto Documento"
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  "N/A"
                )}
              </TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Nessun ospite registrato
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DialogContent>
  );
}

