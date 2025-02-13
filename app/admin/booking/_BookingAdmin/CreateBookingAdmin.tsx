"use client"

import React, { use, useEffect, useState } from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from '../../../../components/ui/button'
import { BedDouble, CalendarCheck, CalendarFold, CalendarSearch, ChevronLeft, CirclePlus, CircleUserRound, LoaderCircle, ReceiptEuro, Search, SquareArrowOutUpRight, UserCircle2, UserRound, UsersRound } from 'lucide-react'
import { defineStepper } from "@stepperize/react";
import { DateRange } from 'react-day-picker'
import { addDays, differenceInDays, format, formatDate, set } from 'date-fns'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import NumericInput from '@/components/numericInputUI'
import { z } from 'zod'
import ErrorForm from '@/components/ErrorForm'
import { AvailableRooms, BookingData, createBooking, searchAvailableRooms, SearchAvailableRoomsParams } from '@/app/admin/booking/bookingAction'
import ImageCarousel from '@/components/ImageCarousel'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { genere, Profili } from '@prisma/client'
import getUser from '@/app/lib/user'
import { formatEnumValue } from '@/app/lib/formatEnum'
import { useToast } from '@/hooks/use-toast'
import { getClienti } from '../../customers/action'
import { useRouter } from 'next/navigation'


export const BookingStepper = defineStepper(
    {
        id: "step1",
        title: "Seleziona il tuo Soggiorno",
        description: "Seleziona le date del soggiorno e il numero di ospiti",
    },
    {
        id: "step2",
        title: "Risultati della Ricerca",
        description: "Seleziona la stanza tra quelle disponibili",
    },
    {
        id: "step3",
        title: "Seleziona il Cliente",
        description: "Seleziona il cliente che effettuerà la prenotazione dalla lista e confermane i dati",
    },
    {
        id: "step4",
        title: "Conferma Prenotazione",
        description: "Visualizza i dati della prenotazione e conferma",
    },
    {
        id: "step5",
        title: "Prenotazione Confermata",
        description: "La prenotazione è stata salvata correttamente",
    }
)


// Componente Sheet Booking Admin

export default function CreateBookingAdmin() {


    return (

        <BookingStepper.Scoped>

            <Sheet>
                <SheetTrigger asChild>
                    <Button >
                        <CirclePlus />
                        Crea nuova Prenotazione
                    </Button>
                </SheetTrigger>
                <SheetContent className='flex flex-col sm:min-w-fit sm:max-w-[600px] overflow-y-auto'>
                    <SelectDateOspiti />
                    <SelectStanza />
                    <ViewUserData />
                    <ViewBookingData />
                    <ConfirmBooking />
                    <CloseBookingForm />
                </SheetContent>

            </Sheet>
        </BookingStepper.Scoped>

    )
}

// Componente Step 1: Selezione Date e Ospiti

const SelectDateOspiti: React.FC = () => {
    const SelectDatesOspitiSchema = z.object({
        dataInizio: z.date(),
        dataFine: z.date(),
        ospiti: z.number().min(1, { message: "Il minimo di ospiti è 1" }).max(10, { message: "Il numero massimo di ospiti è 10" })
    }).refine((data) => data.dataFine > data.dataInizio, { message: "Le date non sono valide", path: ["dataInizio"] })

    const from = new Date()
    from.setHours(0, 0, 0, 0)

    const [data, setData] = useState<DateRange | undefined>({
        from: from,
        to: addDays(from, 7)
    })

    const [ospiti, setOspiti] = useState<number>(1)

    const [errors, setErrors] = useState<z.inferFlattenedErrors<typeof SelectDatesOspitiSchema>["fieldErrors"]>({})

    const stepper = BookingStepper.useStepper(
        {
            initialMetadata: {
                step1: {
                    dataInizio: new Date(),
                    dataFine: new Date(),
                    ospiti: 1
                },
                step2: {
                    idStanza: "",
                    nomeStanza: "",
                    costoUnitario: 0,
                },
                step3: {
                    idUser: "",
                    nome: "",
                    cognome: "",
                    dataNascita: ""
                }
            }
        }
    )

    const handleSubmit = () => {
        stepper.beforeNext(() => {

            const validatedData = SelectDatesOspitiSchema.safeParse({
                dataInizio: data?.from,
                dataFine: data?.to,
                ospiti: ospiti
            })

            if (!validatedData.success) {
                setErrors(validatedData.error.flatten().fieldErrors)
                return false
            }

            console.log(validatedData.data.dataInizio.toString())

            stepper.setMetadata("step1", {
                ...validatedData.data
            })

            return true
        })
    }

    return stepper.when("step1", step => (
        <React.Fragment>

            <SheetHeader>
                <SheetTitle>{stepper.current.title}</SheetTitle>
                <SheetDescription>
                    {stepper.current.description}
                </SheetDescription>
            </SheetHeader>

            <div className='flex flex-col gap-5'>
                <div className="flex flex-col gap-2 p-4 border rounded-md">
                    <span className='flex gap-2 items-center'>
                        <CalendarSearch className='size-4' />
                        <Label>Seleziona le Date</Label>
                    </span>
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={data?.from}
                        selected={data}
                        onSelect={setData}
                        numberOfMonths={2}
                    />
                    <ErrorForm errors={errors.dataInizio} />
                </div>

                <div className="flex justify-between items-center gap-2 p-4 border rounded-md ">
                    <span className='flex gap-2 items-center'>
                        <UsersRound className='size-4' />
                        <Label>Ospiti: </Label>
                        <ErrorForm errors={errors.ospiti} />
                    </span>

                    <NumericInput name={"ospiti"} defaultValue={ospiti} onValueChange={(value) => setOspiti(value)} />
                </div>


                <SheetFooter>
                    <Button className='w-full' onClick={handleSubmit}>
                        <Search />
                        Ricerca
                    </Button>
                </SheetFooter>


            </div>
        </React.Fragment>
    )
    )

}

// Componente Step 2

const SelectStanza: React.FC = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const stepper = BookingStepper.useStepper()

    const searchParams = stepper.getMetadata("step1") as SearchAvailableRoomsParams

    const [rooms, setRooms] = useState<AvailableRooms[]>([])
    const [selectedRoom, setSelectedRoom] = useState<number>(-1)

    useEffect(() => {
        if (searchParams) {
            searchAvailableRooms(searchParams).then(
                (data) => {
                    if (data) {
                        setRooms(data)
                    }
                }
            )
            setTimeout(() => setIsLoading(false), 500)

        }
    }, [searchParams])



    return stepper.when("step2", step => (
        <React.Fragment>

            <SheetHeader>
                <SheetTitle>
                    <Button className='mr-2' variant={"ghost"} size={"icon"} onClick={() => {
                        stepper.resetMetadata(true);
                        setRooms([])
                        setSelectedRoom(-1)
                        stepper.prev();
                    }}>
                        <ChevronLeft />
                    </Button>
                    {stepper.current.title}
                </SheetTitle>
                <SheetDescription>
                    {stepper.current.description}
                </SheetDescription>
            </SheetHeader>

            <div className='flex flex-col gap-5'>
                {isLoading ? (
                    // Scheletro durante il caricamento
                    <div className='flex flex-col gap-4 animate-pulse'>
                        {[...new Array(3)].map((_, index) => (
                            <div key={index} className='w-full p-4 border rounded-md flex items-center gap-4'>
                                <div className='basis-1/2 aspect-video bg-gray-300' />
                                <div className='basis-1/2 space-y-2'>
                                    <div className='h-6 bg-gray-300 rounded w-3/4' />
                                    <div className='h-4 bg-gray-300 rounded w-1/2' />
                                    <div className='h-4 bg-gray-300 rounded w-1/3' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : rooms.length > 0 ? (
                    rooms.map((room, index) => (
                        <div key={room.idStanza} className='w-full p-4 border rounded-md flex items-center gap-4'>
                            <div className='basis-1/2 aspect-video'>
                                <ImageCarousel images={room.fotoUrls} height={200} />
                            </div>
                            <div className='basis-1/2 min-w-fit'>
                                <div className='flex flex-col gap-4'>
                                    <div>
                                        <p className='font-semibold text-lg'>{room.nome}</p>
                                        <span className='text-sm flex gap-2 items-center'>
                                            <CircleUserRound className='size-5' />
                                            {room.capienza} max
                                        </span>
                                    </div>
                                    <p className='text-muted-foreground'>Prezzo: </p>
                                    {searchParams && (
                                        <>
                                            <p>{`${searchParams.ospiti * room.costoEffettivo * differenceInDays(searchParams.dataFine, searchParams.dataInizio)} € totale`}</p>
                                            <p className='text-sm font-thin'>{`${room.costoEffettivo} €/giorno a persona`}</p>
                                        </>
                                    )}
                                    {
                                        selectedRoom !== -1 && rooms[selectedRoom].idStanza === room.idStanza ?
                                            (<Button variant={"default"} onClick={() => { }}>Selezionato</Button>)
                                            :
                                            (<Button variant={"outline"} onClick={() => setSelectedRoom(index)}>Seleziona</Button>)
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-center'>Nessuna stanza è disponibile</p>
                )}

                {selectedRoom !== -1 && <Button onClick={() => {

                    stepper.beforeNext(() => {
                        stepper.setMetadata("step2", {
                            idStanza: rooms[selectedRoom].idStanza,
                            nomeStanza: rooms[selectedRoom].nome,
                            costoUnitario: rooms[selectedRoom].costoEffettivo
                        })

                        return true;
                    })
                }}>Avanti</Button>}


            </div>
        </React.Fragment>
    )
    )
}

// Componente Step 3

const ViewUserData: React.FC = () => {

    const stepper = BookingStepper.useStepper()

    const { toast } = useToast()

    const [userList, setUserList] = useState<Profili[]>([])
    const [user, setUser] = useState<Profili>()

    useEffect(() => {
        getClienti().then(data => {
            if (!data) {
                toast({
                    title: "Errore",
                    description: "Si è verificato un errore nel caricamento dei profili",
                    variant: "destructive"
                })
                return
            }
            setUserList(data)
        })
    }, [])

    return stepper.when("step3", () => (
        <React.Fragment>
            <SheetHeader>
                <SheetTitle>{stepper.current.title}</SheetTitle>
                <SheetDescription>
                    {stepper.current.description}
                </SheetDescription>
            </SheetHeader>

            {userList.length <= 0 ?
                (
                    <div className='flex flex-col gap-4 animate-pulse'>
                        {[...new Array(3)].map((_, index) => (
                            <div key={index} className='w-full p-4 border rounded-md flex items-center gap-4'>
                                <div className='basis-1/2 aspect-video bg-gray-300' />
                                <div className='basis-1/2 space-y-2'>
                                    <div className='h-6 bg-gray-300 rounded w-3/4' />
                                    <div className='h-4 bg-gray-300 rounded w-1/2' />
                                    <div className='h-4 bg-gray-300 rounded w-1/3' />
                                </div>
                            </div>
                        ))}
                    </div>
                )
                :
                (
                    <div className='flex items-center gap-3'>
                        <Label>Seleziona il Cliente</Label>
                        <Select onValueChange={(value) => setUser(userList.find(user => user.idProfilo === value))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleziona un Cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {userList.map((user) => (
                                        <SelectItem key={user.idProfilo} value={user.idProfilo}>
                                            {user.nome} {user.cognome}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            {user && (
                <>
                    <div className='p-4 border rounded-md flex flex-col gap-3 w-full'>
                        <div className='flex gap-3'>
                            <div className='basis-1/2 flex flex-col gap-2'>
                                <Label>Nome</Label>
                                <Input disabled value={user?.nome} />
                            </div>
                            <div className='basis-1/2 flex flex-col gap-2'>
                                <Label>Cognome</Label>
                                <Input disabled value={user?.cognome} />
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label>Data di Nascita</Label>
                            <Input disabled value={user?.dataNascita ? format(user?.dataNascita ?? "", "dd/MM/yyyy") : "Non definito"} />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label>Telefono</Label>
                            <Input disabled value={user?.telefono ?? "Nessun numero indicato"} />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label>Genere</Label>
                            <Input disabled value={formatEnumValue(user?.genere ?? genere.NS)} />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label>Codice Fiscale/P.IVA</Label>
                            <Input disabled value={user?.cf ?? user?.piva ?? "Non specificato"} />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label>Indirizzo</Label>
                            <Input disabled value={user?.indirizzo ?? "Non specificato"} />
                        </div>


                    </div>


                    <SheetFooter>
                        <Button className='w-full' onClick={() => {
                            stepper.beforeNext(() => {
                                stepper.setMetadata("step3", {
                                    userId: user?.idProfilo,
                                    nome: user?.nome,
                                    cognome: user?.cognome,
                                    dataNascita: user?.dataNascita
                                })

                                return true;
                            })
                        }}>
                            Conferma
                        </Button>
                    </SheetFooter>
                </>
            )}

        </React.Fragment>
    ))
}

// Componente Step 4



const ViewBookingData: React.FC = () => {
    const stepper = BookingStepper.useStepper()
    const bookingData: BookingData = { ...stepper.getMetadata("step1"), ...stepper.getMetadata("step2"), ...stepper.getMetadata("step3") } as BookingData
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState<boolean>(false)


    return stepper.when("step4", () => (
        <React.Fragment>
            <SheetHeader>
                <SheetTitle>{stepper.current.title}</SheetTitle>
                <SheetDescription>
                    {stepper.current.description}
                </SheetDescription>
            </SheetHeader>

            <div className='p-4 border rounded-md flex flex-col gap-3 w-full'>
                <h1>Riepilogo Prenotazione: </h1>
                <div className='flex gap-3'>
                    <CalendarFold />
                    <div className='basis-1/2 flex flex-col gap-2'>
                        <Label>Check-in</Label>
                        <p>{format(bookingData.dataInizio, "dd/MM/yyyy")}</p>
                    </div>
                    <div className='basis-1/2 flex flex-col gap-2'>
                        <Label>Check-out</Label>
                        <p>{format(bookingData.dataFine, "dd/MM/yyyy")}</p>
                    </div>
                </div>

                <div className='flex gap-3'>
                    <UserCircle2 />
                    <p><span className='font-medium'>Ospiti: </span>{bookingData.ospiti}</p>
                </div>

                <div className='flex gap-3'>
                    <BedDouble />
                    <p><span className='font-medium'>Stanza: </span>{bookingData.nomeStanza}</p>
                </div>

                <div className='flex gap-3'>
                    <ReceiptEuro />
                    <p><span className='font-medium'>Totale: </span>{`${bookingData.ospiti * bookingData.costoUnitario * differenceInDays(bookingData.dataFine, bookingData.dataInizio)} €`}</p>
                </div>

                <div className='flex gap-3'>
                    <span className='flex gap-2 items-center font-medium'>
                        <UserRound />
                        Cliente:
                    </span>
                    <div className='basis-1/3 flex flex-col gap-2'>
                        <Label>Nome</Label>
                        <p>{bookingData.nome}</p>
                    </div>
                    <div className='basis-1/3 flex flex-col gap-2'>
                        <Label>Cognome</Label>
                        <p>{bookingData.cognome}</p>
                    </div>
                    <div className='basis-1/3 flex flex-col gap-2'>
                        <Label>Data di Nascita</Label>
                        <p>{format(bookingData.dataNascita, "dd/MM/yyyy")}</p>
                    </div>

                </div>


            </div>


            <SheetFooter>
                <Button className='w-full' onClick={() => {
                    stepper.beforeNext(async () => {

                        setIsLoading(true)

                        const res = await createBooking({
                            userId: bookingData.userId,
                            idStanza: bookingData.idStanza,
                            dataInizio: bookingData.dataInizio,
                            dataFine: bookingData.dataFine,
                            ospiti: bookingData.ospiti,
                            costoUnitario: bookingData.costoUnitario,
                        })

                        setIsLoading(false)

                        if (!res) {
                            toast({
                                title: "Errore",
                                description: "C'è stato un'errore nella prenotazione",
                                variant: "destructive"
                            })
                            return false
                        }
                        return true;
                    })
                }}>
                    {isLoading ? (<><LoaderCircle className='animate-spin'/> Caricamento...</>) : "Conferma"}
                </Button>
            </SheetFooter>

        </React.Fragment>
    ))
}

// Componente Step 5
const ConfirmBooking: React.FC = () => {
    const stepper = BookingStepper.useStepper()
    return stepper.when("step5", () => (
        <React.Fragment>
            <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription>
                </SheetDescription>
            </SheetHeader>
            <div className='p-4 rounded-md border flex flex-col gap-4 justify-center items-center h-full'>

                <CalendarCheck className='size-10' />
                <h1 className='font-bold text-2xl'>Prenotazione Confermata</h1>
                <p>Per vedere tutte le prenotazioni clicca sul pulsante{":"} </p>

            </div>
        </React.Fragment>
    ))
}

const CloseBookingForm: React.FC = () => {
    const stepper = BookingStepper.useStepper()
    const router = useRouter()

    return !stepper.isLast ? (
        <SheetClose asChild>
            <Button variant={"destructive"} onClick={() => { stepper.resetMetadata(true); stepper.reset() }}>
                Annulla
            </Button>
        </SheetClose>
    ) : (
        <SheetClose asChild>
            <Button onClick={() => { stepper.resetMetadata(true); stepper.reset();  router.refresh() }}>
                Chiudi
            </Button>
        </SheetClose>
    )
}


