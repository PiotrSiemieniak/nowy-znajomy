import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from "@/configs/accountRegister";
import { sendMail } from "@/lib/serverActions/sendMail";

type ValidationErrorBody = {
  ok: false;
  code: "USERNAME_LENGTH" | "EMAIL_LENGTH" | "PASSWORD_LENGTH";
  message: string;
};
type ValidationResult = { body: ValidationErrorBody; status: number } | null;

export function validateAccountFields({
  username,
  email,
  password
}: {
  username: string;
  email: string;
  password: string;
}): ValidationResult {
  if (
    typeof username !== "string" ||
    username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH
  ) {
    return {
      body: {
        ok: false,
        code: "USERNAME_LENGTH",
        message: `Nazwa użytkownika musi mieć od ${USERNAME_MIN_LENGTH} do ${USERNAME_MAX_LENGTH} znaków.`
      },
      status: 400
    };
  }
  if (
    typeof email !== "string" ||
    email.length < EMAIL_MIN_LENGTH ||
    email.length > EMAIL_MAX_LENGTH
  ) {
    return {
      body: {
        ok: false,
        code: "EMAIL_LENGTH",
        message: `Adres e-mail musi mieć od ${EMAIL_MIN_LENGTH} do ${EMAIL_MAX_LENGTH} znaków.`
      },
      status: 400
    };
  }
  if (
    typeof password !== "string" ||
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    return {
      body: {
        ok: false,
        code: "PASSWORD_LENGTH",
        message: `Hasło musi mieć od ${PASSWORD_MIN_LENGTH} do ${PASSWORD_MAX_LENGTH} znaków.`
      },
      status: 400
    };
  }
  return null;
}

export async function sendRegistrationConfirmationMail({
  to,
  username,
  confirmationSlug,
  confirmationCode,
}: {
  to: string;
  username: string;
  confirmationSlug: string;
  confirmationCode: string;
}) {
  await sendMail({
    to,
    subject: "Potwierdzenie rejestracji w Nowy Znajomy",
    html: `
      <div style="font-family: 'Segoe UI', 'Inter', Arial, sans-serif; background: #f7f7fa; padding: 32px 0;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 16px #0001; padding: 32px 24px 24px 24px;">
          <div style="text-align: center;">
            <h1 style="margin: 0 0 8px 0; font-size: 2em; font-weight: 800; color: #18181b; letter-spacing: -1px;">Witaj, ${username}!</h1>
            <p style="font-size: 1.15em; font-weight: 600; color: #18181b; margin: 0 0 18px 0;">Dziękujemy za rejestrację w serwisie <span style='color:#4f46e5'>Nowy Znajomy</span>.</p>
          </div>
          <p style="color: #888; font-size: 0.98em; margin-bottom: 24px; text-align: center;">Jeśli to nie Ty zakładałeś konto, po prostu zignoruj tę wiadomość.</p>
          <div style="margin: 32px 0 18px 0; text-align: center;">
            <div style="font-size: 1.08em; font-weight: 500; margin-bottom: 12px;">Aby potwierdzić rejestrację:</div>
            <a href="${process.env.DOMAIN_URL}/api/account/confirm/${confirmationSlug}"
              style="display: inline-block; background: #18181b; color: #fff; font-weight: 700; font-size: 1.1em; padding: 14px 32px; border-radius: 12px; text-decoration: none; letter-spacing: 0.03em; box-shadow: 0 2px 8px #0002; transition: background 0.2s; margin-bottom: 18px;">Potwierdź rejestrację</a>
          </div>
          <div style="display: flex; align-items: center; margin: 24px 0 18px 0; text-align: center;">
            <div style="flex: 1; height: 1px; background: #e5e7eb; margin-right: 8px;"></div>
            <span style="color: #bbb; font-size: 0.95em; white-space: nowrap; width: 100%; text-align: center;">------------- lub -------------</span>
            <div style="flex: 1; height: 1px; background: #e5e7eb; margin-left: 8px;"></div>
          </div>
          <div style="text-align: center;">
            <div style="display: inline-block; background: #f3f4f6; border-radius: 14px; padding: 18px 32px; margin: 0 auto; font-size: 2.1em; font-weight: 700; letter-spacing: 0.25em; color: #18181b; user-select: all; box-shadow: 0 1px 6px #0001;">
              ${(confirmationCode ?? '').slice(0,3)}&nbsp;&nbsp;${(confirmationCode ?? '').slice(3)}
            </div>
            <div style="margin-top: 8px; color: #666; font-size: 0.98em;">Skopiuj ten kod i wklej w aplikacji, aby potwierdzić konto.</div>
          </div>
          <p style="margin-top: 36px; color: #888; font-size: 0.98em; text-align: center;">Pozdrawiamy,<br>Zespół Nowy Znajomy</p>
        </div>
      </div>
    `,
  });
}
