"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import { useAuth } from "@/Providers/Contexts/auth-context";
import { SidebarProvider } from "@/Providers/Contexts/SidebarContext";
import { SidebarLayout } from "@/components/layout/sidebar/SidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { submitArtistVerification } from "@/lib/api/api-calls/user_APIs/artist_APIs/artist-verification";

export default function Page() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const onSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      setSubmitting(true);
      await submitArtistVerification({ message: trimmed });
      toast.success("Verification request submitted");
      setMessage("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit verification request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SidebarProvider user={user}>
      <Header />
      <SidebarLayout mode="user" user={user} onLogout={logout}>
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Artist Verification Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I am an artist and I would like to verify my account. I release music under this username and want to upload/manage my tracks officially."
                className="min-h-40"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  Back
                </Button>
                <Button onClick={onSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit request"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    </SidebarProvider>
  );
}
