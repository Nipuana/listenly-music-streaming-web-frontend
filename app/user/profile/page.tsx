"use client";

import { handleGetProfile } from "@/lib/actions/auth-acitons";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

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
        return <div className="p-6">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-error">Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">Profile</h1>
            <p className="text-muted-foreground">Welcome to your profile page.</p>
            {profile && (
                <div className="mt-4">
                    <p className="text-foreground">User data loaded successfully.</p>
                </div>
            )}
        </div>
    );
}
