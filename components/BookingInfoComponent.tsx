import React from 'react'
import { ruolo, stato_prenotazione } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { CalendarX, CircleUserRound, Pencil, PlaneLanding, PlaneTakeoff } from 'lucide-react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UpdateAvaiableRoom from '@/components/UpdateAvaiableRoom'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/app/lib/db'
import AddGuestIDsForm from '@/components/AddGuestIDsForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import { formatEnumValue } from '@/app/lib/formatEnum'
import AnnullaPrenotazioneDialog from '@/components/AnnullaPrenotazioneDialog'
import { redirect } from 'next/navigation'
import BadgeStatoPrenotazione from '@/components/BadgeStatoPrenotazione'
import getUser from '@/app/lib/user'
import { format } from 'date-fns'
import Link from 'next/link'
import { stripe } from '@/app/lib/stripe'
import AddAdminPaymentForm from './AddAdminPaymentForm'
import { Separator } from './ui/separator'

interface BookingInfoComponentProps{
    idPrenotazione: string
}

export default async function BookingInfoComponent({ idPrenotazione }: BookingInfoComponentProps) {
    const user = await getUser()

    if (!user) {
        redirect ("/")
    }

    if (user.ruolo !== ruolo.PROPRIETARIO) {
        const checkUser = await prisma.prenotazioni.findUnique({
            where: {
                idPrenotazione: idPrenotazione,
                codProfilo: user.idProfilo
            }
        })
    
        if (!checkUser) {
            redirect ("/account/mybookings")
        }
    }

    const bookingInfo = await prisma.prenotazioni.findUnique({
        where: { idPrenotazione: idPrenotazione },
        include: {
            Pagamenti: {
                orderBy: {
                    created_at: 'asc'
                }
            },
            Ospiti: true,
            Stanze: true
        }
    })

    if (!bookingInfo) {
        redirect('/account/mybookings')
    }

    const paymentUrlList = await Promise.all(
        bookingInfo.Pagamenti.map(async (pagamento) => {
            if (pagamento.stripePaymentId) {
                const session = await stripe.checkout.sessions.retrieve(pagamento.stripePaymentId)
                return session.url || ""
            }
            return ""
        })
    )

    return (
        <div className='p-5 w-full'>
            <div className='flex flex-col gap-4 [&>div]:bg-white'> 
                <h1 className='text-4xl font-bold mb-4 bg-transparent'>Informazioni sulla Prenotazione</h1>
                <div className='p-4 border rounded-md flex flex-col gap-2'>
                    <p>{`Rif: ${bookingInfo?.idPrenotazione}`}</p>

                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <p>{"Stato: "}</p>
                            <BadgeStatoPrenotazione stato={bookingInfo?.stato} />
                        </div>
                        
                        {bookingInfo?.stato === stato_prenotazione.PRENOTATA && <AnnullaPrenotazioneDialog idPrenotazione={bookingInfo?.idPrenotazione} />}
                    </div>
                </div>

                <div className='py-8 px-4 border rounded-md flex flex-col gap-4'>
                    <div className='flex justify-around items-center gap-2 *:items-center'>
                        <div className='flex flex-col gap-2'>
                            <p className='text-2xl font-bold'>{`${bookingInfo.Pagamenti.reduce((acc, pagamento) => acc + pagamento.importo, 0).toFixed(2)} €`}</p>
                            <p>Totale Importo</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='text-2xl font-bold'>{`${bookingInfo.Pagamenti.filter(pagamento => pagamento.dataSaldo === null).reduce((acc, pagamento) => acc + pagamento.importo, 0).toFixed(2)} €`}</p>
                            <p>Importo Dovuto</p>
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <p className='text-2xl font-bold'>{`${bookingInfo.Pagamenti.filter(pagamento => pagamento.dataSaldo !== null).reduce((acc, pagamento) => acc + pagamento.importo, 0).toFixed(2)} €`}</p>
                            <p>Importo Pagato</p>
                        </div>
                        { user.ruolo === ruolo.PROPRIETARIO &&
                            <div className='flex gap-2'>
                                <AddAdminPaymentForm codPrenotazione={idPrenotazione} />
                            </div>
                        }
                    </div>
                    <Separator />
                    <div className='flex flex-col gap-2 px-4'>
                        <h3 className='text-md font-semibold'>Riassunto</h3>

                        {
                            bookingInfo?.Pagamenti.map((pagamento, i) => (
                                <React.Fragment key={pagamento.idPagamento}>
                                    <div className="flex flex-row w-full h-fit gap-4 items-center">
                                        <div className='basis-2/5'>
                                            <p className="font-semibold">{pagamento.nome}</p>
                                            <p className="text-sm text-muted-foreground text-wrap break-words line-clamp-2">
                                                {pagamento.descrizione}
                                            </p>
                                        </div>


                                        <div className="self-stretch my-2">
                                            <Separator orientation="vertical" />
                                        </div>


                                        <div className='basis-1/5 flex items-center justify-center'>
                                            <p>€ {pagamento.importo.toFixed(2)}</p>
                                        </div>

                                        <div className="self-stretch my-2">
                                            <Separator orientation="vertical" />
                                        </div>

                                        <div className='basis-1/5 flex flex-col gap-1 items-center justify-center'>
                                            {pagamento.dataSaldo ? (<Badge variant={"success"}>Pagato</Badge>) : (<Badge variant={"destructive"}>Non Pagato</Badge>)}
                                            {pagamento.dataSaldo && <p className='text-sm'>{format(pagamento.dataSaldo, "dd/MM/yyyy")}</p>}
                                        </div>
                                        { user.ruolo === ruolo.CLIENTE && <>
                                        <div className="self-stretch my-2">
                                            <Separator orientation="vertical" />
                                        </div>
                                        <div className='basis-1/5 flex items-center justify-center'>
                                            {
                                                pagamento.dataSaldo ?
                                                (
                                                    <Button disabled>Pagato</Button>
                                                ) : (
                                                    <Button asChild>
                                                        <Link href={paymentUrlList[i]}>Paga</Link>
                                                    </Button>
                                                )
                                            }
                                        </div>
                                        </>}
                                    </div>

                                    {i < bookingInfo.Pagamenti.length-1 && <Separator />}
                                </React.Fragment>
                            ))
                        }
                    </div>
                    
                </div>

                <div className='py-4 border rounded-md flex flex-col'>
                    <div className='flex items-center justify-between border-b px-8 pb-4 '>
                        <p className='text-lg font-semibold'>{`CAMERA (${bookingInfo?.Stanze.capienza}) ${bookingInfo?.Stanze.nome}`}</p>

                        <div className='flex gap-2'>
                            {user.ruolo === ruolo.PROPRIETARIO && <UpdateAvaiableRoom idPrenotazione={bookingInfo?.idPrenotazione} dataInizio={bookingInfo?.dataInizio} dataFine={bookingInfo?.dataFine} ospiti={bookingInfo?.Ospiti.length} />}
                        </div>
                    </div>

                    
                    <div className='flex flex-col gap-3 px-8 pt-4'>
                        <span className='flex items-center gap-2'>
                            <CircleUserRound />
                            <p>{`Ospiti: ${bookingInfo?.Ospiti.length}`}</p>
                        </span>

                        <span className='flex items-center gap-2'>
                            <PlaneLanding />
                            <p className='capitalize'>{`Arrivo: ${bookingInfo?.dataInizio.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}</p>
                        </span>

                        <span className='flex items-center gap-2'>
                            <PlaneTakeoff />
                            <p className='capitalize'>{`Partenza: ${bookingInfo?.dataFine.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}</p>
                        </span>
                    </div>
                </div>
                    { !(bookingInfo?.stato === stato_prenotazione.ANNULLATA_HOST || bookingInfo?.stato === stato_prenotazione.ANNULLATA_UTENTE) &&
                    <div className='py-4 border rounded-md flex flex-col'>
                        <div className='flex items-center justify-between border-b px-8 pb-4 '>
                            <p className='font-semibold text-lg'>Documentazione</p>
                            <div className='flex gap-2'>
                            {bookingInfo?.Ospiti.every(ospite => ospite.idDocumento !== null) ? null : (
                                <AddGuestIDsForm idPrenotazione={idPrenotazione} disabled={bookingInfo.stato !== stato_prenotazione.CONFERMATA}/>
                            )}
                            </div>
                        </div>

                        <div className='px-8 pt-4'>
                            {bookingInfo?.Ospiti.every(ospite => ospite.idDocumento === null) ?
                                (
                                    <p>Carica i dati degli ospiti relativi alla prenotazione</p>
                                ) : (
                                    <div>
                                        <Tabs defaultValue={bookingInfo.Ospiti.at(0)?.idOspite} className="w-full">
                                            <TabsList>
                                                {bookingInfo?.Ospiti.map((ospite, i) => (
                                                    <TabsTrigger key={ospite.idOspite} value={ospite.idOspite}>{`Ospite ${i + 1}`}</TabsTrigger>
                                                ))}
                                            </TabsList>
                                            {bookingInfo?.Ospiti.map((ospite, i) => (
                                                <TabsContent key={ospite.idOspite} value={ospite.idOspite} className='w-full'>
                                                    <div className='flex justify-between border rounded-md p-4 '>
                                                        <div className='flex flex-col gap-2'>
                                                            <p className='font-semibold'>Generalità</p>
                                                            <p><span className='font-semibold'>{`Nome: `}</span> {ospite.nome}</p>
                                                            <p><span className='font-semibold'>{`Cognome: `}</span>{ospite.cognome}</p>
                                                            <p><span className='font-semibold'>{`CF: `}</span>{ospite.cf}</p>
                                                        </div>
                                                        <div className='flex flex-col gap-2'>
                                                            <p className='font-semibold'>Documento</p>
                                                            <p><span className='font-semibold'>{`Tipo: `}</span>{formatEnumValue(ospite.tipoDocumento ?? "")}</p>
                                                            <p><span className='font-semibold'>{`Numero: `}</span>{ospite.idDocumento}</p>
                                                            <div className='flex gap-2'>
                                                                <p><span className='font-semibold'>{`Data Rilascio: `}</span>{format(ospite.dataRilascio ?? "", "dd/MM/yyyy")}</p>
                                                                <p><span className='font-semibold'>{`Data Scadenza: `}</span>{format(ospite.dataScadenza ?? "", "dd/MM/yyyy")}</p>

                                                            </div>

                                                        </div>

                                                    </div>
                                                </TabsContent>
                                            ))}
                                        </Tabs>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    }   
            </div>
        </div>
    )
}
