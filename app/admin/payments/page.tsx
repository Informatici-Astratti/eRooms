import { Suspense } from "react";
//import { DataTable } from "@/app/admin/customers/data-table"  //SE SI POTEVA USARE LA STESSA (SPOILER NO) MA V0 MI HA FATTO UN VERSIONE CHE DOVREBBE FUNZIONARE
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getPayments } from "./action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CirclePlus } from "lucide-react";


export default async function PaymentView() {
  const payments = await getPayments();
  return (
    <div className="p-4 w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Fatturazioni</h1>
            <Button asChild>
              <Link href={"/admin/payments/new"}>
                <CirclePlus />
                <p>Crea un nuovo Pagamento</p>
              </Link>
            </Button>
          </div>
          <DataTable columns={columns} data={payments} />
        </div>
      </Suspense>
    </div>
  );
}
