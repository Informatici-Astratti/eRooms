import { auth } from "@clerk/nextjs/server";
import prisma from "./db";

export default async function getUser(){
    const { userId } = await auth()

    if (!userId) return null;

    const user = await prisma.profili.findUnique({
        where: { idProfilo: userId}
    })

    if (!user) return null

    return user
}