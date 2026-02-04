import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface WelcomeBannerProps {
  userName?: string;
}

export function WelcomeBanner({ userName = "User" }: WelcomeBannerProps) {
  return (
    <Card className="border-none shadow-2xl bg-[linear-gradient(to_right,var(--primary),var(--secondary))] text-white overflow-hidden">
      <CardHeader>
        <CardTitle className="text-3xl text-white">Welcome back, {userName}! 👋</CardTitle>
        <CardDescription className="text-white/90 text-base">
          Continue where you left off and discover new music
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button asChild className="bg-white text-primary hover:bg-white/90">
            <Link href="/user/library">Browse Music</Link>
          </Button>
          <Button asChild variant="secondary" className="bg-primary/80 text-white hover:bg-primary border-white/20">
            <Link href="/user/premium">Upgrade to Premium</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
