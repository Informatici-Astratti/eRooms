import { Input } from "@/components/ui/input";
import { getAccountProfile, getUserClerk } from "./action";
import EditAccountForm from "./editAccountForm";
import { Label } from "@/components/ui/label";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailDialog } from "./emailDialog";


export default async function MyProfile() {
    
    const userProfile = await getAccountProfile()
    const userClerk = await getUserClerk()

    return (
        <div className="p-5 w-full">
            <div className="mb-4 flex flex-col  ">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold">Il mio Profilo</h1>
                            
                </div>
            </div>
        
            <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 space-y-5">
                        <h1 className="text-xl font-bold">Informazioni Generali</h1>
                        <EditAccountForm profile={userProfile ?? null} ></EditAccountForm>
                    </div>
                </div>  
            </div>
        </div>
    )
}