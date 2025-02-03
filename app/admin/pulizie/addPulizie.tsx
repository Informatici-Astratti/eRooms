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
        codGovernante: "",
        dataInizio: new Date().toISOString().split("T")[0],
        dataFine: new Date().toISOString().split("T")[0],
    })

    const initialState = { message: "", success: false, errors: { descrizione: "" } }
    const [state, formAction] = useActionState(addTurnoPulizia, initialState)

    const router = useRouter()

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    useEffect(() => {
        if (state.message) {
          const timer = setTimeout(() => {
            onClose();
            router.refresh();
          }, 2000);
          return () => clearTimeout(timer);
        }
      }, [state.success]); // oppure [state.message, state.success] se necessario
      

    const isFormValid = () => {
        return (
            formData.codGovernante !== "" &&
            formData.dataInizio !== "" &&
            formData.dataFine !== "" &&
            new Date(formData.dataInizio) <= new Date(formData.dataFine)
        )
    }

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
                                {governanti.map((governante) => (
                                    <SelectItem key={governante.idProfilo} value={governante.idProfilo}>
                                        {`${governante.nome} ${governante.cognome}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dataInizio" className="text-right">
                            Data Inizio
                        </Label>
                        <Input
                            id="dataInizio"
                            name="dataInizio"
                            type="date"
                            value={formData.dataInizio}
                            onChange={(e) => handleChange("dataInizio", e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dataFine" className="text-right">
                            Data Fine
                        </Label>
                        <Input
                            id="dataFine"
                            name="dataFine"
                            type="date"
                            value={formData.dataFine}
                            onChange={(e) => handleChange("dataFine", e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                {state.errors.descrizione && <div className="text-red-600 mt-2 mb-4">{state.errors.descrizione}</div>}
                {state.message && <div className="text-green-600 mt-2 mb-4">{state.message}</div>}
                <DialogFooter>
                    <Button className="mt-4" type="submit" disabled={!isFormValid()}>
                        Salva modifiche
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

