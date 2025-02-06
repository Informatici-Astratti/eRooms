"use client"

import { BedDouble } from 'lucide-react'
import React from 'react'

interface ErrorPageProps{
    error: Error
}

export default function ErrorPage({error} : ErrorPageProps) {
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
        <div className='flex flex-col border rounded-md p-4'>
            <div className="flex gap-2 justify-center items-center py-5 text-4xl">
                <div className="flex size-6 bg-primarflex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <BedDouble className="size-4" />
                </div>
                <p className="font-bold">e-Rooms</p>
            </div>
            <h1 className='font-bold text-2xl'>Errore</h1>
            <p className='text-lg'>{error.message}</p>
        </div>

    </div>
  )
}
