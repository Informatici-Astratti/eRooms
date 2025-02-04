"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CirclePlus, ArrowLeft, Search } from "lucide-react"
import React, { useActionState, useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createNewReservation, getAvailableRooms, getOspiti } from "./action"
import type { Stanze, Profili } from "@prisma/client"
import { DatePickerWithRange } from "@/components/datePickerRange"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import cn from "classnames"
import NumericInput from "@/components/numericInputUI"
import { useFormState } from "react-dom"
import { useToast } from "@/hooks/use-toast"
import ErrorForm from "@/components/ErrorForm"

export function CreateReservationSheet() {
  const { toast } = useToast()
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [state, formAction] = useActionState(createNewReservation, {
    success: false,
  })

  const [step, setStep] = React.useState(1)
  const [selectedRoom, setSelectedRoom] = React.useState("")
  const [availableRooms, setAvailableRooms] = React.useState<Stanze[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [profiles, setProfiles] = useState<Profili[]>([])
  const [selectedProfile, setSelectedProfile] = useState<Profili | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1 && dateRange?.from && dateRange?.to) {
      const rooms = await getAvailableRooms(dateRange.from, dateRange.to)
      setAvailableRooms(rooms)
      setStep(2)
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery) {
        const fetchedProfiles = await getOspiti()
        const filteredProfiles = fetchedProfiles.filter(
          (profile) =>
            profile.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
            profile.cognome.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (profile.cf && profile.cf.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        setProfiles(filteredProfiles)
      } else {
        setProfiles([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Successo",
        description: state.message,
        variant: "success",
      })
      // Reset form or close sheet after successful submission
    }
  }, [state.success, toast, state.message])

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
            {step === 1 ? "Seleziona le date di inizio e fine" : "Seleziona una stanza e un ospite"}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} action={formAction}>
          <div className="grid gap-4 py-4 space-y-8">
            <div className={step === 2 ? "opacity-50" : ""}>
              <Label htmlFor="date-range" className="block mb-2 font-bold">
                Periodo di soggiorno
              </Label>
              <DatePickerWithRange
                className="w-full"
                onChange={(newDateRange) => {
                  setDateRange(newDateRange)
                  if (newDateRange?.from) {
                    const formData = new FormData()
                    formData.append("dateFrom", newDateRange.from.toISOString())
                    formAction(formData)
                  }
                  if (newDateRange?.to) {
                    const formData = new FormData()
                    formData.append("dateTo", newDateRange.to.toISOString())
                    formAction(formData)
                  }
                }}
                value={dateRange}
              />
              <ErrorForm errors={state.errors?.dateFrom || state.errors?.dateTo} />
            </div>
            <div className={cn("space-y-4", step === 1 && "opacity-50 pointer-events-none")}>
              <Label htmlFor="room" className="text-right font-bold">
                Informazioni Prenotazione
              </Label>
              <div className="grid grid-cols-4 items-center gap-4 mt-10">
                <Label htmlFor="room" className="text-right">
                  Stanza
                </Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedRoom(value)
                    const formData = new FormData()
                    formData.append("roomId", value)
                    formAction(formData)
                  }}
                  value={selectedRoom}
                  disabled={step === 1}
                >
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
              <ErrorForm errors={state.errors?.roomId} />
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Numero di Ospiti
                </Label>
                <NumericInput
                  defaultValue={0}
                  name="numberOfGuests"
                  
                />
              </div>
              <ErrorForm errors={state.errors?.numberOfGuests} />
              <div className="space-y-2">
                <Label htmlFor="profile-search">Cerca Ospite</Label>
                <div className="relative">
                  <Input
                    id="profile-search"
                    type="text"
                    placeholder="Cerca per nome, cognome o CF"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {profiles.length > 0 && (
                  <ul className="mt-2 border rounded-md divide-y">
                    {profiles.map((profile) => (
                      <li
                        key={profile.idProfilo}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedProfile(profile)
                          setSearchQuery(`${profile.nome} ${profile.cognome}`)
                          setProfiles([])
                          const formData = new FormData()
                          formData.append("guestId", profile.idProfilo)
                          formAction(formData)
                        }}
                      >
                        {profile.nome} {profile.cognome} {profile.cf ? `- CF: ${profile.cf}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <ErrorForm errors={state.errors?.guestId} />
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
                disabled={
                  (step === 1 && (!dateRange?.from || !dateRange?.to)) ||
                  (step === 2 && (!selectedRoom || !selectedProfile))
                }
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

