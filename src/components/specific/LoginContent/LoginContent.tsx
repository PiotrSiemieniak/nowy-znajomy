import { Button } from "@/components/ui/Button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label/Label";
import { DiscordLogoIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import { Facebook } from "lucide-react";
import { signIn } from "next-auth/react"; // Dodaj ten import

export function LoginContent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} className="flex-1">
          Zaloguj
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 max-w-[90vw] w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-left">Logowanie</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nazwa użytkownika</Label>
            <Input />
          </div>
          <div className="space-y-2">
            <Label>Hasło</Label>
            <Input />
          </div>
          <div className="flex space-x-4">
            <div className="h-px flex-1 bg-muted my-auto" />
            <p className="text-muted-foreground text-xs my-auto">
              lub za pomocą
            </p>
            <div className="h-px flex-1 bg-muted my-auto" />
          </div>
          <div className="flex justify-center gap-4">
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={() => signIn("discord")}
            >
              <DiscordLogoIcon />
            </Button>
            {/* <Button
              size={"icon"}
              variant={"outline"}
              onClick={() => signIn("instagram")}
            >
              <InstagramLogoIcon />
            </Button>
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={() => signIn("facebook")}
            >
              <Facebook />
            </Button> */}
          </div>
        </div>
        <DialogFooter className="flex flex-row justify-end mb-0">
          <DialogClose asChild>
            <Button variant="outline">Anuluj</Button>
          </DialogClose>
          <Button type="submit">Zaloguj</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
