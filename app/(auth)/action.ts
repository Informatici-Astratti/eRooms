"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { subYears, parseISO } from "date-fns";

import { z } from "zod"
import { Genere } from "@/constants/genere";

const loginSchema = z.object({
    email: z.string().email({message: "Email non valida"}).trim(),
    password: z.string().trim()
})

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
    const supabase = await createClient();

    const result = signUpSchema.safeParse(Object.fromEntries(formData))
    if (!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

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



const signUpContinueSchema = z.object({
    nome: z.string().min(2).max(50, {message: "Nome non valido"}),
    cognome: z.string().min(2).max(50, {message: "Cognome non valido"}),
    cf: z.string().trim().length(16)
        .regex(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i, {message: "Codice Fiscale non valido"}),
    telefono: z.string().trim(),
    dataNascita: z.string().date().refine((date) => {
        const parsedDate = parseISO(date);
        const minAgeDate = subYears(new Date(), 18);
        return parsedDate <= minAgeDate;
    }, {
        message: "L'Utente deve avere più di 18 anni"
    }),
    genere: z.nativeEnum(Genere, {message: "Genere non Valido"})
});

export async function signUpContinue(prevState: any, formData: FormData){
    //TODO: Completare la registrazione con ORM o altro

}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    redirect("/")
}