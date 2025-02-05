"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CirclePlus, ArrowLeft } from "lucide-react"
import React, { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAvailableRooms } from "./action"
import type { Stanze } from "@prisma/client"
import { DatePickerWithRange } from "@/components/datePickerRange"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import cn from "classnames"

export function CreateReservationSheet() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [step, setStep] = React.useState(1)
  const [selectedRoom, setSelectedRoom] = React.useState("")
  const [availableRooms, setAvailableRooms] = React.useState<Stanze[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1 && dateRange?.from && dateRange?.to) {
      const rooms = await getAvailableRooms(dateRange.from, dateRange.to)
      setAvailableRooms(rooms)
      setStep(2)
      setSelectedRoom("") // Reset selected room when moving to step 2
    } else if (step === 2 && selectedRoom) {
      // Submit the reservation
      console.log("Prenotazione confermata:", dateRange?.from, dateRange?.to, selectedRoom)
      // Here you would typically send this data to your server
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getAvailableRooms(dateRange.from, dateRange.to).then((rooms) => {
        setAvailableRooms(rooms)
      })
    }
  }, [dateRange])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <CirclePlus />
          Crea nuova Prenotazione
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nuova Prenotazione</SheetTitle>
          <SheetDescription>
            {step === 1 ? "Seleziona le date di inizio e fine" : "Seleziona una stanza disponibile"}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className={step === 2 ? "opacity-50" : ""}>
              <Label htmlFor="date-range" className="block mb-2">
                Periodo di soggiorno
              </Label>
              <DatePickerWithRange
                className="w-full"
                onChange={(newDateRange) => setDateRange(newDateRange)}
                value={dateRange}
              />
            </div>
            <div className={cn("space-y-4", step === 1 && "opacity-50 pointer-events-none")}>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Stanza
                </Label>
                <Select onValueChange={setSelectedRoom} value={selectedRoom} disabled={step === 1}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Seleziona una stanza" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map((room) => (
                      <SelectItem key={room.idStanza} value={room.idStanza}>
                        {room.nome} (Capienza: {room.capienza})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <SheetFooter>
            <div className="flex w-full justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={(step === 1 && (!dateRange?.from || !dateRange?.to)) || (step === 2 && !selectedRoom)}
              >
                {step === 1 ? "Cerca stanze disponibili" : "Conferma prenotazione"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

