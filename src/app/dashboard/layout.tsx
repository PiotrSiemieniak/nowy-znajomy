import { DashboardLayout } from "@/components/layouts/DashboardLayout.tsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
