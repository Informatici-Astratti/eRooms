import prisma from "@/lib/db";

//mostra prenotazioni
export async function getPrenotazioni() {
    try {
        const prenotazioni = await prisma.prenotazioni.findMany({
            include: {
                Profili_Prenotazioni_codProfiloToProfili: true,
                Stanze: true,
                Ospiti: true,
            },
        });
        return prenotazioni;
    } catch (error) {
        console.error("Errore nel recupero delle prenotazioni:", error);
        throw new Error("Si è verificato un errore nel recupero dei dati.");
    }
}
