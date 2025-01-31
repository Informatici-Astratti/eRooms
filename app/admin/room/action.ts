"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import { Prisma, Stanze, stato_prenotazione, Tariffe } from "@prisma/client"
import { promises } from "dns"
import { redirect } from "next/navigation"
import { formSchema } from "./roomFormSchema"

interface StanzeResponse{
  success: boolean,
  fields?: Stanze,
  errors?: any,
  message?: string
}

export type StanzeConTariffe = Prisma.StanzeGetPayload<{
  include: {Tariffe: true}
}>


export default async function getAllRooms(): Promise<StanzeConTariffe[]> {
  const roomsList: StanzeConTariffe[] = await prisma.stanze.findMany({
    include:{
      Tariffe: true
    }
  })
  return roomsList
}

export async function getRoomById(idStanza: string): Promise<Stanze | null> {
  try {
    const room = await prisma.stanze.findUnique({
      where: {
        idStanza: idStanza,
      },
    })
    return room
    
  } catch (error) {
    return null
  }
}

export async function deleteRoom(idStanza: string): Promise<StanzeResponse> {

  try{
    const deleteRoom = await prisma.stanze.delete({
      where: {
        idStanza: idStanza
      }
    })

    return {success: true}
  } catch(e){
    return {
      success: false,
      errors: "La stanza non può essere eliminata"
    }
  }
}



export async function updateRoomById(prevState: StanzeResponse, formData: FormData): Promise<StanzeResponse> {
  const data: Stanze = {
    idStanza: formData.get("idStanza") as string,
    nome: formData.get("nome") as string,
    descrizione: formData.get("descrizione") as string,
    capienza: Number(formData.get("capienza") as string),
    costoStandard: Number(formData.get("costoStandard") as string),
    foto: []
  }

  const result = formSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      fields: data
    }
  }
  
  try {
    const updatedRoom = await prisma.stanze.update({
      where: { idStanza: result.data.idStanza },
      data: {
          nome: result.data.nome,
          capienza: result.data.capienza,
          descrizione: result.data.descrizione,
          costoStandard: result.data.costoStandard,
      //foto: [],
      },
    })
    return{
      success: true,
      message: "La stanza è stata modificata con successo",
      fields: data
    }
  } catch (error) {
    return{
      success: false,
      errors: "Si è verificato un errore nell'aggiornamento della stanza. Verificare i dati o ripovare più tardi",
      fields: data
    }
  }
}

export async function createRoom(prevState: StanzeResponse, formData: FormData): Promise<StanzeResponse>{

  const data: Stanze = {
    idStanza: formData.get("idStanza") as string,
    nome: formData.get("nome") as string,
    descrizione: formData.get("descrizione") as string,
    capienza: Number(formData.get("capienza") as string),
    costoStandard: Number(formData.get("costoStandard") as string),
    foto: []
  }

  const result = formSchema.safeParse(data)

  if (!result.success) {
    console.log("Errore")
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      fields: data
    }
  }
  
  try {
    const createdRoom = await prisma.stanze.create({
      data: {
        nome: result.data.nome,
        capienza: result.data.capienza,
        descrizione: result.data.descrizione,
        costoStandard: result.data.costoStandard
        //foto: [],
      },
    })
  } catch (error) {
    return{
      success: false,
      errors: "Si è verificato un errore nella creazione della stanza. Verificare i dati o ripovare più tardi",
      fields: data
    }
  }

  redirect("/admin/room")
}

