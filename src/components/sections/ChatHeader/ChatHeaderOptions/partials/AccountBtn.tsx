import { ThemeSwitcher } from "@/components/specific/ThemeSwitcher";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";
import { LoginContent } from "@/components/specific/LoginContent/LoginContent";
import { UserCog } from "lucide-react";
import { AccountTrigger } from "@/components/specific/AccountTrigger";
import { RegisterContent } from "@/components/specific/RegisterContent";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { setLocaleNonRedirect } from "@/lib/actions/localeNonRedirect";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";

export function AccountBtn() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && session?.user;

  const locale = useLocale();
  const t = useTranslations("account");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = () => {
    const newLocale = locale === "en" ? "pl" : "en";

    startTransition(async () => {
      try {
        // Set locale without redirect
        await setLocaleNonRedirect(newLocale);
        // Refresh the page to apply new locale
        router.refresh();
      } catch (error) {
        console.error("Error setting locale:", error);
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"sm"} className="inline-flex">
          {t("title")} <UserCog className="ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-cardGlass w-80 backdrop-blur-lg">
        <div className={cn("grid gap-4")}>
          <div className="flex space-x-4 min-h-[56px] items-center justify-center">
            {isLoading ? (
              <div className="w-full flex justify-center items-center animate-pulse bg-muted rounded-xl h-[72px]" />
            ) : isAuthenticated ? (
              <AccountTrigger />
            ) : (
              <>
                <LoginContent />
                <RegisterContent />
              </>
            )}
          </div>
          <div className="space-y-2 px-2">
            <h5 className="font-medium">{t("options")}</h5>
            <ThemeSwitcher />
            <h6>{t("autoConnections")}</h6>
          </div>
          <div className="space-y-2 px-2 w-full">
            <h6 className="font-medium">{t("language.title")}</h6>
            <div className="w-full flex">
              <Button
                variant={"ghost"}
                onClick={handleLanguageChange}
                className="bg-card mx-auto"
              >
                <Label
                  className={cn("text-sm font-medium", {
                    "opacity-50": locale !== "pl",
                  })}
                >
                  {t("language.polish")}
                </Label>
                <Switch
                  checked={locale === "en"}
                  disabled={isPending}
                  className="mx-3"
                  tabIndex={-1}
                />
                <Label
                  className={cn("text-sm font-medium", {
                    "opacity-50": locale !== "en",
                  })}
                >
                  {t("language.english")}
                </Label>
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
