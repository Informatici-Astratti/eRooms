"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EmailDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Modifica</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form>
        <DialogHeader>
          <DialogTitle>Modifica Email</DialogTitle>
          <DialogDescription>
            Inserisci la nuova Email!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Email
            </Label>
            <Input id="email" type="email" name="email" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
      </DialogContent>
    </Dialog>
  )
}
