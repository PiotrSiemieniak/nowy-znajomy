export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen space-y-4 p-4">
      <div>Tutaj jakiś navbar z animacją i wykryciem url</div>
      {children}
    </div>
  );
}
