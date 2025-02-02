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
        <div className="w-20">
            <Button onClick={onClick} size={"icon"}>
                <X/>
            </Button>
            <AspectRatio ratio={1 / 1}>
                <Image key={url} fill src={url} className="rounded-md object-cover" alt=""/>
            </AspectRatio>
        </div>
    )

}