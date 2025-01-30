"use server"

import { error } from "console";
import { date, z } from "zod"

interface PropertyResponse {
    success: boolean
    fields?: z.infer<typeof PropertyFormSchema>
    errors?: any
    message?: string
  }

const PropertyFormSchema = z.object({
    nome: z.string().min(4, {message: "Nome troppo corto"}).max(30, {message: "Nome troppo lungo"}),
    email: z.string(),
    telefono: z.string().trim(),
    societa: z.string().transform((val) => Number.parseInt(val, 10)),
    indirizzo: z.string().min(5, {message: "Indirizzo troppo corto"}).max(50, {message: "Indirizzo troppo lungo"}),
    citta: z.string().min(1, {message: "Città non esistente"}).max(30, {message: "Città non esistente"}),
    CAP: z.string().min(1, {message: "CAP troppo corto"}).max(30, {message: "CAP troppo lungo"}),
    paese: z.string(),
});

export async function editPropertyForm(prevState: PropertyResponse, formData: FormData): Promise<PropertyResponse>{
    console.log("0")
    const data = Object.fromEntries(formData.entries())
    const result = PropertyFormSchema.safeParse(data)
    console.log("1")
    if (!result.success) {
        console.log("2")
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
            fields: data as unknown as z.infer<typeof PropertyFormSchema>,
        }
    }
    console.log("3")
    try {
        console.log(result)
        return{
            success: true,
            message: "I dati della proprietà sono stati modificati con successo",
            fields: result.data,
        }
    } catch (error) {
        return{
            success: false,
            errors: "Si è verificato un errore nell'aggiornamento dei dati della proprietà. Verificare i dati o ripovare più tardi",
            fields: result.data,
          }
    }
}