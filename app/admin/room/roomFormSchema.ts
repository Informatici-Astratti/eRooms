import { z } from "zod";

export const formSchema = z.object({
    idStanza: z.string(),
    nome: z.string().min(1, {message: "Nome Stanza troppo corto"}).max(30, {message: "Nome stanza troppo lungo"}),
    capienza: z.number().min(1, {message: "Capienza non valida"}),
    descrizione: z.string().min(1, {message: "Descrizione non valida"}),
    costoStandard: z.number().min(1, {message: "Non penso tu voglia regalare il soggiorno! Prezzo non valido."}),
    foto: z.array(z.string()).optional()
});