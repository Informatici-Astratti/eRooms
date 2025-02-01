"use server"

import prisma from "@/lib/db";
import { Proprieta } from "@prisma/client";
import { error } from "console";
import { da } from "date-fns/locale";
import { date, z } from "zod"

export default async function getProperty() {
    try {
        const property = await prisma.proprieta.findFirst()
        return property
    } catch (error) {
        
    }
    
    
}


interface PropertyResponse {
    success: boolean
    fields?: Proprieta
    errors?: any
    message?: string
  }

const PropertyFormSchema = z.object({
    id: z.string(),
    nome: z.string().min(1, {message: "Nome troppo corto"}).max(30, {message: "Nome troppo lungo"}),
    email: z.string(),
    telefono: z.string(),
    registrazioneSocieta: z.string().min(1, {message: "Codice troppo corto"}),
    indirizzo: z.string().min(5, {message: "Indirizzo troppo corto"}).max(50, {message: "Indirizzo troppo lungo"}),
    citta: z.string().min(1, {message: "Città non esistente"}).max(30, {message: "Città non esistente"}),
    CAP: z.string().min(1, {message: "CAP troppo corto"}).max(30, {message: "CAP troppo lungo"}),
    paese: z.string(),
});

export async function editPropertyForm(prevState: PropertyResponse, formData: FormData): Promise<PropertyResponse>{
    console.log("0")
    const data: Proprieta = {
        id: formData.get("id") as string,
        nome: formData.get("nome") as string,
        email: formData.get("email") as string,
        telefono: formData.get("telefono") as string,
        registrazioneSocieta: formData.get("registrazioneSocieta") as string,
        indirizzo: formData.get("indirizzo") as string,
        citta: formData.get("citta") as string,
        CAP: formData.get("CAP") as string,
        paese: formData.get("paese") as string,
    }
    const result = PropertyFormSchema.safeParse(data)
    
    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
            fields: data,
        }
    }

    try {
        
        const updateProperty = await prisma.proprieta.update({
            where: { id: result.data.id },
            data: {
                nome: result.data.nome,
                email: result.data.email,
                telefono: result.data.telefono,
                registrazioneSocieta: result.data.registrazioneSocieta,
                indirizzo: result.data.indirizzo,
                citta: result.data.citta,
                CAP: result.data.CAP,
                paese: result.data.paese,
            }
        })
        return{
            success: true,
            message: "I dati della proprietà sono stati modificati con successo",
            fields: data,
        }
    } catch (error) {
        return{
            success: false,
            errors: "Si è verificato un errore nell'aggiornamento dei dati della proprietà. Verificare i dati o ripovare più tardi",
            fields: data,
          }
    }
}