import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "../(auth)/action";

export default function DashboardPage() {
    return(
        <div>
            <h1>Questa è la Dashboard</h1>
            <Button onClick={logout}>Logout</Button>
        </div>
    )
}