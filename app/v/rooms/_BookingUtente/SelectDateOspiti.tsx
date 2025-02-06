import React, { useEffect, useState } from 'react'
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/app/lib/utils'
import { CalendarIcon, CalendarSearch, UsersRound } from 'lucide-react'
import { addDays, format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import { z } from 'zod'
import { BookingStepper } from './CreateBookingCliente'
import NumericInput from '@/components/numericInputUI'

const SelectDatesOspitiSchema = z.object({
  dataInizio: z.date(),
  dataFine: z.date(),
  ospiti: z.number().min(1, { message: "Il minimo di ospiti è 1" }).max(10, { message: "Il numero massimo di ospiti è 10" })
}).refine((data) => data.dataFine > data.dataInizio, { message: "Le date non sono valide" })

export default function SelectDateOspiti() {
  const [data, setData] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7)
  })

  const [ospiti, setOspiti] = useState<number>(1)

  const stepper = BookingStepper.useStepper()

  const handleSubmit = () => {
    /*
    stepper.beforeNext(() => {
      const validatedData = SelectDatesOspitiSchema.safeParse({
        dataInizio: data?.from,
        dataFine: data?.to,
        ospiti: ospiti
      })

      if (!validatedData.success){
        return false
      }

      stepper.setMetadata("step2", {
        searchBooking: {...validatedData.data}
      })
  
      return true
    })
      */
    stepper.next()

  }

  


  return (
    {stepper.when("step1", () => (
    <React.Fragment>

    <SheetHeader>
      <SheetTitle>{stepper.current.title}</SheetTitle>
      <SheetDescription>
        {stepper.current.description}
      </SheetDescription>
    </SheetHeader>

      <div className='flex flex-col gap-5'>
        <div className="flex flex-col gap-2 p-4 border rounded-md">
          <span className='flex gap-2 items-center'>
            <CalendarSearch className='size-4' />
            <Label>Seleziona le Date</Label>
          </span>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={data?.from}
            selected={data}
            onSelect={setData}
            numberOfMonths={2}
          />
        </div>

        <div className="flex justify-between items-center gap-2 p-4 border rounded-md ">
          <span className='flex gap-2 items-center'>
            <UsersRound className='size-4' />
            <Label>Ospiti: </Label>
          </span>

          <NumericInput name={"ospiti"} defaultValue={ospiti} onValueChange={(value) => setOspiti(value)} />
        </div>

        <div>
          <Button onClick={handleSubmit}>
            Ricerca
          </Button>
        </div>


      </div>
    </React.Fragment>
    ))}
  )
}
