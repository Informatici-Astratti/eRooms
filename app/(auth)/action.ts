"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { z } from "zod"

const loginSchema = z.object({
    email: z.string().email({message: "Email non valida"}).trim(),
    password: z.string().trim()
})

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

const signUpContinueSchema = z.object({
    nome: z.string().min(2).max(50, {message: "Nome non valido"}),
    cognome: z.string().min(2).max(50, {message: "Cognome non valido"}),
    cf: z.string().length(16)
        .regex(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i, {message: "Codice Fiscale non valido"}),
    telefono: z.string().max(11, {message: "Numero di Telefono non valido"}),
    dataNascita: z.date(),  // TO DO
    genere: z.string()
});


export async function loginWithMail(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const result = loginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    const { error } = await supabase.auth.signInWithPassword(result.data)

    if (error){
        return {
            errors: {
                email: ["Email o Password non validi"]
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect("/dashboard")
}

export async function signUpWithEmailAndPassword(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const result = signUpSchema.safeParse(Object.fromEntries(formData))
    if (!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    // ERROR: NON FUNZIONA LA REGISTRAZIONE DA AGGIUSTARE

    const { data, error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
    })

    if (error){
        return {
            errors: {
                email: ["Registrazione Fallita"]
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect("/login")
}


export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    redirect("/")
}


export async function signUpContinue(prevState: any, formData: FormData){
    const supabase = await createClient();

    const result = signUpContinueSchema.safeParse(Object.fromEntries(formData))

    if (!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    // CONTINUA DATABASE
}