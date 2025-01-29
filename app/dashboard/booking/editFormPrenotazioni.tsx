import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { type Prenotazioni, stato_prenotazione, type Stanze, type Ospiti } from "@prisma/client"

type PrenotazioneWithRelations = Prenotazioni & {
  Stanze: Stanze
  Ospiti: Ospiti[]
}

interface ModificaPrenotazioneProps {
  prenotazione: PrenotazioneWithRelations
  onClose: () => void
}

export default function ModificaPrenotazione({ prenotazione, onClose }: ModificaPrenotazioneProps) {
  const [formData, setFormData] = useState({
    dataInizio: new Date(prenotazione.dataInizio).toISOString().split("T")[0],
    dataFine: new Date(prenotazione.dataFine).toISOString().split("T")[0],
    stato: prenotazione.stato,
    nomeStanza: prenotazione.Stanze.nome || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Modifica Prenotazione</DialogTitle>
        <DialogDescription>
          Modifica i dettagli della prenotazione qui. Clicca salva quando hai finito.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataInizio" className="text-right">
              Data Inizio
            </Label>
            <Input
              id="dataInizio"
              name="dataInizio"
              type="date"
              value={formData.dataInizio}
              onChange={handleChange}
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
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stato" className="text-right">
              Stato
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("stato", value as stato_prenotazione)}
              defaultValue={formData.stato}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleziona uno stato" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(stato_prenotazione).map((stato) => (
                  <SelectItem key={stato} value={stato}>
                    {stato}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nomeStanza" className="text-right">
              Nome Stanza
            </Label>
            <Input
              id="nomeStanza"
              name="nomeStanza"
              value={formData.nomeStanza}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Salva modifiche</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

