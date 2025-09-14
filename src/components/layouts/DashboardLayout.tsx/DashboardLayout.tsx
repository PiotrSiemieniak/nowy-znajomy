import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen space-y-4 p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="account" className="w-fit">
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
