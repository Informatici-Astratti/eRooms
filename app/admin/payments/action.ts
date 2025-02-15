"use server";

import prisma from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import { tipo_pagamento } from "@prisma/client";
import { z, ZodFormattedError } from "zod";

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

const addPaymentSchema = z.object({
  codPrenotazione: z.string(),
  tipoPagamento: z.nativeEnum(tipo_pagamento, { message: "Tipo di pagamento non valido" }),
  importo: z.number().min(0.01, { message: "Importo non valido" }),
  nome: z.string().min(1, { message: "Nome non valido" }),
  descrizione: z.string().min(1, { message: "Descrizione non valida" })
});

export interface AddPaymentFormResponse {
  success: boolean;
  message: string;
  errors?: z.inferFormattedError<typeof addPaymentSchema> | null;
  fields?: z.infer<typeof addPaymentSchema> | null;
}

export async function addPayment(prevState: AddPaymentFormResponse, formData: FormData): Promise<AddPaymentFormResponse> {

  const data = {
    codPrenotazione: formData.get("codPrenotazione") as string,
    tipoPagamento: formData.get("tipoPagamento") as tipo_pagamento,
    importo: parseFloat(formData.get("importo") as string),
    nome: formData.get("nome") as string,
    descrizione: formData.get("descrizione") as string,
  }

  console.log(data);

  const validatedData = addPaymentSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Errore di validazione",
      errors: validatedData.error.format(),
      fields: data,
    };
  }

  try {

    const userId = await prisma.prenotazioni.findUnique({
      select: {
        codProfilo: true
      },
      where: {
        idPrenotazione: validatedData.data.codPrenotazione
      }
    })

    if (!userId) {
      return {
        success: false,
        message: "Prenotazione non trovata",
      };
    }

    const stripeCustomerId = await prisma.profili.findUnique({
      select: {
        stripeCustomerId: true
      },
      where: {
        idProfilo: userId.codProfilo
      }
    })

    if (!stripeCustomerId) {
      return {
        success: false,
        message: "Utente non trovato",
      };
    }

    const paymentIntent = await stripe.checkout.sessions.create({
      customer: stripeCustomerId?.stripeCustomerId as string,
      line_items: [
          {
              price_data: {
                  currency: "EUR",
                  product_data: {
                      name: validatedData.data.nome,
                      description: validatedData.data.descrizione,
                  },
                  unit_amount: validatedData.data.importo * 100,
              },
              quantity: 1,
          }
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/mybookings/${validatedData.data.codPrenotazione}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/mybookings/${validatedData.data.codPrenotazione}`
    })

    const payment = await prisma.pagamenti.create({
      data: {
        ...validatedData.data,
        stripePaymentId: paymentIntent.id,
      }
    });

    return {
      success: true,
      message: "Pagamento creato con successo",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Errore durante la creazione del pagamento",
    };
  }

}