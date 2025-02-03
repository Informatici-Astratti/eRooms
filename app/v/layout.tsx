import NavBar from "@/components/NavBar"
import getUser from "../lib/user"
import FooterWebsite from "@/components/FooterWebsite"
import prisma from "../lib/db"
 
export default async function FrontPageLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  const accountName = {
    nome: user?.nome,
    cognome: user?.cognome
  }

  const propertyInfo = await prisma.proprieta.findFirst()

    if(!propertyInfo){
        throw new Error("C'è stato un errore nel sistema")
    }

  return (
    <main className="h-screen flex flex-col">
        <NavBar propertyInfo={propertyInfo}/>
        {children}
        <FooterWebsite propertyInfo={propertyInfo}/>
    </main>
  )
}