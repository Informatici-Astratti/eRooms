import { Suspense } from "react"
import { getPrenotazioni } from "./bookingAction"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import CreateBookingAdmin from "./_BookingAdmin/CreateBookingAdmin"



export default async function DemoPage() {
  const data = await getPrenotazioni()

  return (
    <div className="p-4 w-full">
      
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Prenotazioni</h1>
          <CreateBookingAdmin />
        </div>
            <DataTable columns={columns} data={data} />
          </div>
        </Suspense>
      
    </div>
  )
}
