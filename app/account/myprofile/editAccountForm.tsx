"use client"

import { cn } from "@/app/lib/utils"
import ErrorForm from "@/components/ErrorForm"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { genere, Profili, ruolo } from "@prisma/client"
import { format } from "date-fns"
import { CalendarIcon, Satellite } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { editAccountProfile } from "./action"
import { useToast } from "@/hooks/use-toast"

interface EditAccountFormProps {
  profile: Profili | null;
}

export default function EditAccountForm({ profile }: EditAccountFormProps) {
    const { toast } = useToast()
    
    
    const [state, formAction] = useActionState(editAccountProfile, {
            success: false,
            fields: profile ?? {idProfilo: "", nome: "", cognome: "", telefono: null, cf: null, piva: null, dataNascita: new Date(), genere: genere.NS, indirizzo: null, ruolo: ruolo.CLIENTE },
          })
        
          useEffect(() => {
            if (state?.success) {
              toast({
                title: "Successo",
                description: state.message,
                variant: "success",
              })
            }
          }, [state?.success, toast, state?.message])
       
    const [date , setDate] = useState<Date | undefined>(state.fields?.dataNascita ?? undefined)
    return (
        <form action={formAction} className="p-4 rounded-md bg-white border">
            <div className="space-y-5">
                <h1 className="text-xl font-bold">Informazioni Generali</h1>
                <div className="w-[80%]">
                    <Label htmlFor="nome">Nome</Label>
                    <Input name="nome" type="text" defaultValue={state.fields?.nome} required />
                    <ErrorForm errors={state.errors?.nome} />
                </div>
                <div className="w-[80%]">
                    <Label htmlFor="cognome">Cognome</Label>
                    <Input name="cognome" type="text" defaultValue={state.fields?.cognome} required />
                    <ErrorForm errors={state.errors?.cognome} />
                </div>
                <div className="w-[80%]">
                    <Label htmlFor="telefono">Numero di Telefono</Label>
                    <PhoneInput

                    name="telefono"
                    defaultCountry="IT"
                    value={formatPhoneNumber(state.fields?.telefono)}
                    
                    />
                    <ErrorForm errors={state.errors?.telefono} />
                </div>
                <div className="w-[80%]">
                    <Label htmlFor="cf">Codice Fiscale</Label>
                    <Input name="cf" type="text" defaultValue={state.fields?.cf ?? ""} required />
                    <ErrorForm errors={state.errors?.cf} />
                </div>
                <div className="w-[80%]">
                <Label htmlFor="dataNascita">Data di Nascita</Label>
                    <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-normal w-[50%]",
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
                    <ErrorForm errors={state.errors?.dataNascita} />
                    </div>
                </div>
                <div className="w-[40%]">
                    <Label htmlFor="genere">Genere</Label>
                    <Select name="genere" defaultValue={state.fields?.genere}>
                    <SelectTrigger >
                        <SelectValue placeholder="Seleziona il genere" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={genere.UOMO}>Uomo</SelectItem>
                        <SelectItem value={genere.DONNA}>Donna</SelectItem>
                        <SelectItem value={genere.NS}>Non voglio specificarlo</SelectItem> 
                    </SelectContent>
                    </Select>
                    <ErrorForm errors={state.errors?.genere} />
                </div>
                <Input className="hidden" name="idProfilo" type="text" defaultValue={state.fields?.idProfilo} required/>
                <Input className="hidden" name="piva" type="text" defaultValue={state.fields?.piva ?? ""}/>
                <Input className="hidden" name="ruolo" type="text" defaultValue={state.fields?.ruolo}/>
                <div className="flex justify-end">
                    <Button type="submit">
                        Modifica Informazioni
                    </Button>
                </div>  
            </div>     
        </form>
    )
}

function formatPhoneNumber(phone?: string | null): string {
    if (!phone) return "";
    // Rimuove spazi o altri caratteri indesiderati
    const cleaned = phone.replace(/\s+/g, '');
    // Se non inizia con '+' aggiungi il prefisso italiano (+39)
    if (!cleaned.startsWith('+')) {
      return '+39' + cleaned;
    }
    return cleaned;
  }
  