"use client"
import { DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { stato_pulizia, Pulizie } from "@prisma/client"
import { useRouter } from "next/navigation"
import { updatePuliziaStato } from "./action"
import { useActionState } from "react"
import { formatEnumValue } from "@/app/lib/formatEnum"
import { useToast } from "@/hooks/use-toast"

interface ModificaStatusProps {
  pulizie: Pulizie | null
  onClose: () => void
}

export default function ModificaStatus({ pulizie, onClose }: ModificaStatusProps) {
  const [formData, setFormData] = useState({
    codStanza: pulizie?.codStanza || "",
    stato: pulizie?.stato,
  })

  const initialState = { message: "", success:false, errors: { descrizione: "" } }
  const [state, formAction] = useActionState(updatePuliziaStato, initialState)


  const handleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, stato: value as stato_pulizia }))
  }

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (pulizie) {
      setFormData({
        codStanza: pulizie.codStanza,
        stato: pulizie.stato,
      })
    }
  }, [pulizie])

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
        codStanza: pulizie?.codStanza || "",
        stato: pulizie?.stato,
      });
      onClose();
      router.refresh()
  }

  }, [state])



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
                {Object.values(stato_pulizia).map((stato) => (
                  <SelectItem key={stato} value={stato}>
                    {formatEnumValue(stato)}
                  </SelectItem>
                ))}
            </SelectContent>
            </Select>
          </div>
        </div>
        {/* {state.errors.descrizione && <div className="text-red-600 mt-2 mb-4">{state.errors.descrizione}</div>}
        {state.message && <div className="text-green-600 mt-2 mb-4">{state.message}</div>} */}
        <DialogFooter>
          <Button className="mt-4" type="submit">
            Salva modifiche
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

