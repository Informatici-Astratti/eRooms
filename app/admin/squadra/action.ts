"use server"

import prisma from "@/app/lib/db"
import { auth, clerkClient, Invitation } from "@clerk/nextjs/server"
import { ruolo } from "@prisma/client"
import { z } from "zod"

//RESTITUISCE GLI UTENTI CCON IL RUOLO GOVERNANTE E PROPRIETARIO CON RELATIVA EMAIL
export async function getUsers() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Utente non autenticato")
  }

  try {

    const users = await prisma.profili.findMany({
      where: {
        ruolo: {
          in: ["GOVERNANTE", "PROPRIETARIO"],
        },
      },
    })

    return users
  } catch (error) {
    console.error("Errore nel recupero degli utenti:", error)
    throw new Error("Si è verificato un errore nel recupero dei dati.")
  }
}

//METODO PER L'INVIO DELL'EMAIL PER AGGIUNGERE UN MEMBRO ALLA SQUADRA


export async function addSquadra(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().email("Formato email non valido"),
    role: z.nativeEnum(ruolo, { message: "Ruolo non valido" }),
  });

  const parsedData = schema.safeParse({
    email: formData.get("email") as string,
    role: formData.get("ruolo")  as ruolo,
  });

  if (!parsedData.success) {
    return { success: false, message: "", errors: { descrizione: parsedData.error.errors[0].message } };
  }

  const { email, role } = parsedData.data;

  try {
    const client = await clerkClient()
    const response = await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/signup`,
      publicMetadata: {
        "ruolo": role
      }, 
    })

    return { success: true, message: "Invito inviato con successo!", errors: {} };
  } catch (error) {
    console.error(error);
    return { success: false, message: "", errors: { descrizione: "Errore durante l'invio dell'invito." } };
  }
}


export async function removeTeamUser(id: string) {
    // Il profilo non viene eliminato, ma cambiato in cliente
    const profile = await prisma.profili.delete({
      where: {idProfilo: id}
    })

    const clerk = await clerkClient()
    await clerk.users.deleteUser(id)
    return {success: true}
}

