"use client"

import ErrorForm from "@/components/ErrorForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useActionState, useEffect } from "react";
import { editPropertyForm } from "./action";
import { toast } from "@/hooks/use-toast";



export default function EditPropertyForm() {

    const [state, formAction] = useActionState(editPropertyForm, {
        success: false,
        fields: { nome: "", email: "", telefono: "", societa: 0, indirizzo: "", citta: "", CAP: "", paese: "" },
      })
    
      useEffect(() => {
        if (state?.success) {
          toast({
            title: "Successo",
            description: state.message,
            variant: "success",
          })
        }
      }, [state?.success, toast, state?.message])
    
    return (
        <form action={formAction}>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 space-y-5">
                    <h1 className="text-xl font-bold">Informazioni di Contatto</h1>
                        <div className="w-[80%]">
                            <Label>Nome della Proprietà</Label>
                            <Input name="nome" type="text" placeholder="Dove mi trovo?" defaultValue={state.fields?.nome ?? ""} required/>
                            <ErrorForm errors={state?.errors?.nome}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>Email</Label>
                            <Input name="email" type="email" placeholder="B&B@example.com" defaultValue={state.fields?.email ?? ""} required/>
                            <ErrorForm errors={state?.errors?.email}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>Numero di Telefono</Label>
                            <PhoneInput
                            placeholder="123 456 7890"
                            name="telefono"
                            defaultCountry="IT"
                            value={state.fields?.telefono ?? ""}
                            />
                            <ErrorForm errors={state?.errors?.telefono}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>Numero di Registrazione della Società</Label>
                            <Input name="societa" type="number" placeholder="1357924680" defaultValue={state.fields?.societa ?? ""} required/>
                            <ErrorForm errors={state?.errors?.societa}/>
                        </div>

                </div>
                <div className="p-4 space-y-5">
                    <h1 className="text-xl font-bold">Indirizzo Proprietà</h1>
                        <div className="w-[80%]">
                            <Label>Indirizzo</Label>
                            <Input name="indirizzo" type="text" placeholder="Via Roma" defaultValue={state.fields?.indirizzo ?? ""} required/>
                            <ErrorForm errors={state?.errors?.indirizzo}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>Città</Label>
                            <Input name="citta" type="text" placeholder="Roma" defaultValue={state.fields?.citta ?? ""} required/>
                            <ErrorForm errors={state?.errors?.citta}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>CAP</Label>
                            <Input name="CAP" type="text" placeholder="70032" defaultValue={state.fields?.CAP ?? ""} required/>
                            <ErrorForm errors={state?.errors?.CAP}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>Paese</Label>
                            <Select name="paese" defaultValue={state.fields?.paese ?? ""}>
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Seleziona" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Europa</SelectLabel>
                                        <SelectItem value="uk">United Kingdom</SelectItem>
                                        <SelectItem value="fr">France</SelectItem>
                                        <SelectItem value="de">Germany</SelectItem>
                                        <SelectItem value="es">Spain</SelectItem>
                                        <SelectItem value="it">Italy</SelectItem>
                                        <SelectItem value="ru">Russia</SelectItem>
                                        <SelectItem value="nl">Netherlands</SelectItem>
                                        <SelectItem value="be">Belgium</SelectItem>
                                        <SelectItem value="ch">Switzerland</SelectItem>
                                        <SelectItem value="se">Sweden</SelectItem>
                                        <SelectItem value="no">Norway</SelectItem>
                                        <SelectItem value="dk">Denmark</SelectItem>
                                        <SelectItem value="fi">Finland</SelectItem>
                                        <SelectItem value="pl">Poland</SelectItem>
                                        <SelectItem value="gr">Greece</SelectItem>
                                        <SelectItem value="pt">Portugal</SelectItem>
                                        <SelectItem value="ie">Ireland</SelectItem>
                                        <SelectItem value="at">Austria</SelectItem>
                                        <SelectItem value="hu">Hungary</SelectItem>
                                        <SelectItem value="cz">Czech Republic</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Nord America</SelectLabel>
                                        <SelectItem value="us">United States</SelectItem>
                                        <SelectItem value="ca">Canada</SelectItem>
                                        <SelectItem value="mx">Mexico</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Sud America</SelectLabel>
                                        <SelectItem value="br">Brazil</SelectItem>
                                        <SelectItem value="ar">Argentina</SelectItem>
                                        <SelectItem value="co">Colombia</SelectItem>
                                        <SelectItem value="cl">Chile</SelectItem>
                                        <SelectItem value="pe">Peru</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Medio Oriente</SelectLabel>
                                        <SelectItem value="tr">Turkey</SelectItem>
                                        <SelectItem value="sa">Saudi Arabia</SelectItem>
                                        <SelectItem value="ae">United Arab Emirates</SelectItem>
                                        <SelectItem value="il">Israel</SelectItem>
                                        <SelectItem value="ir">Iran</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Asia</SelectLabel>
                                        <SelectItem value="cn">China</SelectItem>
                                        <SelectItem value="jp">Japan</SelectItem>
                                        <SelectItem value="in">India</SelectItem>
                                        <SelectItem value="kr">South Korea</SelectItem>
                                        <SelectItem value="th">Thailand</SelectItem>
                                        <SelectItem value="my">Malaysia</SelectItem>
                                        <SelectItem value="sg">Singapore</SelectItem>
                                        <SelectItem value="id">Indonesia</SelectItem>
                                        <SelectItem value="ph">Philippines</SelectItem>
                                        <SelectItem value="vn">Vietnam</SelectItem>
                                        <SelectItem value="bd">Bangladesh</SelectItem>
                                        <SelectItem value="pk">Pakistan</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Africa</SelectLabel>
                                        <SelectItem value="za">South Africa</SelectItem>
                                        <SelectItem value="eg">Egypt</SelectItem>
                                        <SelectItem value="ng">Nigeria</SelectItem>
                                        <SelectItem value="ke">Kenya</SelectItem>
                                        <SelectItem value="ma">Morocco</SelectItem>
                                        <SelectItem value="dz">Algeria</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Oceania</SelectLabel>
                                        <SelectItem value="au">Australia</SelectItem>
                                        <SelectItem value="nz">New Zealand</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>  
                            <ErrorForm errors={state?.errors?.paese}/>
                        </div>
                </div>
            </div>
            <div>
                <Button type="submit" className="mt-5">
                    Conferma Dettaglio
                </Button>
            </div>
        </form>
    )
}














