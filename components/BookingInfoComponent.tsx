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
            Pagamenti: true,
            Ospiti: true,
            Stanze: true
        }
    })

    if(!bookingInfo){
        redirect('/account/mybookings')
    }


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

                <div className='py-8 px-4 border rounded-md flex justify-around items-center gap-2 *:items-center'>
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
                    <div className='flex gap-2'>
                        <Button disabled={!(bookingInfo.stato === stato_prenotazione.PRENOTATA)}>Paga</Button>
                    </div>
                </div>

                <div className='py-4 border rounded-md flex flex-col'>
                    <div className='flex items-center justify-between border-b px-8 pb-4 '>
                        <p className='text-lg font-semibold'>{`CAMERA (${bookingInfo?.Stanze.capienza}) ${bookingInfo?.Stanze.nome}`}</p>

                        <div className='flex gap-2'>
                            {user.ruolo === ruolo.PROPRIETARIO && <UpdateAvaiableRoom disabled={!(bookingInfo.stato === stato_prenotazione.PRENOTATA)} idPrenotazione={bookingInfo?.idPrenotazione} dataInizio={bookingInfo?.dataInizio} dataFine={bookingInfo?.dataFine} ospiti={bookingInfo?.Ospiti.length} />}
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
