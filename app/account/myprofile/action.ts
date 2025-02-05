"use server"

import prisma from "@/app/lib/db"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { $Enums, genere, Profili } from "@prisma/client"
import { subYears } from "date-fns";
import { z } from "zod";

const signUpContinueSchema = z.object({
    nome: z.string().min(2).max(50, {message: "Nome non valido"}),
    cognome: z.string().min(2).max(50, {message: "Cognome non valido"}),
    cf: z.string().trim().length(16)
        .regex(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i, {message: "Codice Fiscale non valido"}),
    telefono: z.string().trim(),
    dataNascita: z.preprocess(
        (arg) => {
          if (typeof arg === "string" || arg instanceof Date) {
            // Se è una stringa, prova a convertirla in Date
            return new Date(arg);
          }
          return arg;
        },
        z
          .date()
          .refine(
            (date) => {
              const minAgeDate = subYears(new Date(), 18);
              return date <= minAgeDate;
            },
            { message: "L'Utente deve avere più di 18 anni" }
          )
      ),
    genere: z.nativeEnum(genere, {message: "Genere non Valido"})
});

export async function getAccountProfile() {
    const { userId } = await auth()
    if (userId) {
        const profile = await prisma.profili.findUnique({
            where: {
                idProfilo: userId,
            },
        })
        return profile
    }
}
export async function getUserClerk() {
    const { userId } = await auth()
    if (userId) {
        const user = await (await clerkClient()).users.getUser(userId)
        return user
    }
}

interface ProfileResponse {
    success: boolean
    fields?: Profili
    errors?: any
    message?: string
}

export async function editAccountProfile(prevState: ProfileResponse, formData: FormData): Promise<ProfileResponse>{
    console.log("1")
    const data: Profili = {
        idProfilo: formData.get("idProfilo") as string,
        nome: formData.get("nome") as string,
        cognome: formData.get("cognome") as string,
        telefono: formData.get("telefono") as string | null,
        cf: formData.get("cf") as string | null,
        piva: formData.get("piva") as string | null,
        dataNascita: new Date(formData.get("dataNascita") as string),
        genere: formData.get("genere") as $Enums.genere,
        indirizzo: formData.get("indirizzo") as string | null,
        ruolo: formData.get("ruolo") as $Enums.ruolo,
      };
    const result = signUpContinueSchema.safeParse(data)
    
    if (!result.success) {
        
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
            fields: data,
        }
    }
    
    try {
        const updatedProfile = await prisma.profili.update({
            where: { idProfilo: data.idProfilo },
            data: {
                nome: result.data.nome,
                cognome: result.data.cognome,
                telefono: result.data.telefono,
                cf: result.data.cf,
                dataNascita: result.data.dataNascita,
                genere: result.data.genere
            }
        }) 
        return{
            success: true,
            message: "I dati personali sono stati modificati con successo",
            fields: data,
        }
    } catch (error) {
        return{
            success: false,
            errors: "Si è verificato un errore nell'aggiornamento dei dati personali. Verificare i dati o ripovare più tardi",
            fields: data,
          }
    }
}