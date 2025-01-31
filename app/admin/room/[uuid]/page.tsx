import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditRoomForm from "./editRoomForm";
import EditTariffaForm from "../EditTariffaForm";
import { redirect} from "next/navigation"
import { getRoomById } from "../action";
import { Stanze } from "@prisma/client";

export default async function EditRooms( {
  params,
}: {
  params: Promise<{ uuid: string }>
} ) {
  
  
  const uuid = (await params).uuid
  if (!uuid) { redirect("/dashboard/room") }
  const room = uuid !== "new" ? await getRoomById(uuid) : null

  return (
    <div className="p-5 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold mb-4">{room ? room.nome : "Aggiungi Nuova Stanza"}</h1>
        <EditRoomForm room={room} />
        
      </div>
      {/*
      <div className="w-[500px] bg-zinc-100 p-4 mr-[25] rounded-tr-lg rounded-br-lg rounded-tl-lg rounded-bl-lg border shadow-xl">
        <div className="grid justify-items-center">
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <Label className="ml-[50]" htmlFor="picture">
          Inserimento Foto
        </Label>
        <div className="grid justify-items-center bg-zinc-100 border border-black rounded ml-[50] mr-[50]">
          <Input id="picture" type="file" />
        </div>
      </div>
      */}
    </div>
  );
}
