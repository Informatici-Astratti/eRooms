import RoomCard from "@/components/roomCardUI";
import { Suspense } from "react";
import RoomsList from "./roomsList";
import { Skeleton } from "@/components/ui/skeleton";
import getRoomsList from "./action";

export default async function Rooms() {

const rooms = await getRoomsList();

  return (
    <div className="flex w-screen">
      <div className="w-full m-5 bg-zinc-100 rounded-xl border-2 border-zinc-100 shadow-2xl">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Lista Stanze</h1>
          <Suspense fallback={<RoomListSkeleton />}>
            <RoomsList></RoomsList>
            <div className="space-y-4">
                    {rooms.map((room) => (
                      <RoomCard
                        key={room.idStanza}
                        idStanza={room.idStanza}
                        nome={room.nome}
                        descrizione={room.descrizione}
                        capienza={room.capienza}
                        foto={room.foto}
                      />
                    ))}
                  </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function RoomListSkeleton() {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex bg-white rounded-lg shadow-md overflow-hidden max-w-2xl w-full h-48">
            <Skeleton className="w-1/3 h-full" />
            <div className="w-2/3 p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-end space-x-2 mt-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }