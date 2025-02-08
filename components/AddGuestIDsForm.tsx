"use client"

import React, { useEffect } from 'react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { IdCard } from 'lucide-react'
import { Button } from './ui/button'
import prisma from '@/app/lib/db'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { stato_prenotazione, tipo_documento } from '@prisma/client'
import { formatEnumValue } from '@/app/lib/formatEnum'

interface AddGuestIDsFormProps {
  idPrenotazione: string
  disabled?: boolean
}

export default async function AddGuestIDsForm({ idPrenotazione, disabled = false }: AddGuestIDsFormProps) {

  const guests = await prisma.ospiti.findMany({
    where: {
      codPrenotazione: idPrenotazione
    }
  })

  useEffect(() => {
    console.log(guests)
  }, [])



  return !disabled && (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"}>
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
                    <Input type="text" placeholder="Nome" />
                  </div>

                  <div className='basis-1/2 flex flex-col gap-2'>
                    <Label>Cognome</Label>
                    <Input type="text" placeholder="Cognome" />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <Label>Codice Fiscale</Label>
                  <Input type="text" placeholder="Codice Fiscale" />
                </div>

                <div className='flex flex-col gap-2'>
                  <h2 className='font-semibold text-lg'>Documento</h2>

                  <div className="flex gap-8">
                    <div className='basis-1/2 flex flex-col gap-2'>
                      <Label>Tipo Documento</Label>
                      <Select>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Seleziona il tipo di documento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={tipo_documento.CARTAIDENTITA}>Carta d'Identità</SelectItem>
                          <SelectItem value={tipo_documento.PATENTE}>Patente</SelectItem>
                          <SelectItem value={tipo_documento.PASSAPORTO}>Passaporto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='basis-1/2 flex flex-col gap-2'>
                      <Label>Identificativo Documento</Label>
                      <Input type="text" placeholder="Identificativo Documento" />
                    </div>
                  </div>

                  <div className="flex gap-8">
                    <div className='basis-1/2 flex flex-col gap-2'>
                      <Label>Data Rilascio</Label>
                      <Input type="date" placeholder="Data Rilascio" />
                    </div>

                    <div className='basis-1/2 flex flex-col gap-2'>
                      <Label>Data Scadenza</Label>
                      <Input type="date" placeholder="Data Scadenza" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </SheetContent>
    </Sheet>

  )
}
