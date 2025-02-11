import prisma from "@/app/lib/db";

export async function getPayments() {
  const payments = await prisma.pagamenti.findMany({
    include: {
      Prenotazioni: {
        select: {
          idPrenotazione: true,
          stato: true,
          Profili_Prenotazioni_codProfiloToProfili: {
            select: {
              nome: true,
              cognome: true,
            },
          },
        },
      },
    },
  });

  return payments;
}