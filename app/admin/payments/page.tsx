import { Suspense } from "react";
//import { DataTable } from "@/app/admin/customers/data-table"  //SE SI POTEVA USARE LA STESSA (SPOILER NO) MA V0 MI HA FATTO UN VERSIONE CHE DOVREBBE FUNZIONARE
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getPayments } from "./action";

export default async function PaymentView() {
  const payments = await getPayments();
  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="p-10">
        <DataTable columns={columns} data={payments} />
        </div>
      </Suspense>
    </div>
  );
}
