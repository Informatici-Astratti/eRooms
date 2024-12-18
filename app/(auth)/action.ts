"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { z } from "zod"

const loginSchema = z.object({
    email: z.string().email({message: "Email non valida"}).trim(),
    password: z.string().min(8, {message: "La password deve avere almeno 8 caratteri"}).trim()
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

export async function signup(prevState: any, formData: FormData) {

}
export async function logout() {

}