"use client"

import React, { use, useActionState, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from './ui/button'
import { CirclePlus, LoaderCircle, Router } from 'lucide-react'
import { Label } from './ui/label'
import { tipo_pagamento } from '@prisma/client'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { addPayment } from '@/app/admin/payments/action'
import ErrorForm from './ErrorForm'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'


export interface AddAdminPaymentFormProps {
  codPrenotazione: string
}

export default function AddAdminPaymentForm({ codPrenotazione }: AddAdminPaymentFormProps) {

  const [state, formAction, isLoading] = useActionState(addPayment, {success: false, message: '', errors: null, fields: null})
  const [open, setOpen] = useState<boolean>(false)
  const {toast} = useToast() 
  const router = useRouter()

  useEffect(() => {

    if (!open) return

    if (!state.success){
      toast({
        title: "Errore",
        description: state.message,
        variant: 'destructive'
      })
    }

    if (state.success){
      toast({
        title: "Pagamento creato",
        description: "Il pagamento è stato creato con successo",
        variant: 'success'
      })
      setOpen(false)
      router.refresh()
    } 
  }, [state.success])


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePlus />
          Crea un pagamento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crea un pagamento</DialogTitle>
          <DialogDescription>
            Aggiungi un pagamento per la prenotazione, elencando tutte le informazioni
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label>Tipo di Pagamento</Label>
            <Select defaultValue={state.fields?.tipoPagamento} name='tipoPagamento'>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Seleziona il tipo di pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={tipo_pagamento.TASSA}>Tassa</SelectItem>
                <SelectItem value={tipo_pagamento.ALTRO}>{`Altro...`}</SelectItem>
              </SelectContent>
            </Select>
            <ErrorForm errors={state.errors?.tipoPagamento?._errors} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>Nome</Label>
            <Input type="text" placeholder="Nome del pagamento" defaultValue={state.fields?.nome ?? ""} name='nome'/>
            <ErrorForm errors={state.errors?.tipoPagamento?._errors} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>Descrizione</Label>
            <Textarea className='w-full resize-none' placeholder="Descrizione del pagamento" name='descrizione' defaultValue={state.fields?.descrizione ?? ""}/>
            <ErrorForm errors={state.errors?.tipoPagamento?._errors} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>Importo</Label>
            <span className='flex items-center gap-2'>
              <Input type="number" defaultValue={state.fields?.importo ?? 0} placeholder="Importo (€)" name='importo'/>
              €
            </span>
            <ErrorForm errors={state.errors?.tipoPagamento?._errors} />
          </div>

          <Input type='hidden' name='codPrenotazione' value={codPrenotazione} />
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (<><LoaderCircle className="animate-spin"/> {`Caricamento...`}</>) : 'Crea Pagamento'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>

  )
}
