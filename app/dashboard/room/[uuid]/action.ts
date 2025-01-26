

import prisma from "@/lib/db"
import { Stanze } from "@prisma/client"

export async function getRoom(uuid: string): Promise<Stanze | null> {
  try {
    const room = await prisma.stanze.findUnique({
      where: {
        idStanza: uuid,
      },
    })
    return room
  } catch (error) {
    console.error("Error fetching room:", error)
    throw new Error("Unable to fetch room")
  }
}