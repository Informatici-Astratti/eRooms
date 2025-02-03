"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/app/lib/db"
import { FotoStanze, Prisma, Stanze, stato_prenotazione, Tariffe } from "@prisma/client"
import { promises } from "dns"
import { redirect } from "next/navigation"
import { formSchema } from "./roomFormSchema"
import { utapi } from "@/app/lib/uploadthingAPI"
import { z } from "zod"

interface StanzeResponse{
  success: boolean,
  fields?: StanzeForm,
  errors?: any,
  message?: string
}

class StanzeError extends Error {

  public readonly errors: any;

  constructor(message: string, errors: any) {
    super(message);
    this.errors = errors;
    Object.setPrototypeOf(this, StanzeError.prototype);
  }

}

export type StanzeConTariffeFoto = Prisma.StanzeGetPayload<{
  include: {Tariffe: true, FotoStanze: true}
}>

export type StanzeForm = Stanze & {
  foto?: string[]
}


export default async function getAllRooms(): Promise<StanzeConTariffeFoto[]> {
  const roomsList: StanzeConTariffeFoto[] = await prisma.stanze.findMany({
    include:{
      Tariffe: true,
      FotoStanze: true
    }
  })
  return roomsList
}

export async function getRoomById(idStanza: string): Promise<StanzeForm | null> {
  try {
    const room = await prisma.stanze.findUnique({
      where: {
        idStanza: idStanza,
      },
      include: {
        FotoStanze: {
          select:{
            idFoto: true
          }
        }
      }
    })

    return {
      idStanza: room?.idStanza,
      nome: room?.nome,
      descrizione: room?.descrizione,
      capienza: room?.capienza,
      costoStandard: room?.costoStandard,
      foto: room?.FotoStanze.map((foto) => foto.idFoto)
    } as StanzeForm
    
  } catch (error) {
    return null
  }
}

export async function deleteRoom(idStanza: string): Promise<StanzeResponse> {

  try{

    const foto = await prisma.fotoStanze.findMany({
      select: {idFoto: true},
      where: {codStanza: idStanza}
    })

    const fotoIds = foto.map((foto) => foto.idFoto)

    const res = await utapi.deleteFiles(fotoIds)

    if(!res.success){
      throw new Error()
    }

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
  const roomData: StanzeForm = {
    idStanza: formData.get("idStanza") as string,
    nome: formData.get("nome") as string,
    descrizione: formData.get("descrizione") as string,
    capienza: Number(formData.get("capienza") as string),
    costoStandard: Number(formData.get("costoStandard") as string),
    foto: JSON.parse(formData.get("foto") as string) as string[]
  }
  const validatedData = formSchema.safeParse(roomData)
  
  try {

    if(!validatedData.success){
      throw new StanzeError("I dati non sono validi", validatedData.error?.flatten().fieldErrors)
    }

    const updatedRoom = await prisma.stanze.update({
      where: { idStanza: validatedData.data.idStanza },
      data: {
          nome: validatedData.data.nome,
          capienza: validatedData.data.capienza,
          descrizione: validatedData.data.descrizione,
          costoStandard: validatedData.data.costoStandard
      },
    })

    const updatedFoto = await prisma.fotoStanze.updateMany({
      where: {
        idFoto: {
          in: validatedData.data.foto
        },
        codStanza: null
      },
      data: {
        codStanza: validatedData.data.idStanza
      }
    })

    return{
      success: true,
      message: "La stanza è stata modificata con successo",
      fields: roomData
    }
  } catch (error) {
    let errorMessage = "Si è verificato un errore nell'aggiornamento della stanza, ripovare più tardi"
    let errorFields = {}
    
    if (error instanceof StanzeError){
      errorMessage = error.message
      errorFields = error.errors
    } else if (error instanceof Prisma.PrismaClientKnownRequestError){
      errorMessage = "Errore di database: " + error.message
    }
    
    return{
      success: false,
      message: errorMessage,
      errors: errorFields,
      fields: roomData
    }
   
  }
}

export async function createRoom(prevState: StanzeResponse, formData: FormData): Promise<StanzeResponse>{

  const roomData: StanzeForm = {
    idStanza: formData.get("idStanza") as string,
    nome: formData.get("nome") as string,
    descrizione: formData.get("descrizione") as string,
    capienza: Number(formData.get("capienza") as string),
    costoStandard: Number(formData.get("costoStandard") as string),
    foto: JSON.parse(formData.get("foto") as string) as string[]
  }

  const validatedData = formSchema.safeParse(roomData)
  
  try {
    if (!validatedData.success) {
      throw new StanzeError("I dati non sono validi", validatedData.error?.flatten().fieldErrors)
    }

    const createdRoom = await prisma.stanze.create({
      data: {
        nome: validatedData.data.nome,
        capienza: validatedData.data.capienza,
        descrizione: validatedData.data.descrizione,
        costoStandard: validatedData.data.costoStandard
      }
    })

    const updatedFoto = await prisma.fotoStanze.updateMany({
      where: {idFoto: {
        in: validatedData.data.foto
      }},
      data: {
        codStanza: createdRoom.idStanza
      }
    })

    const createPulizieRow = await prisma.pulizie.create({
      data: {codStanza: validatedData.data.idStanza}
    })
  } catch (error) {
    let errorMessage = "Si è verificato un errore nella creazione della stanza, ripovare più tardi."
    let errorFields = {}
    
    if (error instanceof StanzeError){
      errorMessage = error.message
      errorFields = error.errors
    } else if (error instanceof Prisma.PrismaClientKnownRequestError){
      errorMessage = "Errore di database: " + error.message
    }
    
    return{
      success: false,
      message: errorMessage,
      errors: errorFields,
      fields: roomData
    }
  }

  redirect("/admin/room") 
}

export async function deleteRoomPicture(idFoto: string): Promise<boolean>{
  try{
    const res = await utapi.deleteFiles(idFoto)

    if (!res.success){
      throw new Error()
    }

    const deletedFoto = await prisma.fotoStanze.delete({
      where: {idFoto: idFoto}
    })

    return true;
  } catch (e){
    return false;
  }
}

export async function createRoomPicture(idFoto: string): Promise<boolean>{
  try{
    const createdFoto = await prisma.fotoStanze.create({
      data: {idFoto: idFoto}
    })

    return true;
  } catch (e){

    return false;
  }
}

export async function getFotoURL(idFoto: string): Promise<string>{
  return `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${idFoto}`
}

