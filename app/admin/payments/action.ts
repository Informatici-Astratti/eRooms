import prisma from "@/app/lib/db";

export async function getPayments() {
    const payments = await prisma.pagamenti.findMany({
      where: {
          Prenotazioni: {
              stato: {
                  in: ["PRENOTATA", "CONFERMATA"]
              }
          }
      },
      include: {
        Prenotazioni: {
          include: {
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