import { Suspense } from "react"
import { getUsers } from "./action"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { AggiungiMembro } from "./addSquadra"

export default async function DemoPage() {
  const { users } = await getUsers()

  const combinedData = users.map((user) => ({
    ...user,
    email: user.email || "N/A",
  }))

  return (
    <div className="p-4 w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Squadra</h1>
            <AggiungiMembro />
          </div>
          <DataTable columns={columns} data={combinedData} />
        </div>
      </Suspense>
    </div>
  )
}

