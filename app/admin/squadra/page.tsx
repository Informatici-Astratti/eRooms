import { Suspense } from "react"
import { getUsers } from "./action"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { AggiungiMembro } from "./addSquadra"

export default async function DemoPage() {
  const users = await getUsers()


  return (
    <div className="p-4 w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Squadra</h1>
            <AggiungiMembro />
          </div>
          <DataTable columns={columns} data={users} />
        </div>
      </Suspense>
    </div>
  )
}

