"use client";

import ErrorForm from "@/components/ErrorForm";
import NumericInput from "@/components/numericInputUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stanze, Tariffe, tipo_variazione } from "@prisma/client";
import { useActionState, useEffect, useState } from "react";
import { ToastAction } from "@/components/ui/toast"
import { toast, useToast } from "@/hooks/use-toast";
import { redirect, useRouter } from "next/navigation";
import { createRoom, updateRoomById } from "./action";
import { CalendarIcon, Pencil, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/app/lib/utils";
import { addDays, format, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { updateTariffa, createTariffa } from "./tariffeAction";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatEnumValue } from "@/app/lib/formatEnum";


interface EditTariffaFormProps {
  tariffa: Tariffe | null
  codStanza?: string
};

export default function EditTariffaForm({ tariffa, codStanza }: EditTariffaFormProps) {
  const { toast } = useToast()
  const router = useRouter()

  const [state, formAction] = useActionState(tariffa ? updateTariffa : createTariffa, {
    success: false,
    fields: tariffa ?? {
      idTariffa: "",
      codStanza: codStanza ?? "",
      tipoVariazione: tipo_variazione.NULLA,
      variazione: 0,
      dataInizio: new Date(),
      dataFine: addDays(new Date(), 7)
    }
  }
  );


  const [data, setData] = useState<DateRange | undefined>({
    from: state.fields?.dataInizio,
    to: state.fields?.dataFine,
  })

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Successo",
        description: state.message,
        variant: "success",
      })

      router.refresh()
    }
  }, [state.success])

  return (
    <Dialog>
      <DialogTrigger asChild>
        {tariffa ?
          (<Button variant={"outline"}>
            <Pencil />
            Modifica
          </Button>)
          :
          <Button variant={"link"}>
            Aggiungi Tariffa
          </Button>
        }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tariffa ? "Modifica Tariffa" : "Aggiungi Tariffa"}</DialogTitle>
          <DialogDescription>
            {tariffa ? "Aggiorna il Prezzo o le Date di validità" : "Aggingi un nuovo prezzo per la tua stanza"}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label>Seleziona Tipo di Variazione</Label>
            <Select key={crypto.randomUUID()} name="tipoVariazione" {...(state.fields?.tipoVariazione !== tipo_variazione.NULLA ? { defaultValue: state.fields?.tipoVariazione } : {})}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Tipo di Variazione" />
              </SelectTrigger>
              <SelectContent key={crypto.randomUUID()}>
                {Object.values(tipo_variazione)
                  .filter(tipo => tipo !== tipo_variazione.NULLA)
                  .map(tipo => (
                    <SelectItem key={`${tariffa?.idTariffa ?? 'new'}-${tipo}`} value={tipo}>
                      {formatEnumValue(tipo)}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <ErrorForm errors={typeof state.errors === 'object' ? state.errors?.tipoVariazione : undefined} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Variazione</Label>
            <Input
              id="price"
              type="number"
              name="variazione"
              placeholder="Inserisci la Variazione"
              defaultValue={state.fields?.variazione}
              required
            />
            <ErrorForm errors={typeof state.errors === 'object' ? state.errors?.variazione : undefined} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Periodo Validità</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn("col-span-3 justify-start text-left font-normal", !data && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data?.from ? (
                    data.to ? (
                      <>
                        {format(data.from, "dd/MM/yyyy")} - {format(data.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(data.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Seleziona un intervallo di date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={data?.from}
                  selected={data}
                  onSelect={setData}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <ErrorForm errors={typeof state.errors === 'object' ? state.errors?.dataInizio : undefined} />
            <ErrorForm errors={typeof state.errors === 'object' ? state.errors?.dataFine : undefined} />
            <Input type="hidden" value={data?.from ? format(data.from, "yyyy-MM-dd") : ''} name="dataInizio" />
            <Input type="hidden" value={data?.to ? format(data.to, "yyyy-MM-dd") : ''} name="dataFine" />
          </div>

          <Input type="hidden" value={state.fields?.idTariffa} name="idTariffa" />
          <Input type="hidden" value={state.fields?.codStanza} name="codStanza" />

          <Button type="submit" className="w-full">
            {tariffa ? "Modifica" : "Aggiungi"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>





  );
}

