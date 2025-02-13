"use client"

import { Ellipsis, Pencil, Router, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Stanze, Tariffe, tipo_variazione } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns"
import { formatEnumValue } from "@/app/lib/formatEnum";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditTariffaForm from "@/app/admin/room/EditTariffaForm";
import { deleteTariffa } from "@/app/admin/room/tariffeAction";

interface TariffaCardProps {
  tariffa: Tariffe
}

export default function TariffaCard({ tariffa }: TariffaCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const handleDeleteTariffa = async () => {
    const res = await deleteTariffa(tariffa.idTariffa)

    if (!res.success){
      toast({
        variant: "destructive",
        title: "Errore",
        description: res.errors ? res.errors.toString() : "Errore Sconosciuto"
      })

      return
    }
    
    router.refresh()

    toast({
      variant: "success",
      title: "Successo",
      description: "La Tariffa è stata eliminata con successo"
    })
    
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-md border overflow-hidden w-4/5 p-3">
      <p className="font-bold">{formatEnumValue(tariffa.tipoVariazione)}</p>
      <p>{tariffa.variazione + " " + (tariffa.tipoVariazione === tipo_variazione.AUMENTO_PERCENTUALE || tariffa.tipoVariazione === tipo_variazione.SCONTO_PERCENTUALE ? "%" : "€")}</p>
      <div className="flex flex-col gap-2 text-sm">
        <p><span className="font-bold">Da:</span> {format(tariffa.dataInizio, 'dd/MM/yyyy')}</p>
        <p><span className="font-bold">A:</span> {format(tariffa.dataFine, 'dd/MM/yyyy')}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="flex flex-col gap-2 w-full">

            <DropdownMenuItem asChild>
              <EditTariffaForm tariffa={tariffa} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"destructive"}>
                    <Trash2 />
                    Elimina
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sei sicuro di cancellare la tariffa?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Questa azione è irreversibile. Ciò la eliminerà definitivamente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive" onClick={handleDeleteTariffa}>Continua</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}


