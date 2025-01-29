import { getPrenotazioni } from "./action"
import { columns } from "./columns"
import { DataTable } from "./data-table"



export default async function DemoPage() {
  const data = await getPrenotazioni()

  return (
    <div className="container mx-auto py-10 ">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
