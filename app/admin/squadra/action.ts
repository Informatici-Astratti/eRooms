"use server";

import prisma from "@/app/lib/db";

export async function getUsers() {
  try {
    const users = await prisma.profili.findMany({
      where: {
        ruolo: {
          in: ["GOVERNANTE", "PROPRIETARIO"]
        }
      } 
    });
    return users;
  } catch (error) {
    console.error("Errore nel recupero degli utenti:", error);
    throw new Error("Si è verificato un errore nel recupero dei dati.");
  }
}

