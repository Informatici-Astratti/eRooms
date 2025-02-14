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
import { useToast } from "@/hooks/use-toast";
import { Proprieta } from "@prisma/client";

interface EditPropertyFormProps {
  property: Proprieta | null;
}

export default function EditPropertyForm({ property }: EditPropertyFormProps) {
    const { toast } = useToast()

    const [state, formAction] = useActionState(editPropertyForm, {
        success: false,
        fields: property ?? {id: "", nome: "", email: "", telefono: "", registrazioneSocieta: "", indirizzo: "", citta: "", CAP: "", paese: "" },
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
        <form action={formAction} className="p-4 rounded-md bg-white border">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 space-y-5">
                    <h1 className="text-xl font-bold">Informazioni di Contatto</h1>
                        <Input className="hidden" name="id" type="text" defaultValue={state.fields?.id}/>
                        <div className="w-[80%]">
                            <Label>Nome della Proprietà</Label>
                            <Input name="nome" type="text" placeholder="Dove mi trovo?" defaultValue={state.fields?.nome} required/>
                            <ErrorForm errors={state?.errors?.nome}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>Email</Label>
                            <Input name="email" type="email" placeholder="B&B@example.com" defaultValue={state.fields?.email ?? ""} required/>
                            <ErrorForm errors={state?.errors?.email}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>Numero di Telefono</Label>
                            <Input name="telefono" type="text" placeholder="123 456 7890" defaultValue={state.fields?.telefono ?? ""} required/>
                            <ErrorForm errors={state?.errors?.telefono}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>Numero di Registrazione della Società</Label>
                            <Input name="registrazioneSocieta" type="text" placeholder="1357924680" defaultValue={state.fields?.registrazioneSocieta} required/>
                            <ErrorForm errors={state?.errors?.registrazioneSocieta}/>
                        </div>

                </div>
                <div className="p-4 space-y-5">
                    <h1 className="text-xl font-bold">Indirizzo Proprietà</h1>
                        <div className="w-[80%]">
                            <Label>Indirizzo</Label>
                            <Input name="indirizzo" type="text" placeholder="Via Roma" defaultValue={state.fields?.indirizzo} required/>
                            <ErrorForm errors={state?.errors?.indirizzo}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>Città</Label>
                            <Input name="citta" type="text" placeholder="Roma" defaultValue={state.fields?.citta} required/>
                            <ErrorForm errors={state?.errors?.citta}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>CAP</Label>
                            <Input name="CAP" type="text" placeholder="70032" defaultValue={state.fields?.CAP} required/>
                            <ErrorForm errors={state?.errors?.CAP}/>
                        </div>
                        <div className="w-[80%]">
                            <Label>Paese</Label>
                            <Select name="paese" defaultValue={state.fields?.paese}>
                                <SelectTrigger className="w-[280px]" defaultValue={state.fields?.paese}>
                                    <SelectValue placeholder="Seleziona" />
                                </SelectTrigger>
                                <SelectContent defaultValue={state.fields?.paese}>
                                    <SelectGroup>
                                    <SelectLabel>Europa</SelectLabel>
                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                    <SelectItem value="France">France</SelectItem>
                                    <SelectItem value="Germany">Germany</SelectItem>
                                    <SelectItem value="Spain">Spain</SelectItem>
                                    <SelectItem value="Italia">Italy</SelectItem>
                                    <SelectItem value="Russia">Russia</SelectItem>
                                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                                    <SelectItem value="Belgium">Belgium</SelectItem>
                                    <SelectItem value="Switzerland">Switzerland</SelectItem>
                                    <SelectItem value="Sweden">Sweden</SelectItem>
                                    <SelectItem value="Norway">Norway</SelectItem>
                                    <SelectItem value="Denmark">Denmark</SelectItem>
                                    <SelectItem value="Finland">Finland</SelectItem>
                                    <SelectItem value="Poland">Poland</SelectItem>
                                    <SelectItem value="Greece">Greece</SelectItem>
                                    <SelectItem value="Portugal">Portugal</SelectItem>
                                    <SelectItem value="Ireland">Ireland</SelectItem>
                                    <SelectItem value="Austria">Austria</SelectItem>
                                    <SelectItem value="Hungary">Hungary</SelectItem>
                                    <SelectItem value="Czech Republic">Czech Republic</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Nord America</SelectLabel>
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="Mexico">Mexico</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Sud America</SelectLabel>
                                    <SelectItem value="Brazil">Brazil</SelectItem>
                                    <SelectItem value="Argentina">Argentina</SelectItem>
                                    <SelectItem value="Colombia">Colombia</SelectItem>
                                    <SelectItem value="Chile">Chile</SelectItem>
                                    <SelectItem value="Peru">Peru</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Medio Oriente</SelectLabel>
                                    <SelectItem value="Turkey">Turkey</SelectItem>
                                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                                    <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                                    <SelectItem value="Israel">Israel</SelectItem>
                                    <SelectItem value="Iran">Iran</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Asia</SelectLabel>
                                    <SelectItem value="China">China</SelectItem>
                                    <SelectItem value="Japan">Japan</SelectItem>
                                    <SelectItem value="India">India</SelectItem>
                                    <SelectItem value="South Korea">South Korea</SelectItem>
                                    <SelectItem value="Thailand">Thailand</SelectItem>
                                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                                    <SelectItem value="Singapore">Singapore</SelectItem>
                                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                                    <SelectItem value="Philippines">Philippines</SelectItem>
                                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Africa</SelectLabel>
                                    <SelectItem value="South Africa">South Africa</SelectItem>
                                    <SelectItem value="Egypt">Egypt</SelectItem>
                                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                                    <SelectItem value="Kenya">Kenya</SelectItem>
                                    <SelectItem value="Morocco">Morocco</SelectItem>
                                    <SelectItem value="Algeria">Algeria</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                    <SelectLabel className="mt-5">Oceania</SelectLabel>
                                    <SelectItem value="Australia">Australia</SelectItem>
                                    <SelectItem value="New Zealand">New Zealand</SelectItem>
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














