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

interface EditRoomFormProps {
  room: Stanze | null;
}

export default function EditRoomForm({ room }: EditRoomFormProps) {
  const { toast } = useToast()

  const [state, formAction] = useActionState(room ? updateRoomById : createRoom, {
    success: false,
    fields: room ?? { idStanza: "", nome: "", capienza: 0, descrizione: "", foto: [] },
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


  return (
    <form action={formAction}
    className="space-y-5 max-w-3xl mx-auto mr-2">
      <div className="grid grid-cols-12 gap-4">
          <Input name="idStanza" className="hidden" defaultValue={state?.fields?.idStanza} />
        {/*FIELD*/}
        <div className="col-span-6">
          <Label>Nome</Label>
          <Input name="nome" type="text" defaultValue={state?.fields?.nome ?? ""} required/>
          <ErrorForm errors={state?.errors?.nome} />
        </div>

        <div className="col-span-6">
          <Label>Capienza</Label>
          <NumericInput name="capienza" defaultValue={state?.fields?.capienza ?? 0} />
          <ErrorForm errors={state?.errors?.capienza} />
        </div>

        <div className="col-span-12">
          <Label>Descrizione</Label>
          <Textarea name="descrizione" className="h-40" defaultValue={state?.fields?.descrizione ?? ""}/>
          <ErrorForm errors={state?.errors?.descrizione} />
        </div>

        <div>
          <Button type="submit" className="col-span-4">
            Conferma Dettaglio
          </Button>
        </div>
      </div>
    </form>
  );
}

