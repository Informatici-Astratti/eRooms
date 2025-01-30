import EditPropertyForm from "./EditpropertyForm";



export default async function GeneralInfo() {

    return (
        <div className="p-5 w-full">
            <div className="mb-4 flex flex-col  ">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold">La tua Proprietà</h1>
                    
                </div>
            </div>

            <div className="flex flex-col">
                <EditPropertyForm></EditPropertyForm>   
                     
            </div>
        </div>
    )
}