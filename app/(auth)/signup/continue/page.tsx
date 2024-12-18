"use client"

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BedDouble, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import * as React from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function ConfirmSignupPage() {
    const [date, setDate] = useState<Date>()
    //const [state, formAction] = useActionState()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex gap-2 justify-center items-center">
          <div className="flex size-6 bg-primarflex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BedDouble className="size-4" />
          </div>
          <p className="font-bold">e-Rooms</p>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Benvenuto</CardTitle>
            <CardDescription>Conferma il tuo account e-Rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <form action = {() => { }}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input name="nome" type="text" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cognome">Cognome</Label>
                    <Input name="cognome" type="text" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telefono">Numero di Telefono</Label>
                    <Input name="telefono" type="tel" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cf">Codice Fiscale</Label>
                    <Input name="cf" type="text" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dataNascita">Data di Nascita</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Input type="hidden" value={date?.toDateString()} name="dataNascita"/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="genere">Genere</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleziona il genere" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="uomo">Uomo</SelectItem>
                          <SelectItem value="donna">Donna</SelectItem>
                          <SelectItem value="ns">Non voglio specificarlo</SelectItem> 
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    Conferma Registrazione
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Hai già un account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Accedi
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
