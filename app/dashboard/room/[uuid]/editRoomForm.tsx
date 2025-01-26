"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import NumericInput from "@/components/numericInputUI"

import "./scrollbar.css"
import { Stanze } from "@prisma/client"




const FormSchema = z.object({
  nome: z.string().min(1, {message: "Nome della stanza obbligatorio"}),
  descrizione: z.string().min(1, {message: "Descrizione obbligatoria"}),
  capienza: z.number()
})

interface EditRoomFormProps {
  room: Stanze | null
}

export default function EditRoomForm({ room }: EditRoomFormProps) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nome: room?.nome ?? "",
      descrizione: room?.descrizione ?? "",
      capienza: room?.capienza ?? 0
    },
  })

  
  /*
  // Funzione per aggiungere un nuovo campo
  const handleAddItem = () => {
    const newId =
      form.getValues("tariffe").length > 0 ? form.getValues("tariffe")[form.getValues("tariffe").length - 1].id + 1 : 1
    form.setValue("tariffe", [...form.getValues("tariffe"), { id: newId, dateRange: undefined }])
  }

  // Funzione per rimuovere un campo
  const handleRemoveItem = (id: number) => {
    const updatedTariffe = form.getValues("tariffe").filter((item) => item.id !== id)
    form.setValue("tariffe", updatedTariffe)
  }

  // Funzione per gestire la modifica del valore di un input
  const handleDateChange = (id: number, newDateRange: { from?: Date; to?: Date } | undefined) => {
    const updatedTariffe = form
      .getValues("tariffe")
      .map((item) => (item.id === id ? { ...item, dateRange: newDateRange } : item))
    form.setValue("tariffe", updatedTariffe)
  }

  
  */
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-[2fr_1fr] gap-6 space-y-6">
        <div className="col-start-1 row-start-1 space-y-4">
          <div className="mt-[25]">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{form.formState.errors.nome?.message || "Nome della Stanza"}</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="descrizione"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{form.formState.errors.descrizione?.message || "Descrizione"}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder=""
                    className="resize-none w-full h-32"
                    {...field}
                  />
                </FormControl>
                
              </FormItem>
            )}
          />
          {/*
          <FormField
            control={form.control}
            name="tariffe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tariffe</FormLabel>
                <FormDescription></FormDescription>
                <FormControl>
                  <ScrollableDatePicker
                    value={form.getValues("tariffe")}
                    onAddItem={handleAddItem}
                    onRemoveItem={handleRemoveItem}
                    onDateChange={handleDateChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        */}

        <div className="col-start-2 row-start-1 flex justify-center">
          <FormField
            control={form.control}
            name="capienza"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-[23]">Capienza</FormLabel>
                <FormControl>
                  <NumericInput value={field.value} min={0} max={100} step={1} onChange={field.onChange}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        </div>

        <div className="col-start-1 row-start-2">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}

