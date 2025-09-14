import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen space-y-4 p-4">
      <div className="w-full max-w-md inline-flex">
        <Link href="/chat" className="my-auto">
          <Button
            size={"sm"}
            variant="ghost"
            className="inline-flex rounded-xl my-auto bg-muted p-4"
          >
            <ArrowLeft />
            Wróć do czatu
          </Button>
        </Link>
        <Tabs defaultValue="account" className="w-fit ml-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Konto</TabsTrigger>
            <TabsTrigger value="settings">Ustawienia</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  );
}
