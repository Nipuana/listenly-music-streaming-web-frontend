"use client";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Music, Check, User, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Checkbox } from "../../../../components/ui/checkbox";
import { useState } from "react";
import { handleLogin } from "@/lib/actions/auth-acitons";
import { LoginFormValues, loginSchema } from "@/app/(auth)/utils/loginSchema";
import { setAuthToken, setUserData } from "@/lib/cookies/user-data-cookie";
import { login } from "@/lib/api/api-calls/user_APIs/auth_APIs/auth";
import { useAuth } from "@/Providers/Contexts/auth-context";




export default function LoginForm() {

  const { checkAuth }=useAuth()
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, control } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });
  const[error,setError]=useState("");
  async function onSubmit(data: LoginFormValues) {
    setError("");
    try {
      const result = await login(data);
      if (result.success) {
        // Save auth cookies for this session.
        // ("Remember me" can be used later to add an expiry/maxAge, but skipping cookies breaks auth on protected routes.)
        await setAuthToken(result.token);
        await setUserData(result.data);
        await checkAuth();
        // Check the user's role and navigate accordingly
        if (result.data && result.data.role === "user") {
          router.replace("/user/dashboard");
        }
        if (result.data && result.data.role === "admin") {
          router.replace("/admin/ad-dash");
        }
        // If artist, go to the artist area
        if (result.data && result.data.role === "artist") {
          router.replace("/artist/dashboard");
        }
      } else {
        throw new Error(result.message || "Login failed due to role issue contact support");
      }
    } catch (err: Error | any) {
      let msg = err?.message;
      if (!msg || msg === "Error") {
        msg = "Unable to connect to the server. Please try again later.";
      }
      setError(msg || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background">
      <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-8 p-6">
        {/* Left Panel */}
        <div className="bg-primary rounded-2xl shadow-2xl p-10 flex flex-col justify-between min-h-120">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-foreground/20">
                <Music className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground">Listenly</span>
            </div>
            <h2 className="text-3xl font-bold text-primary-foreground mb-2">Welcome Back!</h2>
            <p className="text-primary-foreground/80 mb-8">
              Log in to access your personalized music library, playlists, and continue where you left off.
            </p>
          </div>
          <ul className="space-y-4 mt-8">
            <li className="flex items-center gap-3 text-primary-foreground/90">
              <Check className="w-5 h-5 text-primary-foreground" />
              10,000+ songs in library
            </li>
            <li className="flex items-center gap-3 text-primary-foreground/90">
              <Check className="w-5 h-5 text-primary-foreground" />
              Create unlimited playlists
            </li>
            <li className="flex items-center gap-3 text-primary-foreground/90">
              <Check className="w-5 h-5 text-primary-foreground" />
              Share with friends
            </li>
          </ul>
        </div>

        {/* Right Panel (Login Form) */}
        <div className="bg-background rounded-2xl shadow-2xl p-8 flex flex-col justify-center min-h-120">
          <h3 className="text-xl font-semibold mb-1 text-foreground">Sign In</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Enter your credentials to access your account
          </p>
          {error && (
            <div className="bg-error-light border border-error/30 text-error px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User className="w-4 h-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className={`pl-10 ${errors.email ? "border-error" : "border-input"}`}
                  {...register("email")}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </span>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  className={`pl-10 ${errors.password ? "border-error" : "border-input"}`}
                  {...register("password")}
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-error mt-1">{errors.password.message}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="remember"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-border"
                    />
                  )}
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-secondary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground font-semibold">
              Sign In
            </Button>
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="mx-2 text-xs text-muted-foreground">Or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" aria-label="Sign in with Google">
                <Image
                  src="/icons/google-logo.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mx-auto"
                />
              </Button>
              <Button type="button" variant="outline" className="flex-1" aria-label="Sign in with Apple">
                <Image
                  src="/icons/apple-logo.svg"
                  alt="Apple"
                  width={20}
                  height={20}
                  className="mx-auto"
                />
              </Button>
            </div>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-secondary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}