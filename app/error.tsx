"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <Music className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Oops! Playback Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Something interrupted your Listenly experience. Don't worry, your music is safe—let's get you back on track.
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="text-left bg-muted p-4 rounded-md text-sm font-mono">
              <p className="font-semibold text-destructive">Error Details:</p>
              <p><strong>Message:</strong> {error.message}</p>
              {error.stack && (
                <details>
                  <summary className="cursor-pointer">Stack Trace</summary>
                  <pre className="whitespace-pre-wrap mt-2">{error.stack}</pre>
                </details>
              )}
            </div>
          )}
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}