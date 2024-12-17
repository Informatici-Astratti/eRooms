import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
    return(
        <div>
            <h1>Questa è la Dashboard</h1>
            <Button asChild>
                <Link href="#">Logout</Link>
            </Button>
        </div>
    )
}