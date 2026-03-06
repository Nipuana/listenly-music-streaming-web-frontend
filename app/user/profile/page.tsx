"use client";

import { ProfileDashboard } from "./_components/ProfileDashboard";
import { SidebarProvider } from "@/Providers/Contexts/SidebarContext";
import { useAuth } from "@/Providers/Contexts/auth-context";
import Header from "@/components/layout/header";

export default function Page() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <SidebarProvider>
                <Header />
                <div className="min-h-screen bg-linear-to-br from-background via-background-secondary to-background-tertiary flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your profile...</p>
                    </div>
                </div>
            </SidebarProvider>
        );
    }

    if (!user) {
        return (
            <SidebarProvider>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-error">No profile information available.</p>
                </div>
            </SidebarProvider>
        );
    }

    return (
        <SidebarProvider>
            <Header />
            <ProfileDashboard />
        </SidebarProvider>
    );
}
