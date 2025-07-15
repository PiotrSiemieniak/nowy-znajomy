import { FlipWords } from "@/components/ui/FlipWords";
import { CHANNEL_NAME_EXAMPLES } from "./data";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/Label";

function shuffleArray<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function ChannelCreatorTeaser() {
  const shuffledWords = shuffleArray(CHANNEL_NAME_EXAMPLES);

  return (
    <div className="relative">
      <div className="space-y-4 z-10 relative">
        <div>
          <p className="font-semibold">Wasza wspólna przestrzeń</p>
          <p className="text-xs text-muted-foreground">
            Znajomi na wakacje? Znajomi w nowym mieście? Znajomi do wspólnej
            gry?
          </p>
        </div>
        <div className="w-full flex items-center justify-center space-x-2">
          <Search className="text-muted-foreground" />
          <div className="space-y-1 flex-1 max-w-96">
            <Label>Nazwa kanału</Label>
            <div className="border rounded flex-1">
              <FlipWords words={shuffledWords} duration={6000} />
            </div>
            <p className="text-xs text-muted-foreground">
              Wprowadź tematyczną nazwę kanału
            </p>
          </div>
        </div>
        <p className="text-sm">
          Utwórz nowy kanał o wybranej przez siebie tematyce i znajdź osoby,
          które podzielają Twoje zainteresowanie!
        </p>
      </div>

      {/* Bg with padding covers */}
      <div className="bg-muted h-full w-[150%] -translate-x-1/4 absolute top-0" />
      <div className="bg-muted h-full w-[150%] -translate-x-1/4 absolute top-0 -translate-y-2" />
      <div className="bg-muted h-full w-[150%] -translate-x-1/4 absolute top-0 translate-y-2" />
    </div>
  );
}
