import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BedDouble } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
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
                            Crea il tuo account e-Rooms
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid gap-6">
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Conferma Password</Label>
                                        <Input id="password" type="password" required />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Registrati
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Hai già un account?{" "}
                                    <Link href="/login" className="underline underline-offset-4">
                                        Accedi
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