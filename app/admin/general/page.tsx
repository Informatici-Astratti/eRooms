import getProperty from "./action";
import EditPropertyForm from "./EditpropertyForm";



export default async function GeneralInfo() {

    const property = await getProperty()

    return (
        <div className="p-5 w-full">
            <div className="mb-4 flex flex-col  ">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold">La tua Proprietà</h1>
                    
                </div>
            </div>

            <div className="flex flex-col">
                <EditPropertyForm property={property ?? null} ></EditPropertyForm>   
                     
            </div>
        </div>
    )
}