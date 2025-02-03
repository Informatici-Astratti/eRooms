"use client"
import { DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import type { stato_pulizia, Pulizie } from "@prisma/client"
import { useRouter } from "next/navigation"
import { updatePuliziaStato } from "./action"
import { useActionState } from "react"
import { formatEnumValue } from "@/app/lib/formatEnum"

interface ModificaStatusProps {
  pulizie: Pulizie | null
  onClose: () => void
}

export default function ModificaStatus({ pulizie, onClose }: ModificaStatusProps) {
  const [formData, setFormData] = useState({
    codStanza: pulizie?.codStanza || "",
    stato: pulizie?.stato,
  })

  const initialState = { message: "", errors: { descrizione: "" } }
  const [state, formAction] = useActionState(updatePuliziaStato, initialState)

  const router = useRouter()

  const handleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, stato: value as stato_pulizia }))
  }

  useEffect(() => {
    if (pulizie) {
      setFormData({
        codStanza: pulizie.codStanza,
        stato: pulizie.stato,
      })
    }
  }, [pulizie])

  useEffect(() => {
    if (state.message) {
      const timer = setTimeout(() => {
        onClose()
        router.refresh()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [state.message, onClose, router])

  const availableStates: stato_pulizia[] = ["PULITA", "DA_PULIRE"]


  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Modifica Stato</DialogTitle>
        <DialogDescription>Modifica lo stato della pulizia. Clicca salva quando hai finito.</DialogDescription>
      </DialogHeader>
      <form action={formAction}>
        <input type="hidden" name="codStanza" value={formData.codStanza} />
        <input type="hidden" name="newStato" value={formData.stato} />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stato" className="text-right">
              Stato
            </Label>
            <Select name="newStato" onValueChange={handleChange} value={formData.stato}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleziona uno stato" />
              </SelectTrigger>
              <SelectContent>
              {availableStates.map((stato) => (
                <SelectItem key={stato} value={stato}>
                  {formatEnumValue(stato)} {/* Visualizza "DA PULIRE" anziché "DA_PULIRE" */}
                </SelectItem>
              ))}
            </SelectContent>
            </Select>
          </div>
        </div>
        {state.errors.descrizione && <div className="text-red-600 mt-2 mb-4">{state.errors.descrizione}</div>}
        {state.message && <div className="text-green-600 mt-2 mb-4">{state.message}</div>}
        <DialogFooter>
          <Button className="mt-4" type="submit">
            Salva modifiche
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

