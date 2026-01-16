"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Music, Check, User, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { handleLogin } from "@/lib/actions/auth-acitons";

const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const {register,handleSubmit,formState: { errors }} = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });
  const[error,setError]=useState("");
  async function onSubmit(data: LoginFormValues) {
    setError("");
    try{
      const result=await handleLogin(data);
      if(result.success){
        // Redirect or perform actions on successful login
        router.push("/dashboard");
      }else{
        setError(result.message || "Login failed");
      }
    }catch(err: Error | any){
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background">
      <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-8 p-6">
        {/* Left Panel */}
        <div className="bg-primary rounded-2xl shadow-2xl p-10 flex flex-col justify-between min-h-120">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20">
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
                <Checkbox id="remember" {...register("remember")} className="border-black" />
                Remember me
              </label>
              <Link href="#" className="text-sm text-secondary hover:underline">
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