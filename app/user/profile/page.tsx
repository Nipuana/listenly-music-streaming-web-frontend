"use client";

import { handleGetProfile } from "@/lib/actions/auth-acitons";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileDashboard } from "./_components/ProfileDashboard";

export default function Page() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const result = await handleGetProfile();
                if (!result.success) {
                    throw new Error(result.message || "Failed to fetch profile data");
                }
                if (!result.data) {
                    notFound();
                }
                setProfile(result.data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-background via-background-secondary to-background-tertiary flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-background via-background-secondary to-background-tertiary flex items-center justify-center">
                <div className="text-center">
                    <div className="text-error text-lg mb-2">Error loading profile</div>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    return <ProfileDashboard />;
}
