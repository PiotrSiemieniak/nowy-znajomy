import { ThemeSwitcher } from "@/components/specific/ThemeSwitcher";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import { LoginContent } from "@/components/specific/LoginContent/LoginContent";
import { UserCog } from "lucide-react";

export function AccountBtn() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"sm"} className="inline-flex">
          Konto <UserCog className="ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-card/75 w-80 backdrop-blur-lg">
        <div className={cn("grid gap-4")}>
          <div className="flex space-x-4">
            <LoginContent />
            <Button size={"sm"} className="flex-1">
              Zarejestruj
            </Button>
          </div>
          <div className="bg-muted h-px w-full" />
          <div>
            <h5 className="font-medium">Opcje</h5>
            <ThemeSwitcher />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
