import { Suspense } from "react"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { getProfili } from "./action"



export default async function Clients() {
  const profiles = await getProfili()
  return (
    <div className="">
      
        <Suspense fallback={<div>Loading...</div>}>
            <div className="p-10">
          <DataTable columns={columns} data={profiles} />
          </div>
        </Suspense>
      
    </div>
  )
}



