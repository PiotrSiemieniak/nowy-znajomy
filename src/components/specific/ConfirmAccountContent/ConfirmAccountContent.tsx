"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/InputOTP";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { Typography } from "@/components/ui/Typography";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { confirmAccount } from "@/lib/services/api/account";
import { cn } from "@/lib/utils";
import { appNotification } from "@/components/ui/Sonner/appNotification";
import { useTranslations } from "next-intl";

type Props = {
  email: string; // Opcjonalnie, jeśli email jest przekazywany jako prop
  password?: string; // Dodano przekazywanie hasła
  callback?: () => void; // Callback do wywołania po pomyślnym potwierdzeniu konta
};
export function ConfirmAccountContent({ email, password, callback }: Props) {
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  const t = useTranslations("auth.confirm");

  const handleOtpChange = async (value: string) => {
    setOtpValue(value);
    setError(null);
    if (value.length === 6) {
      setIsFetching(true);
      const res = await confirmAccount({ email, code: value });
      setIsFetching(false);
      let errorMsg = t("errorMessage");
      if (res && typeof res === "object") {
        if ("message" in res && typeof res.message === "string") {
          errorMsg = res.message;
        }
      }
      if (res && typeof res === "object" && "ok" in res && res.ok) {
        setIsSuccess(true);
      } else {
        setError(errorMsg);
        setPlaceholder(value);
        setOtpValue("");
      }
    }
  };

  useEffect(() => {
    if (isSuccess && callback) callback();
    if (isSuccess) {
      // Automatyczne logowanie po potwierdzeniu konta
      if (email && password) {
        import("next-auth/react").then(({ signIn }) => {
          signIn("credentials", {
            email,
            password,
            redirect: false,
          });
        });
      }
      appNotification(t("notification.title"), t("notification.description"), {
        duration: 10000,
        icon: "✅",
      });
    }
  }, [isSuccess, callback, email, password, t]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <Typography className="mt-0 w-full ">
        {t("description", { email })}
      </Typography>
      <div
        className={cn(
          "flex flex-col items-center gap-2 w-full p-4 rounded-xl border bg-muted dark:bg-transparent relative",
          !!error && "bg-red-100 dark:bg-red-950/50"
        )}
      >
        <Label htmlFor="otp-input">{t("codeLabel")}</Label>
        <InputOTP
          maxLength={6}
          id="otp-input"
          value={otpValue}
          onChange={handleOtpChange}
          placeholder={placeholder}
          disabled={isFetching || isSuccess}
        >
          <InputOTPGroup>
            <InputOTPSlot className="bg-card" index={0} />
            <InputOTPSlot className="bg-card" index={1} />
            <InputOTPSlot className="bg-card" index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot className="bg-card" index={3} />
            <InputOTPSlot className="bg-card" index={4} />
            <InputOTPSlot className="bg-card" index={5} />
          </InputOTPGroup>
        </InputOTP>
        <AnimatePresence mode="wait">
          {isFetching && (
            <motion.div
              key={"loading"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 backdrop-blur-xs rounded"
            >
              <Loader2 className="animate-spin text-muted-foreground" />
              <Typography
                className="mx-auto text-muted-foreground animate-pulse mt-1"
                variant={"small"}
              >
                {t("verifying")}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
        {error && (
          <Typography className="text-destructive text-xs mt-2">
            {error}
          </Typography>
        )}
      </div>
      <Typography variant={"muted"} className="text-center w-full">
        {t("alternativeMethod")}
      </Typography>
      <Separator />
      <Typography variant={"muted"} className="w-full">
        {t.rich("noEmail", { br: () => <br /> })}
      </Typography>
    </div>
  );
}
