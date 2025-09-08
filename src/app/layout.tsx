import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import SessionProvider from "@/components/providers/SessionProvider/SessionProvider";
import { QueryClientProvider } from "@/components/providers/QueryClientProvider";
import { Toaster } from "@/components/ui/Sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale, getTranslations } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        <Script id="toggle-theme">
          {`
          const isDarkMode = localStorage.theme === "dark" ||
            (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);

          document.documentElement.classList.toggle("dark", isDarkMode);
        `}
        </Script>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="rgba(0,0,0,1)" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased safe-area bg-background`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryClientProvider>
            <SessionProvider>{children}</SessionProvider>
          </QueryClientProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
