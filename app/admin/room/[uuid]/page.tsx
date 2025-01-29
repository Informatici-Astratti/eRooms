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
import { getRoom } from "./action";
import { redirect} from "next/navigation"

export default async function EditRooms( {
  params,
}: {
  params: Promise<{ uuid: string }>
} ) {
  
  
  const uuid = (await params).uuid
  
  if (!uuid) { redirect("/dashboard/room") }
  const room = await getRoom(uuid)

  


  return (
    <div className="flex h-full w-full">
      <div className="flex-1 bg-zinc-50 p-4 ml-[285] -mr-[10] rounded-tl-lg rounded-bl-lg border-2 border-zinc-100 shadow-2xl">
        <h1 className="text-2xl font-bold mb-4">Dettaglio Stanza</h1>
        <EditRoomForm room={room} />
      </div>
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
    </div>
  );
}
