"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CirclePlus } from "lucide-react"
import { use, useActionState, useEffect, useState } from "react"
import { addSquadra } from "./action"
import { ruolo } from "@prisma/client"
import { useToast } from "@/hooks/use-toast"

export function AggiungiMembro() {
    const [formData, setFormData] = useState({
        email: "",
        ruolo: "",
    })

    const initialState = { message: "", success: false, errors: { descrizione: "" } }
    const [state, formAction] = useActionState(addSquadra, initialState)

    const [open, setOpen] = useState(false)

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const isFormValid = () => {
        return formData.email !== "" && formData.ruolo !== ""
    }

    const {toast} = useToast()

    useEffect(() => {
       
        if (state.message || state.errors.descrizione) {
            toast({
                title: state.success ? "Successo" : "Errore",
                description: state.success ? state.message : state.errors.descrizione,
                variant: state.success ? "success" : "destructive",
                duration: 2000,
            });
    
            if (state.success || state.errors) {
                setFormData({ email: "", ruolo: "" });
                setOpen(false);
            }
        }
    }, [state]);
    
    

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>
                    <CirclePlus />
                    Aggiungi membro
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Aggiungi membro</SheetTitle>
                    <SheetDescription>Aggiungi un membro alla tua squadra.</SheetDescription>
                </SheetHeader>
                <form action={formAction}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Inserisci l'indirizzo email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ruolo" className="text-right">
                                Ruolo da Attribuire
                            </Label>
                            <Select
                                name="ruolo"
                                onValueChange={(value) => handleChange("ruolo", value)}
                                value={formData.ruolo}
                                required
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleziona un ruolo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ruolo.PROPRIETARIO}>Proprietario</SelectItem>
                                    <SelectItem value={ruolo.GOVERNANTE}>Governante</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* {state.errors.descrizione && <div className="text-red-600 mt-2 mb-4">{state.errors.descrizione}</div>} */}
                    
                    <SheetFooter>
                        <Button type="submit" disabled={!isFormValid()}>
                            Aggiungi
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

