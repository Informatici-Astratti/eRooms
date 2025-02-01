"use server"

import prisma from "@/lib/db";
import { Tariffe, tipo_variazione } from "@prisma/client";
import { parseISO, formatISO } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";



const tariffeSchema = z.object({
    idTariffa: z.string(),
    codStanza: z.string(),
    dataInizio: z.date(),
    dataFine: z.date(),
    tipoVariazione: z.nativeEnum(tipo_variazione),
    variazione: z.number().min(0.01, {
        message: "La variazione non è valida"
    })  
}).refine((data) => data.dataFine > data.dataInizio , {
    message: "La data non è valida",
    path: ["dataInizio"]
}).refine((data) => ((data.tipoVariazione === tipo_variazione.AUMENTO_PERCENTUALE 
    || data.tipoVariazione === tipo_variazione.SCONTO_PERCENTUALE) ? 
     (data.variazione <= 100) : true), {
    message: "La percentuale non è valida",
    path: ["variazione"]
});

interface TariffeResponse{
    success: boolean,
    fields?: Tariffe,
    errors?: z.inferFlattenedErrors<typeof tariffeSchema>["fieldErrors"] | string,
    message?: string
}

export async function updateTariffa(prevState: TariffeResponse, formData: FormData): Promise<TariffeResponse>{
    
    const data: Tariffe = {
        idTariffa: formData.get("idTariffa") as string,
        codStanza: formData.get("codStanza") as string,
        tipoVariazione: formData.get("tipoVariazione") as tipo_variazione,
        variazione: Number(formData.get("variazione") as string),
        dataInizio: new Date(formData.get("dataInizio") as string),
        dataFine:new Date(formData.get("dataFine") as string)
    }

    const validatedData = tariffeSchema.safeParse(data);

    if (!validatedData.success) {
        return {
          success: false,
          errors: validatedData.error.flatten().fieldErrors,
          fields: data
        }
    }

    try {
        const updatedTariffa = await prisma.tariffe.update({
            where:{
                idTariffa: validatedData.data.idTariffa
            },
            data: {
                tipoVariazione: validatedData.data.tipoVariazione,
                variazione: validatedData.data.variazione,
                dataInizio: formatISO(validatedData.data.dataInizio),
                dataFine: formatISO(validatedData.data.dataFine)
            }
        })
        return {
            success: true,
            message: "La tariffa è stata modificata con successo",
            fields: data
        }
    } catch (error) {
        return {
            success: false,
            errors: "Si è verificato un errore nell'aggiornamento della tariffa. Verificare i dati o ripovare più tardi",
            fields: data
        }
    }
}

export async function createTariffa(prevState: TariffeResponse, formData: FormData): Promise<TariffeResponse>{
    const data: Tariffe = {
        idTariffa: formData.get("idTariffa") as string,
        codStanza: formData.get("codStanza") as string,
        tipoVariazione: formData.get("tipoVariazione") as tipo_variazione,
        variazione: Number(formData.get("variazione")),
        dataInizio: new Date(formData.get("dataInizio") as string),
        dataFine: new Date(formData.get("dataFine") as string)
    }

    console.log(data)

    const validatedData = tariffeSchema.safeParse(data);

    if (!validatedData.success) {
        return {
          success: false,
          errors: validatedData.error.flatten().fieldErrors,
          fields: data
        }
    } 

    try {
        const createdTariffa = await prisma.tariffe.create({
            data: {
                codStanza: validatedData.data.codStanza,
                tipoVariazione: validatedData.data.tipoVariazione,
                variazione: validatedData.data.variazione,
                dataInizio: formatISO(validatedData.data.dataInizio),
                dataFine: formatISO(validatedData.data.dataFine)
            }
        })

        console.log("Creazione Effettuata")
    } catch (error) {
        console.log(error)
        return {
            success: false,
            errors: "Si è verificato un errore nell'aggiornamento della tariffa. Verificare i dati o ripovare più tardi",
            fields: data
        }
    }

    return {
        success: true,
        errors: "La tariffa è stata creata con successo",
        fields: data
    }
}

export async function deleteTariffa(idTariffa: string): Promise<TariffeResponse>{

    try{
        const deleteTariffa = await prisma.tariffe.delete({
          where: {
            idTariffa: idTariffa
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
