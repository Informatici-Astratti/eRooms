"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { subYears, parseISO } from "date-fns";

import { z } from "zod"

import prisma from "@/lib/db";
import { genere, ruolo } from "@prisma/client";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

const loginSchema = z.object({
    email: z.string().email({message: "Email non valida"}).trim(),
    password: z.string().trim()
})

export async function loginWithMail(prevState: any, formData: FormData) {

    const result = loginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    const response = await auth.api.signInEmail({
        body: {
            email: result.data.email,
            password: result.data.password
        },
        asResponse: true
    })

    if (!response.ok){
        return {
            errors: {
                email: ["Email o Password non validi"]
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect("/dashboard")
}

const signUpSchema = z.object({
    email: z.string().email({message: "Email non valida"}).trim(),
    password: z.string().min(8, {message: "La password deve avere almeno 8 caratteri"})
        .regex(/[0-9]/, {message: "La password deve contenere almeno un numero"})
        .regex(/[^a-zA-Z0-9]/, {message: "La password deve contenere almeno un simbolo"})
        .trim(),
    confirmPassword: z.string().trim()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"], // path of error
});

export async function signUpWithEmailAndPassword(prevState: any, formData: FormData) {

    const result = signUpSchema.safeParse(Object.fromEntries(formData))
    if (!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    try{
        await auth.api.signUpEmail({
        
            body: {
                email: result.data.email,
                password: result.data.password,
                name:""
            },
            asResponse: true
        })
    }catch(error){
        if (error instanceof APIError) {
            return {
                errors: {
                    email: ["Registrazione Fallita"]
                }
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect("/login")
}



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

    const result = signUpContinueSchema.safeParse(Object.fromEntries(formData))
    if (!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    const {data} = await authClient.getSession()

    if(!data ){
        redirect("/error")
    }

    const user = data.user;

    try{
        const dbUser = await prisma.profili.create({
            data: {
                idProfilo: user.id,
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

export async function logout() {
    await auth.api.signOut({
        headers: await headers()
    });
    redirect("/")
}