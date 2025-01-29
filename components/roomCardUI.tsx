"use client"

import { Pencil, Router, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Stanze } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
import { deleteRoom } from "@/app/admin/room/action";
import { revalidatePath } from "next/cache";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

export default function RoomCard({
  idStanza,
  nome,
  descrizione,
  capienza,
  foto,
}: Stanze) {
    const router = useRouter()

    const handleEditRoom = () => {
      // ce un altro modo
      router.push(`/dashboard/room/${idStanza}`)
      //redirect(`/dashboard/room/${idStanza}`)
    }

    const handleDeleteRoom = async () => {
      await deleteRoom(idStanza)
      router.refresh()
    }

  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden max-w-2xl w-full">
      <div className="w-1/3 relative m-2">
        <img src={foto.length > 0 ? foto[0] : "/placeholder.svg"} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
      </div>
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <h2 className="text-xl font-semibold mb-2">{nome}</h2>
        <p className="text-gray-600">Capienza: {capienza}</p>
        <div className="flex justify-end space-x-2">
          <Button onClick={handleEditRoom}>
              <Pencil />
            </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><Trash2 /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ne sei assolutamente sicuro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione non può essere annullata. Ciò eliminerà definitivamente 
                  la stanza e rimuoverà i tuoi dati dai nostri server.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteRoom}>Continua</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}


