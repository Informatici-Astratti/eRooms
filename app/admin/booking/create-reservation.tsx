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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CirclePlus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import React, { useEffect } from "react"
import { format } from "date-fns"
import { cn } from "@/app/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAvailableRooms } from "./action"
import type { Stanze } from "@prisma/client"

export function CreateReservationSheet() {
  const [date1, setDate1] = React.useState<Date>()
  const [date2, setDate2] = React.useState<Date>()
  const [step, setStep] = React.useState(1)
  const [selectedRoom, setSelectedRoom] = React.useState("")
  const [availableRooms, setAvailableRooms] = React.useState<Stanze[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1 && date1 && date2) {
      const rooms = await getAvailableRooms(date1, date2)
      setAvailableRooms(rooms)
      setStep(2)
    } else {
      // Submit the reservation
      console.log("Prenotazione confermata:", date1, date2, selectedRoom)
    }
  }

  useEffect(() => {
    if (date1 && date2) {
      getAvailableRooms(date1, date2).then((rooms) => {
        setAvailableRooms(rooms)
      })
    }
  }, [date1, date2])

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
            {step === 1 ? (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start-date" className="text-right">
                    Inizio
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start-date"
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date1 && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date1 ? format(date1, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date1} onSelect={setDate1} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end-date" className="text-right">
                    Fine
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="end-date"
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date2 && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date2 ? format(date2, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date2} onSelect={setDate2} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Stanza
                </Label>
                <Select onValueChange={setSelectedRoom} value={selectedRoom}>
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
            )}
          </div>
          <SheetFooter>
            <Button type="submit">{step === 1 ? "Cerca stanze disponibili" : "Conferma prenotazione"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

