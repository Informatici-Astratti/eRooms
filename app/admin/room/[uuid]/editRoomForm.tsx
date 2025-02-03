"use client";

import ErrorForm from "@/components/ErrorForm";
import NumericInput from "@/components/numericInputUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import './scrollbar.css';
import { 
  createRoom, 
  createRoomPicture, 
  deleteRoomPicture, 
  getFotoURL, 
  StanzeForm, 
  updateRoomById 
} from "../action";
import { UploadButton } from "@/app/lib/uploadthing";
import RoomPicture from "@/components/RoomPicture";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EditRoomFormProps {
  room: StanzeForm | null;
}

export default function EditRoomForm({ room }: EditRoomFormProps) {
  const { toast } = useToast();

  const [state, formAction, isPending] = useActionState(room ? updateRoomById : createRoom, {
    success: false,
    fields: room ?? { idStanza: "", nome: "", capienza: 0, descrizione: "", costoStandard: 0, foto: [] },
  });

  // Stato per salvare gli ID delle foto
  const [foto, setFoto] = useState<string[]>(state?.fields?.foto ?? []);
  // Stato per salvare gli URL delle foto
  const [fotoURLs, setFotoURLs] = useState<string[]>([]);

  // Effetto per aggiornare gli URL ogni volta che cambia lo state "foto"
  useEffect(() => {
    const fetchFotoURLs = async () => {
      if (foto.length > 0) {
        const urls = await Promise.all(
          foto.map(async (idFoto) => await getFotoURL(idFoto))
        );
        setFotoURLs(urls);
      } else {
        setFotoURLs([]);
      }
    };

    fetchFotoURLs();
  }, [foto]);

  const handleRemoveRoomPicture = async (idFoto: string) => {
    const res = await deleteRoomPicture(idFoto);

    if (!res) {
      toast({
        title: "Errore",
        description: "C'è stato un errore nella cancellazione della foto",
        variant: "destructive",
      });
      return;
    }

    // Trova l'indice della foto da rimuovere
    const indexToRemove = foto.indexOf(idFoto);
    if (indexToRemove === -1) return;

    // Aggiorna lo state degli ID delle foto
    setFoto((prevFotos) => prevFotos.filter((item) => item !== idFoto));

    // Aggiorna lo state degli URL rimuovendo quello corrispondente
    setFotoURLs((prevURLs) => {
      const newURLs = [...prevURLs];
      newURLs.splice(indexToRemove, 1);
      return newURLs;
    });

    toast({
      title: "Successo",
      description: "Foto rimossa correttamente",
      variant: "success",
    });
  };

  const handleAddRoomPicture = async (idFoto: string) => {
    const res = await createRoomPicture(idFoto);

    if (res) {
      // Aggiorna gli ID delle foto
      setFoto((prev) => [...prev, idFoto]);

      // Recupera l'URL della foto aggiunta e aggiorna lo state degli URL
      const newUrl = await getFotoURL(idFoto);
      setFotoURLs((prev) => [...prev, newUrl]);

      toast({
        title: "Successo",
        description: "Foto caricata correttamente",
        variant: "success",
      });
    } else {
      toast({
        title: "Errore",
        description: "Non è stato possibile caricare la foto",
        variant: "destructive",
      });
    }
  };

  // Visualizza eventuali messaggi di feedback
  useEffect(() => {
    if (!state.message || !isPending) return;

    toast({
      title: state.success ? "Successo" : "Errore",
      description: state.message,
      variant: state.success ? "success" : "destructive",
    });
  }, [state.message, isPending]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Input name="idStanza" className="hidden" defaultValue={state?.fields?.idStanza} />
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Descrizione Stanza</CardTitle>
            <CardDescription>
              Inserisci Nome e Descrizione della stanza, e inserisci quanti ospiti possono stare
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label>Nome</Label>
              <Input name="nome" type="text" defaultValue={state?.fields?.nome ?? ""} required />
              <ErrorForm errors={state?.errors?.nome} />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Descrizione</Label>
              <Textarea name="descrizione" className="h-40" defaultValue={state?.fields?.descrizione ?? ""} />
              <ErrorForm errors={state?.errors?.descrizione} />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Capienza</Label>
              <NumericInput name="capienza" defaultValue={state?.fields?.capienza ?? 0} />
              <ErrorForm errors={state?.errors?.capienza} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Prezzatura</CardTitle>
            <CardDescription>
              Inserisci la tariffa standard per persona della stanza
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label>Prezzo Standard</Label>
              <Input name="costoStandard" type="number" defaultValue={state?.fields?.costoStandard ?? ""} required />
              <ErrorForm errors={state?.errors?.costoStandard} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Immagini</CardTitle>
            <CardDescription>Inserisci le immagini per la tua stanza</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <UploadButton 
              className="p-4 items-center"
              endpoint="roomPicture"
              onClientUploadComplete={(res) => {
                res.forEach((foto) => {
                  handleAddRoomPicture(foto.key);
                });
              }}
            />
            <div className="border rounded-md p-4 grid grid-cols-5 w-full gap-3">
              {foto.map((idFoto, index) => (
                fotoURLs[index] && (
                  <RoomPicture
                    key={idFoto}
                    url={fotoURLs[index]}
                    onClick={() => handleRemoveRoomPicture(idFoto)}
                  />
                )
              ))}
            </div>
          </CardContent>
        </Card>
        <Input type="hidden" name="foto" value={JSON.stringify(foto)} />
        
        <div className="flex w-full justify-end">
          <Button type="submit" className="col-span-4">
            {room ? "Salva modifiche" : "Aggiungi Stanza"}
          </Button>
        </div>
      </div>
    </form>
  );
}
