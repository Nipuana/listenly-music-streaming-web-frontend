"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Music, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useState } from "react";
import { ResetPasswordFormValues, resetPasswordSchema } from "@/app/(auth)/utils/resetPasswordSchema";
import { handleResetPassword } from "@/lib/actions/auth-acitons";
import { toast } from "react-toastify";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const response = await handleResetPassword(token, data.password);
      if (response.success) {
        toast.success("Password reset successfully");
        // Redirect to login page
        router.replace('/login');
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      // Handle error
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-linear-to-br from-primary to-secondary shadow-lg">
              <Music className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Listenly
            </span>
          </div>
          <p className="text-muted-foreground text-sm">Create a new secure password</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
          <h1 className="text-2xl font-bold text-primary mb-2 text-center">
            Set New Password
          </h1>
          <p className="text-muted-foreground text-sm mb-8 text-center">
            Your new password must be different from previous passwords.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary" htmlFor="password">
                New Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-12 pr-12 h-12 rounded-xl border-2 ${
                    errors.password ? "border-error focus:border-error" : "border-gray-200 focus:border-secondary"
                  }`}
                  {...register("password")}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error mt-2 ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-12 pr-12 h-12 rounded-xl border-2 ${
                    errors.confirmPassword ? "border-error focus:border-error" : "border-gray-200 focus:border-secondary"
                  }`}
                  {...register("confirmPassword")}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-error mt-2 ml-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-linear-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Remembered it?{" "}
              <Link 
                href="/login" 
                className="text-secondary hover:text-secondary-hover font-semibold hover:underline transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
