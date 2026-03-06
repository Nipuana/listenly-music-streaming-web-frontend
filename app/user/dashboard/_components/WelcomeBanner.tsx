import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface WelcomeBannerProps {
  userName?: string;
}

export function WelcomeBanner({ userName = "User" }: WelcomeBannerProps) {
  return (
    <Card className="border-none shadow-2xl bg-gradient-primary text-primary-foreground overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl text-primary-foreground">Welcome back, {userName}! 👋</CardTitle>
        <CardDescription className="text-primary-foreground/90 text-sm sm:text-base">
          Continue where you left off and discover new music
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1 sm:flex-initial">
            <Link href="/user/library">Browse Music</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 sm:flex-initial">
            <Link href="/user/premium">Upgrade to Premium</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
