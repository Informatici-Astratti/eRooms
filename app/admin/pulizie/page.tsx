import { Suspense } from "react"
import { getPulizie } from "./action"
import { columns } from "./columns"
import { DataTable } from "./data-table"


export default async function DemoPage() {
  const data = await getPulizie()

  return (
    <div className="p-4 w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Pulizie</h1>
          </div>
          <DataTable columns={columns} data={data as any[]} />
        </div>
      </Suspense>
    </div>
  )
}

