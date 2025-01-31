"use client";

import ErrorForm from "@/components/ErrorForm";
import NumericInput from "@/components/numericInputUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stanze } from "@prisma/client";
import { useActionState, useEffect } from "react";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import './scrollbar.css'
import { createRoom, updateRoomById } from "../action";
import { Plus } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface EditRoomFormProps {
  room: Stanze | null;
}

export default function EditRoomForm({ room }: EditRoomFormProps) {
  const { toast } = useToast()

  const [state, formAction] = useActionState(room ? updateRoomById : createRoom, {
    success: false,
    fields: room ?? { idStanza: "", nome: "", capienza: 0, descrizione: "", costoStandard: 0, foto: [] },
  })

  useEffect(() => {
    if (state.success){
      toast({
        title: "Successo",
        description: state.message,
        variant: "success",
      })
    }
  }, [state.success])

  const addFormTariffa = () => {

  }


  return (
    <form action={formAction}
    className="flex flex-col gap-3">
      <Input name="idStanza" className="hidden" defaultValue={state?.fields?.idStanza} />
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Descrizione Stanza</CardTitle>
            <CardDescription>Inserisci Nome e Descrizione della stanza, e inserisci quanti ospiti possono stare</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 ">
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
            <CardDescription>Inserisci la tariffa standard per persona della stanza</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 ">
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
          <CardContent className="flex flex-col gap-3">
            <p>Qui andranno le immagini</p>
          </CardContent>
        </Card>
        
        <div>
          <Button type="submit" className="col-span-4">
            Conferma Dettaglio
          </Button>
        </div>
      </div>
    </form>
  );
}

