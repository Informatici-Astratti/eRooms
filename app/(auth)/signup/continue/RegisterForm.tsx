"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BedDouble, CalendarIcon } from "lucide-react";
import { useActionState, useState } from "react";
import * as React from "react"
import { format } from "date-fns"
import { cn } from "@/app/lib/utils"
import {  signUpContinue } from "../../action";
import ErrorForm from "@/components/ErrorForm";
import { PhoneInput } from "@/components/ui/phone-input";
import { genere } from "@prisma/client";

export default function SignUpContinueForm(){
   

    const [date, setDate] = useState<Date>()
    const [state, formAction] = useActionState(signUpContinue, undefined);

    return (
        <form action = {formAction}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input name="nome" type="text" required />
                    <ErrorForm errors={state?.errors.nome}/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cognome">Cognome</Label>
                    <Input name="cognome" type="text" required />
                    <ErrorForm errors={state?.errors.cognome}/>
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
                    <ErrorForm errors={state?.errors.dataNascita}/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="genere">Genere</Label>
                    <Select name="genere">
                      <SelectTrigger >
                        <SelectValue placeholder="Seleziona il genere" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value={genere.UOMO}>Uomo</SelectItem>
                          <SelectItem value={genere.DONNA}>Donna</SelectItem>
                          <SelectItem value={genere.NS}>Non voglio specificarlo</SelectItem> 
                      </SelectContent>
                    </Select>
                    <ErrorForm errors={state?.errors.genere}/>
                  </div>
                  <Button type="submit" className="w-full">
                    Conferma Registrazione
                  </Button>
                </div>
              </div>
            </form>
    )
} 