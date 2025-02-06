"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { subYears, parseISO, formatISO } from "date-fns";
import { z } from "zod"
import prisma from "@/app/lib/db";
import { genere, Prisma, ruolo } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";

const signUpContinueSchema = z.object({
<<<<<<< HEAD
    nome: z.string().min(2).max(50, { message: "Nome non valido" }),
    cognome: z.string().min(2).max(50, { message: "Cognome non valido" }),
=======
    nome: z.string().min(2).max(50, {message: "Nome non valido"}),
    cognome: z.string().min(2).max(50, {message: "Cognome non valido"}),
>>>>>>> d7fd8af90469b608eb77c168d3fb4f03239b5a7b
    cf: z.string().trim().length(16)
        .regex(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i, { message: "Codice Fiscale non valido" }),
    telefono: z.string().trim(),
    dataNascita: z.string().date().refine((date) => {
        const parsedDate = parseISO(date);
        const minAgeDate = subYears(new Date(), 18);
        return parsedDate <= minAgeDate;
    }, {
        message: "L'Utente deve avere più di 18 anni"
    }),
    genere: z.nativeEnum(genere, { message: "Genere non Valido" })
});

export async function signUpContinue(prevState: any, formData: FormData) {

    const { userId } = await auth()

    const result = signUpContinueSchema.safeParse(Object.fromEntries(formData))
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    if (!userId) {
        redirect("/login")
    }

    try {
        const ruoloCheck = await clerkClient();
        const user = await ruoloCheck.users.getUser(userId);
        const ruoloUtente = user.publicMetadata?.ruolo as keyof typeof ruolo ?? "CLIENTE"; // Di default cliente, altrimenti il ruolo default è CLIENTE
        const dbUser = await prisma.profili.create({
            data: {
                idProfilo: userId,
                nome: result.data.nome ?? "",
                cognome: result.data.cognome ?? "",
                telefono: result.data.telefono ?? "",
                cf: result.data.cf ?? "",
                dataNascita: formatISO(result.data.dataNascita) ?? "",
                genere: result.data.genere ?? genere.NS,
                ruolo: ruolo[ruoloUtente]
            }
        })
    }
    catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // Errore noto di Prisma
            console.error("Errore noto di Prisma:", e.message, e.code);
        } else if (e instanceof Prisma.PrismaClientUnknownRequestError) {
            // Errore sconosciuto di Prisma
            console.error("Errore sconosciuto di Prisma:", e.message);
        } else if (e instanceof Prisma.PrismaClientRustPanicError) {
            // Errore di panic di Prisma
            console.error("Errore di panic di Prisma:", e.message);
        } else if (e instanceof Prisma.PrismaClientInitializationError) {
            // Errore di inizializzazione di Prisma
            console.error("Errore di inizializzazione di Prisma:", e.message);
        } else if (e instanceof Prisma.PrismaClientValidationError) {
            // Errore di validazione di Prisma
            console.error("Errore di validazione di Prisma:", e.message);
        } else {
            // Altro tipo di errore
            console.error("Errore sconosciuto:", e);
        }
    }



    revalidatePath('/', 'layout')
    redirect("/admin")
}