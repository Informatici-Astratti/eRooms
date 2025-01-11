"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { subYears, parseISO, formatISO } from "date-fns";
import { z } from "zod"
import prisma from "@/lib/db";
import { genere, Prisma, ruolo } from "@prisma/client";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";

// TO DO
const editAccountFormSchema = z.object({
    email: z.string(),
    password: z.string(),
    telefono: z.string().trim()
    // COMPLETARE 
})

export async function editAccountForm(prevState: any, formData: FormData) {
    const { userId } = await auth()

    const result = editAccountFormSchema.safeParse(Object.fromEntries(formData))
    if (!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    
}