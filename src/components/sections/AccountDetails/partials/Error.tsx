import { Button } from "@/components/ui/Button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { TriangleAlert } from "lucide-react";

export function Error({ refetch }: { refetch: () => void }) {
  return (
    <div className="w-full h-54 bg-gradient-to-b from-destructive/75 to-transparent rounded-lg flex items-center justify-center flex-col gap-2">
      <TriangleAlert />
      <div>
        <p className="font-semibold text-center">Coś poszło nie tak</p>
        <p className="text-xs">
          Wystąpił błąd podczas próby pobrania szczegółów konta.
        </p>
      </div>
      <Button variant={"secondary"} onClick={refetch}>
        <ReloadIcon />
        Spróbuj ponownie
      </Button>
    </div>
  );
}
