"use client"

import type { Profili } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { removeTeamUser } from "./action"

export type ProfiliInfo = Profili 

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
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const profile = row.original
      const { toast } = useToast()
      const router = useRouter()

      const handleDeleteTeamUser = async (id: string) => {
        try {
          // Uncomment and implement the actual delete logic
          const res = await removeTeamUser(id)
          if (!res.success) {
            throw new Error("Errore Sconosciuto")
          }

          router.refresh()

          toast({
            variant: "success",
            title: "Successo",
            description: "L'utente è stato eliminato dalla squadra di lavoro",
          })
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Errore",
            description: error instanceof Error ? error.message : "Errore Sconosciuto",
          })
        }
      }

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Rimuovi</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Vuoi davvero rimuovere l'utente dalla squadra?</AlertDialogTitle>
              <AlertDialogDescription>
                Questa azione non può essere annullata. Ciò rimuoverà il suddetto account dalla squadra dello staff.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={() => handleDeleteTeamUser(profile.idProfilo)}
              >
                Conferma
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]

