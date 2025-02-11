'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ERoomsLogoComponent from '@/components/ERoomsLogoComponent'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/app/lib/utils'

export default function SignupPage() {

    const [otp, setOtp] = useState<string>("")

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ERoomsLogoComponent />
        <SignUp.Root>
          <Clerk.Loading>
            {(isGlobalLoading) => (
              <>
                {/* STEP 1: Registrazione */}
                <SignUp.Step name="start">
                  <Card className="w-full sm:w-96">
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">Benvenuto</CardTitle>
                      <CardDescription>
                        Crea il tuo account e-Rooms
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="emailAddress" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Email</Label>
                        </Clerk.Label>
                        <Clerk.Input type="email" required asChild>
                          <Input placeholder="m@example.com" />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                      <Clerk.Field name="password" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Password</Label>
                        </Clerk.Label>
                        <Clerk.Input type="password" required asChild>
                          <Input />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignUp.Captcha className="empty:hidden" />
                        <SignUp.Action submit asChild>
                          <Button disabled={isGlobalLoading} className="w-full">
                            <Clerk.Loading>
                              {(isLoading) =>
                                isLoading ? (
                                  <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Registrati'
                                )
                              }
                            </Clerk.Loading>
                          </Button>
                        </SignUp.Action>
                        <div className="text-center text-sm">
                            Hai già un account?{' '}
                            <Link href="/signup" className="underline underline-offset-4">
                                Accedi
                            </Link>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </SignUp.Step>

                {/* STEP 2: Verifica account con OTP */}
                <SignUp.Step name="verifications">
                  <SignUp.Strategy name="email_code">
                    <Card className="w-full sm:w-96">
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl">Verifica Account</CardTitle>
                        <CardDescription>
                          Inserisci il codice OTP inviato alla tua email per completare la verifica.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-y-4 items-center">
                        <Clerk.Field name="code" className="space-y-2">
                          <Clerk.Label asChild>
                            <Label>Codice OTP</Label>
                          </Clerk.Label>
                          <div className="flex justify-center text-center">
                            <Clerk.Input
                              type="otp"
                              className="flex justify-center has-[:disabled]:opacity-50"
                              autoSubmit
                              render={({ value, status }) => {
                                return (
                                  <div
                                    data-status={status}
                                    className={cn(
                                      'relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
                                      {
                                        'z-10 ring-2 ring-ring ring-offset-background':
                                          status === 'cursor' || status === 'selected',
                                      },
                                    )}
                                  >
                                    {value}
                                    {status === 'cursor' && (
                                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                        <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
                                      </div>
                                    )}
                                  </div>
                                )
                              }}
                            />
                          </div>
                          <Clerk.FieldError className="block text-sm text-destructive" />
                        </Clerk.Field>
                        <SignUp.Action
                          asChild
                          resend
                          className="text-muted-foreground"
                          fallback={({ resendableAfter }) => (
                            <Button variant="link" size="sm" disabled>
                              Non hai ricevuto il codice? Clicca qui (
                              <span className="tabular-nums">{resendableAfter}</span>)
                            </Button>
                          )}
                        >
                          <Button type="button" variant="link" size="sm" className='underline underline-offset-4'>
                            Non hai ricevuto il codice? Clicca qui
                          </Button>
                        </SignUp.Action>
                      </CardContent>
                      <CardFooter>
                        <div className="grid w-full gap-y-4">
                          <SignUp.Action submit asChild>
                            <Button disabled={isGlobalLoading} className="w-full">
                              <Clerk.Loading>
                                {(isLoading) =>
                                  isLoading ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                  ) : (
                                    'Continua'
                                  )
                                }
                              </Clerk.Loading>
                            </Button>
                          </SignUp.Action>
                        </div>
                      </CardFooter>
                    </Card>
                  </SignUp.Strategy>
                </SignUp.Step>
              </>
            )}
          </Clerk.Loading>
        </SignUp.Root>
      </div>
    </div>
  )
}
