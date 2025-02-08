import Link from "next/link";
import { Button } from "./ui/button";
import { Calendar, Info, Luggage } from "lucide-react";
import { AspectRatio } from "./ui/aspect-ratio";
import BadgeStatoPrenotazione from "./BadgeStatoPrenotazione";
import { stato_prenotazione } from "@prisma/client";
import Image from "next/image";

interface BookingCardProps {
  idPrenotazione: string;
  nome: string;
  dataInizio: Date;
  dataFine: Date;
  stato: stato_prenotazione;
  urlFoto?: string;
}

export default function BookingCard({
  idPrenotazione,
  nome,
  dataInizio,
  dataFine,
  stato,
  urlFoto,
}: BookingCardProps) {
  return (
    <div className="p-4 flex gap-4 items-center bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl w-full">
      <div className="w-1/3 relative">
        <AspectRatio ratio={16/9}>
            <Image fill src={(urlFoto) ?? "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"} alt="Immagine Vetrina Stanza" className="rounded-md object-cover"  />
        </AspectRatio>
      </div>
      <div className="basis-2/3 flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{nome}</h2>
        
        <div className="text-gray-600 inline-flex items-center gap-2">
          <Calendar />
          <span className="capitalize">
            {dataInizio.toLocaleDateString("it-IT", {day: "2-digit", month: "long"})} - {dataFine.toLocaleDateString("it-IT", {day: "2-digit", month: "long", year: "numeric"})}
          </span>
        </div>

        <div className="text-gray-600 inline-flex items-center gap-2">
        <Info />
        <span>
          <BadgeStatoPrenotazione stato={stato} />
          </span>
        </div>

        <div className="flex justify-end space-x-2">
          <Button asChild>
            <Link href={`/account/mybookings/${idPrenotazione}`}>
              <Luggage /> Dettagli
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
