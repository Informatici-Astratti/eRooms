import { Suspense } from "react"
import { getPrenotazioni } from "./action"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CirclePlus } from "lucide-react"
import { CreateReservationSheet } from "./create-reservation"



export default async function DemoPage() {
  const data = await getPrenotazioni()

  return (
    <div className="p-4 w-full">
      
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Prenotazioni</h1>
          <CreateReservationSheet></CreateReservationSheet>
        </div>
            <DataTable columns={columns} data={data} />
          </div>
        </Suspense>
      
    </div>
  )
}
