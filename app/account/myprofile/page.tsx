import { getAccountProfile } from "./action";
import EditAccountForm from "./editAccountForm";


export default async function MyProfile() {
    
    const userProfile = await getAccountProfile()

    return (
        <div className="p-5 w-full">
            <div className="mb-4 flex flex-col  ">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold">Il mio Profilo</h1>
                            
                </div>
            </div>
        
            <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4">
                        <EditAccountForm profile={userProfile ?? null} ></EditAccountForm>
                    </div>
                </div>  
            </div>
        </div>
    )
}