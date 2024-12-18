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