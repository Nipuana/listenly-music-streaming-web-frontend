import Header from "@/components/layout/header";
import { DashboardClient } from "./_components/DashboardClient";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <DashboardClient />
    </div>
  );
}
