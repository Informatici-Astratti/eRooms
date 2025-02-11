'use client';
import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BedDouble } from 'lucide-react';
import ERoomsLogoComponent from '@/components/ERoomsLogoComponent';

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <ERoomsLogoComponent />
        <SignIn.Root >
          <Clerk.Loading>
            {(isGlobalLoading) => (
              <SignIn.Step name="start">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">Bentornato</CardTitle>
                    <CardDescription>
                      Entra con il tuo account e-Rooms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex flex-col gap-4'>
                    <Clerk.Field name="identifier" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Email</Label>
                      </Clerk.Label>
                      <Clerk.Input type="email" required asChild>
                        <Input placeholder="m@example.com" />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                    <Clerk.Field name="password" className="space-y-2">
                      <div className="flex items-center">
                        <Clerk.Label asChild>
                          <Label>Password</Label>
                        </Clerk.Label>
                      </div>
                      <Clerk.Input type="password" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                    <SignIn.Action submit asChild>
                      <Button className="w-full" disabled={isGlobalLoading}>
                        <Clerk.Loading>
                          {(isLoading) => (isLoading ? 'Caricamento...' : 'Login')}
                        </Clerk.Loading>
                      </Button>
                    </SignIn.Action>
                    <div className="text-center text-sm">
                      Non hai un account?{' '}
                      <Link href="/signup" className="underline underline-offset-4">
                        Registrati
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </SignIn.Step>
            )}
          </Clerk.Loading>
        </SignIn.Root>
      </div>
    </div>
  );
}
