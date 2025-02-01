import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BedDouble } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { redirect } from "next/navigation";
import EditAccountForm from "./editAccountForm";


export default async function EditAccountFormm() {

  const { userId } = await auth()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex gap-2 justify-center items-center">
          <div className="flex size-6 bg-primarflex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BedDouble className="size-4" />
          </div>
          <p className="font-bold">e-Rooms</p>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Modifica il tuo Profilo</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <EditAccountForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
