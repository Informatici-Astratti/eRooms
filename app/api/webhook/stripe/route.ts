import prisma from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import { stato_prenotazione } from "@prisma/client";
import { headers } from "next/headers"
import Stripe from "stripe";

export async function POST (req: Request) {
    const body = await req.text();

    const headerList = await headers();

    const signature = headerList.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err) {
        return new Response("Webhook error", {status: 400});
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const payment = await prisma.pagamenti.update({
            where: {
                stripePaymentId: session.id
            },
            data:{
                dataSaldo: new Date().toISOString(),
            }
        })

        if(!payment){
            return new Response("Errore durante l'aggiornamento del pagamento", {status: 500})
        }

        await prisma.prenotazioni.update({
            where: {
                idPrenotazione: payment.codPrenotazione
            },
            data: {
                stato: stato_prenotazione.CONFERMATA 
            }
        })  

    }

    return new Response("ok", {status: 200});


}