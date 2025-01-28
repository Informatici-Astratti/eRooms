"use client";

import ErrorForm from "@/components/ErrorForm";
import NumericInput from "@/components/numericInputUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stanze } from "@prisma/client";
import { useActionState } from "react";
import { updateRoom } from "./action";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import './scrollbar.css'

interface EditRoomFormProps {
  room: Stanze | null;
}

export default function EditRoomForm({ room }: EditRoomFormProps) {
  const { toast } = useToast()
  /*
  //const {toast} = useToast()
  */
  const [state, formAction] = useActionState(updateRoom, undefined)
  
/*
  const onSubmit = () => {
    toast({
      title: "Room updated successfully",
      description: "The room details have been updated in the database.",
      action: (
        <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
      ),
    })
    redirect('/dashboard/room')
  }*/
  return (
    <form action={formAction}
    className="space-y-5 max-w-3xl mx-auto mr-2">
      <div className="grid grid-cols-12 gap-4">
          <Input name="idStanza" className="hidden" defaultValue={room?.idStanza} />
        {/*FIELD*/}
        <div className="col-span-6">
          <Label>Nome</Label>
          <Input name="nome" type="text" defaultValue={room?.nome ?? ""} required/>
          <ErrorForm errors={state?.errors?.nome} />
        </div>

        <div className="col-span-6">
          <Label>Capienza</Label>
          <NumericInput name="capienza" defaultValue={room?.capienza ?? 0} />
          <ErrorForm errors={state?.errors?.capienza} />
        </div>

        <div className="col-span-12">
          <Label>Descrizione</Label>
          <Textarea name="descrizione" className="h-40" defaultValue={room?.descrizione ?? ""}/>
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
