import { formatEnumValue } from "@/app/lib/formatEnum"
import { stato_prenotazione } from "@prisma/client"
import { Badge } from "./ui/badge"
import React from "react"

export interface BadgeStatoPrenotazioneProps {
    stato?: stato_prenotazione
}

export default function BadgeStatoPrenotazione({ stato }: BadgeStatoPrenotazioneProps) {

    const variant = () => {
        switch (stato) {
            case stato_prenotazione.PRENOTATA:
                return "attesa"
            case stato_prenotazione.CONFERMATA:
                return "success"
            case stato_prenotazione.ANNULLATA_HOST:
            case stato_prenotazione.ANNULLATA_UTENTE:
                return "destructive"
            default:
                return "outline"
        }
    }

    return stato && (

        <Badge variant={variant()}>
            {formatEnumValue(stato).toUpperCase()}
        </Badge>
    )
}