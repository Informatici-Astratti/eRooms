"use client"

import React, { useEffect, useState } from 'react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { CalendarIcon } from "lucide-react"
 
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { IdCard } from 'lucide-react'
import { Button } from './ui/button'
import prisma from '@/app/lib/db'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Ospiti, stato_prenotazione, tipo_documento } from '@prisma/client'
import { formatEnumValue } from '@/app/lib/formatEnum'
import { getGuestsAction, updateOspiti, UpdateOspitiFormErrors, UpdateOspitiResponse} from '@/app/admin/booking/bookingAction'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { cn } from '@/app/lib/utils'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import ErrorForm from './ErrorForm'

interface AddGuestIDsFormProps {
  idPrenotazione: string
  disabled?: boolean
}

export default function AddGuestIDsForm({ idPrenotazione, disabled = false }: AddGuestIDsFormProps) {

  const [guests, setGuests] = useState<Ospiti[]>([])
  const [errors, setErrors] = useState<UpdateOspitiFormErrors | null>(null)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const {toast} = useToast()
  const router = useRouter()

  const handleGuestChange = <K extends keyof Ospiti>(index: number, field: K, value: Ospiti[K]) => {
    setGuests(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  useEffect(() => {
    getGuestsAction(idPrenotazione).then(guests => {

      if (!guests.success) {
        toast({
          title: "Errore",
          description: "Si è verificato un errore nel caricamento degli ospiti. Chiudi e riprova",
          variant: "destructive"
        })
      }

      if (guests.guests) {
        setGuests(guests.guests)
      }
    })
  }, [])


  const handleUpdateGuests = async () => {

    const res = await updateOspiti({idPrenotazione: idPrenotazione, ospiti: guests})

    if(!res.success){
      toast({
        title: "Errore",
        description: res.message,
        variant: "destructive"
      })

      if(res.errors){
        console.log(res.errors)
        setErrors(res.errors)
      }
    }

    if(res.success){
      toast({
        title: "Successo",
        description: "Documenti salvati correttamente",
        variant: "success"
      })
      setOpen(false)
      router.refresh()
    }

    
  }

  return disabled ?
  (
    <TooltipProvider>
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild>
          <Button variant={"outline"} onClick={() => setTooltipOpen(true)}>
            <IdCard />
            Aggiungi Documenti
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Non puoi inserire i documenti fino a quando non confermi la prenotazione</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    
  )
  :
  (
    <Sheet open={open} onOpenChange={(newState) => setOpen(newState)}>
      <SheetTrigger asChild>
        <Button variant={"outline"} >
          <IdCard />
          Aggiungi Documenti
        </Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col gap-4 min-w-[700px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Aggiungi i dati per il Check-in degli Ospiti</SheetTitle>
          <SheetDescription>
            Completa i form sottostanti per ogni ospite che parteciperà al soggiorno con le sue generalità e i documenti di identità
          </SheetDescription>
        </SheetHeader>
        <div className='flex flex-col gap-4'>
          {
            guests.map((guest, i) => (
              <div key={guest.idOspite} className='p-4 border rounded-md flex flex-col gap-2'>
                <h2 className='font-semibold text-lg'>{`Ospite ${i + 1}`}</h2>

                <div className='flex gap-8'>
                  <div className='basis-1/2 flex flex-col gap-2'>
                    <Label>Nome</Label>
                    <Input type="text" placeholder="Nome" value={guest.nome || ''}
                      onChange={(e) => handleGuestChange(i, 'nome', e.target.value)}/>
                    <ErrorForm errors={errors?.[i].nome?._errors ?? ""} />
                  </div>

                  <div className='basis-1/2 flex flex-col gap-2'>
                    <Label>Cognome</Label>
                    <Input type="text" placeholder="Cognome" value={guest.cognome || ''}
                      onChange={(e) => handleGuestChange(i, 'cognome', e.target.value)}/>
                    <ErrorForm errors={errors?.[i].cognome?._errors ?? ""} />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <Label>Codice Fiscale</Label>
                  <Input type="text" placeholder="Codice Fiscale" value={guest.cf || ''}
                    onChange={(e) => handleGuestChange(i, 'cf', e.target.value)}/>
                  <ErrorForm errors={errors?.[i].cf?._errors ?? ""} />
                </div>

                <div className='flex flex-col gap-2'>
                  <h2 className='font-semibold text-lg'>Documento</h2>

                  <div className="flex gap-8">
                    <div className='basis-1/2 flex flex-col gap-2'>
                      <Label>Tipo Documento</Label>
                        <Select onValueChange={(val) => handleGuestChange(i, 'tipoDocumento', val as tipo_documento)}
                        value={guest.tipoDocumento || ''}>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Seleziona il tipo di documento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={tipo_documento.CARTAIDENTITA}>Carta d'Identità</SelectItem>
                          <SelectItem value={tipo_documento.PATENTE}>Patente</SelectItem>
                          <SelectItem value={tipo_documento.PASSAPORTO}>Passaporto</SelectItem>
                        </SelectContent>
                        </Select>
                      <ErrorForm errors={errors?.[i].tipoDocumento?._errors ?? ""} />
                    </div>

                    <div className='basis-1/2 flex flex-col gap-2'>
                      <Label>Identificativo Documento</Label>
                      <Input type="text" placeholder="Identificativo Documento" value={guest.idDocumento || ''}
                        onChange={(e) => handleGuestChange(i, 'idDocumento', e.target.value)}/>
                      <ErrorForm errors={errors?.[i].idDocumento?._errors ?? ""} />
                    </div>
                  </div>

                  <div className="flex gap-8">
                    <div className='basis-1/2 flex flex-col gap-2'>
                      <Label>Data Rilascio</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !guest.dataRilascio && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {guest.dataRilascio
                              ? format(new Date(guest.dataRilascio), "dd/MM/yyyy")
                              : <span>Inserisci la data</span>
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={guest.dataRilascio ?? new Date()}
                            onSelect={(val) => handleGuestChange(i, 'dataRilascio', val ?? null)}
                            initialFocus
                            captionLayout="dropdown-buttons"
                            fromYear={1960}
                            toYear={2050}
                          />
                        </PopoverContent>
                      </Popover>
                      <ErrorForm errors={errors?.[i].dataRilascio?._errors ?? ""} />
                    </div>

                    <div className='basis-1/2 flex flex-col gap-2'>
                      <Label>Data Scadenza</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !guest.dataScadenza && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {guest.dataScadenza
                              ? format(new Date(guest.dataScadenza), "dd/MM/yyyy")
                              : <span>Inserisci la data</span>
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={guest.dataScadenza ?? new Date()}
                            onSelect={(val) => handleGuestChange(i, 'dataScadenza', val ?? null)}
                            initialFocus
                            captionLayout="dropdown-buttons"
                            fromYear={1960}
                            toYear={2050}
                          />
                        </PopoverContent>
                      </Popover>
                      <ErrorForm errors={errors?.[i].dataScadenza?._errors ?? ""} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        <SheetFooter>
          <Button onClick={handleUpdateGuests}>
            Salva Documenti
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>

  )
}
