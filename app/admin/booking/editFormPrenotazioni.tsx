"use client"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { type Prenotazioni, type Stanze, type Ospiti, stato_prenotazione } from "@prisma/client"
import { updateBooking } from "./action"
import { useActionState } from "react"


interface ModificaPrenotazioneProps {
  prenotazione: Prenotazioni
  onClose: () => void
  allRooms: Stanze[]
}

export default function ModificaPrenotazione({ prenotazione, onClose, allRooms }: ModificaPrenotazioneProps) {
  const [formData, setFormData] = useState({ //Mostra i valori presenti nel form all'utente e ne aggiorna la modifica
    idPrenotazione: prenotazione.idPrenotazione,
    dataInizio: new Date(prenotazione.dataInizio).toISOString().split("T")[0],
    dataFine: new Date(prenotazione.dataFine).toISOString().split("T")[0],
    stato: prenotazione.stato,
    codStanza: prenotazione.codStanza,
  })

  const [state, formAction] = useActionState(updateBooking, { //Gestisce l'aggiornamento dei dati
    errors: undefined,
    message: undefined,
  })

  // Funzione unica per gestire tutti i cambiamenti nel form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Modifica Prenotazione</DialogTitle>
        <DialogDescription>
          Modifica i dettagli della prenotazione qui. Clicca salva quando hai finito.
        </DialogDescription>
      </DialogHeader>
      <form action={formAction}>
        <input type="hidden" name="idPrenotazione" value={formData.idPrenotazione} />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stato" className="text-right">Stato</Label>
            <Select
              name="stato"
              onValueChange={(value) => handleChange({ target: { name: 'stato', value } } as React.ChangeEvent<HTMLInputElement>)}
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
            <Label htmlFor="codStanza" className="text-right">Stanza</Label>
            <Select
              name="codStanza"
              onValueChange={(value) => handleChange({ target: { name: 'codStanza', value } } as React.ChangeEvent<HTMLInputElement>)}
              defaultValue={formData.codStanza}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleziona una stanza" />
              </SelectTrigger>
              <SelectContent>
                {allRooms.map((room) => (
                  <SelectItem key={room.idStanza} value={room.idStanza}>
                    {room.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataInizio" className="text-right">Data Inizio</Label>
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
            <Label htmlFor="dataFine" className="text-right">Data Fine</Label>
            <Input
              id="dataFine"
              name="dataFine"
              type="date"
              value={formData.dataFine}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        {state?.errors && (
          <div className="text-red-600 mt-2 mb-4">
            {state.errors.descrizione}
          </div>
        )}
        {state?.message && <p className="text-green-600 mt-2 mb-4">{state.message}</p>}
        <DialogFooter>
          <Button className="mt-20px" type="submit">Salva modifiche</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
