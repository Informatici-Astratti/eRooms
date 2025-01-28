"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import { Stanze } from "@prisma/client"
import { promises } from "dns"

export default async function getRoomsList(): Promise<Stanze[]> {
  const roomsList = await prisma.stanze.findMany()
  return roomsList
}

export async function deleteRoom(idStanza: string) {
  const deleteRoom = await prisma.stanze.delete({
    where: {
      idStanza: idStanza
    }
  })
  revalidatePath("/dashboard/room")
}

