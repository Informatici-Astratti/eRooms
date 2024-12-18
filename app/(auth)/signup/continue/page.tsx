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
import { useActionState, useState } from "react";
import * as React from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {  signUpContinue } from "../../action";
import ErrorForm from "@/components/ErrorForm";
import { PhoneInput } from "@/components/ui/phone-input";
import { Genere } from "@/constants/genere";


export default function ConfirmSignupPage() {
    const [date, setDate] = useState<Date>()
    const [state, formAction] = useActionState(signUpContinue, undefined);

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
            <form action = {formAction}>
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
                    <PhoneInput
                    placeholder="Inserisci numero di telefono"
                    name="telefono"
                    defaultCountry="IT"
                    />
                    <ErrorForm errors={state?.errors.telefono}/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cf">Codice Fiscale</Label>
                    <Input name="cf" type="text" required />
                    <ErrorForm errors={state?.errors.cf}/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dataNascita">Data di Nascita</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon />
                            {date ? format(date, "dd/MM/yyyy") : <span>Seleziona</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown-buttons"
                              selected={date}
                              onSelect={setDate}
                              fromYear={1960}
                              toYear={2030}
                            />
                        </PopoverContent>
                    </Popover>
                    <Input type="hidden" value={date ? format(date, "yyyy-MM-dd") : ''} name="dataNascita"/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="genere">Genere</Label>
                    <Select name="genere">
                      <SelectTrigger >
                        <SelectValue placeholder="Seleziona il genere" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value={Genere.UOMO}>Uomo</SelectItem>
                          <SelectItem value={Genere.DONNA}>Donna</SelectItem>
                          <SelectItem value={Genere.NS}>Non voglio specificarlo</SelectItem> 
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    Conferma Registrazione
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
