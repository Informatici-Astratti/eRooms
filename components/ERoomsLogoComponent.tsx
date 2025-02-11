import { BedDouble } from 'lucide-react'
import React from 'react'

export default function ERoomsLogoComponent() {
    return (
        <div className="flex gap-2 justify-center items-center py-5">
            <div className="flex size-6 bg-primarflex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BedDouble className="size-4" />
            </div>
            <p className="font-bold">e-Rooms</p>
        </div>
    )
}
