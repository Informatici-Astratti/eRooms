"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { subYears, parseISO } from "date-fns";
import { z } from "zod"
import prisma from "@/lib/db";
import { genere, ruolo } from "@prisma/client";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";

const signUpContinueSchema = z.object({
    nome: z.string().min(2).max(50, {message: "Nome non valido"}),
    cognome: z.string().min(2).max(50, {message: "Cognome non valido"}),
    cf: z.string().trim().length(16)
        .regex(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i, {message: "Codice Fiscale non valido"}),
    telefono: z.string().trim(),
    dataNascita: z.string().datetime().refine((date) => {
        const parsedDate = parseISO(date);
        const minAgeDate = subYears(new Date(), 18);
        return parsedDate <= minAgeDate;
    }, {
        message: "L'Utente deve avere più di 18 anni"
    }),
    genere: z.nativeEnum(genere, {message: "Genere non Valido"})
});

export async function signUpContinue(prevState: any, formData: FormData){

    console.log(Object.fromEntries(formData))

    const { userId } = await auth()

    console.log(userId)

    const result = signUpContinueSchema.safeParse(Object.fromEntries(formData))
    if (!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }
    
    if(!userId){
        redirect("/login")
    }

    try{
        const dbUser = await prisma.profili.create({
            data: {
                idProfilo: userId,
                nome: result.data.nome ?? "",
                cognome: result.data.cognome ?? "",
                telefono: result.data.telefono ?? "",
                cf: result.data.cf ?? "",
                dataNascita: result.data.dataNascita ?? "",
                genere: result.data.genere ?? genere.NS,
                ruolo: ruolo.CLIENTE 
            }
        })
    }
    catch(e){
        console.log(e)
    }

    

    revalidatePath('/', 'layout')
    redirect("/dashboard")
}