"use server"

import prisma from "@/app/lib/db"
import getUser from "@/app/lib/user"
import { Profili, ruolo } from "@prisma/client"



export async function getClienti(): Promise<Profili[]> {

    const user = await getUser()

    if (user?.ruolo !== ruolo.PROPRIETARIO) {
        throw new Error("Denied")
    }
    // Fetch profiles from the database
    try {
      const profiles = await prisma.profili.findMany({
        where: {
          ruolo: ruolo.CLIENTE
        }
      })
      return profiles
    } catch (error) {
      console.error(error)
      throw new Error("Errore nel caricamento dei profili")
    }
    
  }