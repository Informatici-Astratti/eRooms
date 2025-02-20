import { auth } from "@clerk/nextjs/server";
import getUser from "./lib/user";
import { redirect } from "next/navigation";
import { ruolo } from "@prisma/client";


export default async function Home() {

  const user = await getUser()

  if (user && (user.ruolo === ruolo.PROPRIETARIO)){
    redirect("/admin/dashboard")
  }

  if (user && (user.ruolo === ruolo.GOVERNANTE)){
    redirect("/admin/pulizie")
  }

  redirect("/v")
  
  
}
