"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Music } from "lucide-react";
import { FaUser, FaEnvelope, FaKey } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../ui/dropdown-menu";

const registerSchema = z.object({
    name: z.string().min(2, "Full name is required"),
    email: z.email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    accountType: z.string().min(1, "Select account type"),
    agree: z.literal(true, { message: "You must agree to the terms" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            accountType: "",
            agree: true,
        },
    });

    function onSubmit(data: RegisterFormValues) {
        // Handle registration logic here
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-background">
            <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-8 p-6">
                {/* Left Panel (Form) */}
                <div className="bg-background rounded-2xl shadow-2xl p-10 flex flex-col justify-center min-h-120">
                    <h3 className="text-xl font-semibold mb-1 text-foreground">Create Account</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                        Join Listenly and start your music journey
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="name">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <FaUser size={16} />
                                </span>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Your full name"
                                    className={`pl-10 ${errors.name ? "border-error" : "border-input"}`}
                                    {...register("name")}
                                    autoComplete="name"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-error mt-1">{errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <FaEnvelope size={16} />
                                </span>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@email.com"
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
                                    <FaKey size={16} />
                                </span>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="********"
                                    className={`pl-10 ${errors.password ? "border-error" : "border-input"}`}
                                    {...register("password")}
                                    autoComplete="new-password"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-error mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <FaKey size={16} />
                                </span>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="********"
                                    className={`pl-10 ${errors.confirmPassword ? "border-error" : "border-input"}`}
                                    {...register("confirmPassword")}
                                    autoComplete="new-password"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="accountType">
                                Account Type
                            </label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={`w-full justify-between ${errors.accountType ? "border-error" : "border-input"}`}
                                        id="accountType"
                                    >
                                        {(() => {
                                            const value = (typeof window !== "undefined"
                                                ? (document.querySelector('input[name="accountType"]') as HTMLInputElement | null)?.value
                                                : undefined) || "";
                                            if (value === "listener") return "Listener";
                                            if (value === "artist") return "Artist";
                                            return "Select account type";
                                        })()}
                                        <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-full min-w-50">
                                    <DropdownMenuItem onSelect={() => {
                                        // @ts-ignore
                                        document.querySelector('input[name="accountType"]').value = "listener";
                                        // @ts-ignore
                                        document.querySelector('input[name="accountType"]').dispatchEvent(new Event('input', { bubbles: true }));
                                    }}>
                                        Listener
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => {
                                        // @ts-ignore
                                        document.querySelector('input[name="accountType"]').value = "artist";
                                        // @ts-ignore
                                        document.querySelector('input[name="accountType"]').dispatchEvent(new Event('input', { bubbles: true }));
                                    }}>
                                        Artist
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <input
                                type="hidden"
                                {...register("accountType")}
                            />
                            {errors.accountType && (
                                <p className="text-xs text-error mt-1">{errors.accountType.message}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="agree" {...register("agree")} className="border-black" />
                            <label htmlFor="agree" className="text-sm text-foreground select-none">
                                I agree to the
                                <Link href="#" className="text-secondary underline mx-1">Terms of Service</Link>
                                and
                                <Link href="#" className="text-secondary underline mx-1">Privacy Policy</Link>
                            </label>
                        </div>
                        {errors.agree && (
                            <p className="text-xs text-error mt-1">{errors.agree.message}</p>
                        )}
                        <Button type="submit" className="w-full bg-primary text-primary-foreground font-semibold mt-2">
                            Create Account
                        </Button>
                        <div className="flex items-center my-2">
                            <div className="flex-1 h-px bg-border" />
                            <span className="mx-2 text-xs text-muted-foreground">Or sign up with</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" className="flex-1" aria-label="Sign up with Google">
                                <Image src="/icons/google-logo.svg" alt="Google" width={20} height={20} className="mx-auto" />
                            </Button>
                            <Button type="button" variant="outline" className="flex-1" aria-label="Sign up with Apple">
                                <Image src="/icons/apple-logo.svg" alt="Apple" width={20} height={20} className="mx-auto" />
                            </Button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-secondary hover:underline">Sign in</Link>
                    </p>
                </div>
                {/* Right Panel (Info) */}
                <div className="bg-primary rounded-2xl shadow-2xl p-10 flex flex-col justify-center min-h-120 text-primary-foreground">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20">
                            <Music className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold">Listenly</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Start Your Journey</h2>
                    <p className="mb-8">Join millions of music lovers and discover your next favorite song today.</p>
                    <div className="space-y-4">
                        <div className="rounded-xl bg-white/10 p-4 flex items-center gap-4">
                            <span className="text-2xl">🎵</span>
                            <div>
                                <div className="font-semibold">Unlimited Music</div>
                                <div className="text-sm">Access millions of songs from all genres and eras</div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white/10 p-4 flex items-center gap-4">
                            <span className="text-2xl">📝</span>
                            <div>
                                <div className="font-semibold">Custom Playlists</div>
                                <div className="text-sm">Create and share personalized playlists with friends</div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white/10 p-4 flex items-center gap-4">
                            <span className="text-2xl">📊</span>
                            <div>
                                <div className="font-semibold">For Artists</div>
                                <div className="text-sm">Get verified and access detailed analytics dashboard</div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white/10 p-4 flex items-center gap-4">
                            <span className="text-2xl">🔒</span>
                            <div>
                                <div className="font-semibold">Secure Platform</div>
                                <div className="text-sm">Your data is encrypted and protected</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}