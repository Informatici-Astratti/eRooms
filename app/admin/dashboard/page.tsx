import { getStatistics } from "./action";
import Dashboard from "./dashboard";

export default async function getInformazioni(){
    const info = await getStatistics()
    return(
        <Dashboard initialStats={info} />
    );
}