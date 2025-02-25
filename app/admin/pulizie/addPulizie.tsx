"use client"
import { DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import type { TurniPulizie, Profili } from "@prisma/client"
import { useRouter } from "next/navigation"
import { addTurnoPulizia } from "./action"
import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import React from "react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/app/lib/utils"

interface AddPulizieProps {
    stanza: {
        idStanza: string
        nome: string | null
        TurniPulizie: (TurniPulizie & { Profili: Profili })[]
    }
    governanti: Profili[]
    onClose: () => void
}

export default function AddPulizie({ stanza, governanti, onClose }: AddPulizieProps) {
    const [formData, setFormData] = useState({
        codStanza: stanza.idStanza,
        codGovernante: ""
    })

    const initialState = { message: "", success: false, errors: { descrizione: "" } }
    const [state, formAction] = useActionState(addTurnoPulizia, initialState)

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        if (state.message || state.errors.descrizione) {

            toast({
                title: state.success ? "Successo" : "Errore",
                description: state.success ? state.message : state.errors.descrizione,
                variant: state.success ? "success" : "destructive",
                duration: 2000,
            });
        }

        if (state.success || state.errors) {
            setFormData({
                codStanza: stanza.idStanza,
                codGovernante: "",

            });
            setDataInizio(new Date());
            setDataFine(new Date());
            onClose();
            router.refresh()
        }
    }, [state]);


    const isFormValid = () => {
        return (
            formData.codGovernante !== ""
        )
    }

    const [dataInizio, setDataInizio] = React.useState<Date | undefined>(new Date())
    const [dataFine, setDataFine] = React.useState<Date | undefined>(new Date())

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Assegna Turno</DialogTitle>
                <DialogDescription>Assegna un turno di pulizia per la stanza {stanza.nome}.</DialogDescription>
            </DialogHeader>
            <form action={formAction}>
                <input type="hidden" name="codStanza" value={formData.codStanza} />
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="governante" className="text-right">
                            Governante
                        </Label>
                        <Select
                            name="codGovernante"
                            onValueChange={(value) => handleChange("codGovernante", value)}
                            value={formData.codGovernante}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Seleziona un addetto" />
                            </SelectTrigger>
                            <SelectContent>
                                {governanti.length > 0 ? (
                                    governanti.map((governante) => (
                                        <SelectItem key={governante.idProfilo} value={governante.idProfilo}>
                                            {`${governante.nome} ${governante.cognome}`}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="text-gray-500 py-2 col-span-3">Nessun governante disponibile</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dataInizio" className="text-right">
                            Data Inizio
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start text-left font-normal col-span-2",
                                        !dataInizio && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {dataInizio ? format(dataInizio, "dd/MM/yyyy") : <span>Seleziona</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="center">
                                <Calendar
                                    mode="single"
                                    captionLayout="dropdown-buttons"
                                    selected={dataInizio}
                                    onSelect={setDataInizio}
                                    fromYear={1960}
                                    toYear={2030}
                                    disabled={(dataInizio) =>
                                        dataInizio < new Date()
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        <Input type="hidden" value={dataInizio ? format(dataInizio, "yyyy-MM-dd") : ''} name="dataInizio" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dataFine" className="text-right">
                            Data Fine
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start text-left font-normal col-span-2",
                                        !dataFine && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {dataFine ? format(dataFine, "dd/MM/yyyy") : <span>Seleziona</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="center">
                                <Calendar
                                    mode="single"
                                    captionLayout="dropdown-buttons"
                                    selected={dataFine}
                                    onSelect={setDataFine}
                                    fromYear={1960}
                                    toYear={2030}
                                    disabled={(dataFine) =>
                                        dataFine < new Date()
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        <Input type="hidden" value={dataFine ? format(dataFine, "yyyy-MM-dd") : ''} name="dataFine" />
                    </div>
                </div>
                {/* {state.errors.descrizione && <div className="text-red-600 mt-2 mb-4">{state.errors.descrizione}</div>}
                {state.message && <div className="text-green-600 mt-2 mb-4">{state.message}</div>} */}
                <DialogFooter>
                    <Button className="mt-4" type="submit" disabled={!isFormValid()}>
                        Salva modifiche
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

