"use client";

import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface RoomPictureProps{
    url: string
    onClick: () => void
}

export default function RoomPicture({url, onClick}: RoomPictureProps) {

    return(
        <div className="relative w-full max-w-md">
            
            <AspectRatio ratio={1 / 1}>
                <Image key={url} fill src={url} className="rounded-md object-cover" alt=""/>
            </AspectRatio>
            <Button onClick={onClick} variant={"ghost"} size={"icon"} className="absolute top-2 right-2 size-4">
                <X/>
            </Button>
        </div>
    )

}