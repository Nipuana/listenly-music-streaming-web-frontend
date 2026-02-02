
import dynamic from "next/dynamic";

const DashboardScreen = dynamic(() => import("./dashboard-screen"));

export default function AdminDashboardPage() {
	return <DashboardScreen />;
}
