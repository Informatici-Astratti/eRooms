"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BedDouble } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { loginWithMail } from "../action";
import ErrorForm from "@/components/ErrorForm";

export default function LoginPage() {
    const [state, formAction] = useActionState(loginWithMail, undefined);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex gap-2 justify-center items-center">
                    <div className="flex size-6 bg-primarflex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <BedDouble className="size-4" />
                    </div>
                    <p className="font-bold">e-Rooms</p>
                </div>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Benvenuto</CardTitle>
                        <CardDescription>
                            Entra con il tuo account e-Rooms
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction}>
                            <div className="grid gap-6">
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                        />
                                        <ErrorForm errors={state?.errors.email}/>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            <Link
                                                href="#"
                                                className="ml-auto text-sm underline-offset-4 hover:underline"
                                            >
                                                Password Dimenticata?
                                            </Link>
                                        </div>
                                        <Input name="password" type="password" required />
                                        <ErrorForm errors={state?.errors.password}/>
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Non hai un account?{" "}
                                    <Link href="/signup" className="underline underline-offset-4">
                                        Registrati
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}