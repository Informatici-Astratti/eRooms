import prisma from "@/app/lib/db"
import { Profili } from "@prisma/client"



export async function getProfili(): Promise<Profili[]> {
    // Fetch profiles from the database
    const profiles = await prisma.profili.findMany()
    return profiles
  }