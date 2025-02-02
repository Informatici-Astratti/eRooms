"use client"

import { Pencil, Router, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Stanze } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
import { deleteRoom, getFotoURL, StanzeForm } from "@/app/admin/room/action";
import { revalidatePath } from "next/cache";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function RoomCard({
  idStanza,
  nome,
  descrizione,
  capienza,
  costoStandard,
  foto,
}: StanzeForm) {
    const router = useRouter()
    const {toast} = useToast()

    const [roomFoto, setRoomFoto] = useState<string>("https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80")

    useEffect(() => {
      
      const fetchFotoURL = async () => {
        if (foto && foto.length > 0) {
          const url = await getFotoURL(foto[0]);
          setRoomFoto(url);
        }
      };
  
      fetchFotoURL();
    }, [foto]);

    const handleDeleteRoom = async () => {
      const res = await deleteRoom(idStanza)

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
        description: "La stanza è stata eliminata con successo"
      })
      
    }

    const handleGetFotoURL = async (idFoto: string): Promise<string> => {
      return await getFotoURL(idFoto)
    }

  return (
    <div className="flex bg-white rounded-lg shadow-lg overflow-hidden min-w-2xl w-full">
      <div className="w-1/3 relative m-2">
        <AspectRatio ratio={16/9}>
          <Image fill src={roomFoto} alt="Immagine Vetrina Stanza" className="rounded-md object-cover"  />
        </AspectRatio>
      </div>
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <h2 className="text-xl font-semibold mb-2">{nome}</h2>
        <p className="text-gray-600">Capienza: {capienza}</p>
        <p className="text-gray-600">Costo Standard: {costoStandard?.toFixed(2)} €</p>
        <div className="flex justify-end space-x-2">
          <Button asChild>
            <Link href={`/admin/room/${idStanza}`}>
              <Pencil />
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><Trash2 /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro di cancellare la stanza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione è irreversibile. <br/>Ciò eliminerà definitivamente 
                  la stanza.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive" onClick={handleDeleteRoom}>Continua</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}


