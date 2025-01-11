"use client";
import ErrorForm from "@/components/ErrorForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { useActionState } from "react";
import { editAccountForm } from "./action";


export default function EditAccountForm() {

    const [state, formAction] = useActionState(editAccountForm, undefined)

    return (
        <form>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" type="email" />
                    <ErrorForm errors={state?.errors.email}/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" type="password" />
                    <ErrorForm errors={state?.errors.password}/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telefono">Numero di Telefono</Label>
                    <PhoneInput
                    placeholder="Inserisci numero di telefono"
                    name="telefono"
                    defaultCountry="IT"
                    />
                    <ErrorForm errors={state?.errors.telefono}/>
                  </div>
                  <Button type="submit" className="w-full">
                    Conferma modifiche
                  </Button>
                </div>
              </div>
            </form>
    )
}