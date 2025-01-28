"use client"

import { NOMEM } from "dns";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { CirclePlus } from "lucide-react";

export default function RoomsList() {


  const handleAddRoom = () => {
    redirect('/dashboard/room/new')
  }

  return (
    <div className="mb-4">
      <Button onClick={handleAddRoom}><CirclePlus className="-ml-2" />Crea nuova Stanza</Button>
      
    </div>
  );
}
