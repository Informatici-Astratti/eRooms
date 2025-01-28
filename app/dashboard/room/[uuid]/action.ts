"use server"

import prisma from "@/lib/db"
import { Stanze } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { object, z } from "zod"
import { request } from "http"
import { Form } from "react-hook-form"
import { formSchema } from "./roomFormSchema"
import { toast } from "@/hooks/use-toast"
import { redirect } from "next/navigation"


export async function getRoom(uuid: string): Promise<Stanze | null> {
  try {
    if (uuid == "new") { 
      const newRoom: Stanze = {
        idStanza: "new",
        nome: "",
        descrizione: "",
        capienza: 0,
        foto: []
      }
      return newRoom
    }
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

export async function updateRoom(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData)
  const parsedData = {
    ...rawData,
    capienza: Number.parseInt(rawData.capienza as string, 10),
  }

  const result = formSchema.safeParse(parsedData)

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  
  try {
    if (result.data.idStanza == "new") {
      
      const newRoom = await prisma.stanze.create({
        data: {
          nome: result.data.nome,
          capienza: result.data.capienza,
          descrizione: result.data.descrizione,
          //foto: [],
        },
      })
      redirect("/dashboard/room")
    } else if (result.data.idStanza) {
      
      const updatedRoom = await prisma.stanze.update({
        where: { idStanza: result.data.idStanza },
        data: {
        nome: result.data.nome,
        capienza: result.data.capienza,
        descrizione: result.data.descrizione,
        //foto: [],
        },
      })
      redirect("/dashboard/room")
    } else {
      throw new Error("Invalid room state")
    }
    revalidatePath("/dashboard/room")
  } catch (error) {
    
  }
  
  return {fieldData: result}
}
/*
export async function createRoom(data: z.infer<typeof FormSchema>): Promise<Stanze> {
  const newRoom = await prisma.stanze.create({
    data: {
      ...data,
      foto: [],
    },
  })
  return newRoom
}

export async function updateRoom(id: string, data: z.infer<typeof FormSchema>): Promise<Stanze> {
  const updatedRoom = await prisma.stanze.update({
    where: { idStanza: id },
    data,
  })
  revalidatePath("/dashboard/room")
  return updatedRoom
}
  */