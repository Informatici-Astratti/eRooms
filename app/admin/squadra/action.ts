"use server"

import prisma from "@/app/lib/db"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { z } from "zod"

//RESTITUISCE GLI UTENTI CCON IL RUOLO GOVERNANTE E PROPRIETARIO CON RELATIVA EMAIL
export async function getUsers() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Utente non autenticato")
  }

  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress

    const users = await prisma.profili.findMany({
      where: {
        ruolo: {
          in: ["GOVERNANTE", "PROPRIETARIO"],
        },
      },
    })

    const usersWithEmails = await Promise.all(
      users.map(async (userProfile) => {
        const clerkUser = await clerk.users.getUser(userProfile.idProfilo)
        return {
          ...userProfile,
          email: clerkUser.emailAddresses[0]?.emailAddress || "N/A",
        }
      }),
    )

    return { email, users: usersWithEmails }
  } catch (error) {
    console.error("Errore nel recupero degli utenti:", error)
    throw new Error("Si è verificato un errore nel recupero dei dati.")
  }
}

//METODO PER L'INVIO DELL'EMAIL PER AGGIUNGERE UN MEMBRO ALLA SQUADRA


export async function addSquadra(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().email("Formato email non valido"),
    ruolo: z.enum(["PROPRIETARIO", "GOVERNANTE"], { message: "Ruolo non valido" }),
  });

  const parsedData = schema.safeParse({
    email: formData.get("email"),
    ruolo: formData.get("ruolo"),
  });

  if (!parsedData.success) {
    return { success: false, message: "", errors: { descrizione: parsedData.error.errors[0].message } };
  }

  const { email, ruolo } = parsedData.data;

  try {
    const client = await clerkClient()
    const response = await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.APP_URL}/signup`,
      publicMetadata: { ruolo }, 
    })

    return { success: true, message: "Invito inviato con successo!", errors: {} };
  } catch (error) {
    console.error(error);
    return { success: false, message: "", errors: { descrizione: "Errore durante l'invio dell'invito." } };
  }
}




