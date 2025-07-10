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
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  console.log("[LoginContent] session", session, status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log("result", result);
    setLoading(false);
    if (!result || !result.ok) {
      setError("Nieprawidłowy email lub hasło.");
    } else {
      // window.location.reload();
    }
  };

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
        <div className="text-xs text-muted-foreground">
          <b>Session status:</b> {status}
          <br />
          <b>Session:</b> {JSON.stringify(session)}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Adres e-mail</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Hasło</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-destructive text-xs mt-2">{error}</div>
          )}
          <div className="flex space-x-4 items-center">
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
              type="button"
              onClick={() => signIn("discord")}
            >
              <DiscordLogoIcon />
            </Button>
          </div>
          <DialogFooter className="flex flex-row justify-end mb-0 mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Anuluj
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Logowanie..." : "Zaloguj"}
            </Button>
          </DialogFooter>
        </form>
        <div className="mt-2 text-xs text-muted-foreground">
          <div>Session status: {status}</div>
          <pre className="whitespace-pre-wrap break-all">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
