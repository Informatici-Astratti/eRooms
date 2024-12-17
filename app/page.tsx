import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Questa è la HomePage</h1>
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    </div>
    
  );
}
