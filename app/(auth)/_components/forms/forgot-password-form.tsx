"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Music, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useState } from "react";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/app/(auth)/utils/forgotPasswordSchema";
import { requestPasswordReset } from "@/lib/api/api-calls/auth";
import { toast } from "react-toastify";

export default function ForgotPasswordForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const response = await requestPasswordReset(data.email);
      if (response.success) {
        toast.success('Password reset link sent to your email.');
        setSubmittedEmail(data.email);
        setSuccess(true);
      } else {
        toast.error(response.message || 'Failed to request password reset.');
      }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to request password reset.');
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
          <p className="text-muted-foreground text-sm">Reset your account password</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
          {!success ? (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
                Forgot Password?
              </h1>
              <p className="text-muted-foreground text-sm mb-8 text-center">
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail className="w-5 h-5" />
                    </span>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className={`pl-12 h-12 rounded-xl border-2 ${
                        errors.email ? "border-error focus:border-error" : "border-gray-200 focus:border-secondary"
                      }`}
                      {...register("email")}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-error mt-2 ml-1">{errors.email.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-linear-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 text-sm text-secondary hover:text-secondary-hover font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>

              {/* Heading */}
              <h2 className="text-2xl font-bold text-primary mb-4">Check Your Email</h2>
              
              {/* Success Message */}
              <p className="text-muted-foreground text-sm mb-1">
                We've sent a password reset link to
              </p>
              <p className="text-primary font-semibold text-base mb-2">
                {submittedEmail}
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                Please check your inbox and follow the instructions.
              </p>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
                <p className="text-primary font-semibold text-sm mb-1">
                  Didn't receive the email?
                </p>
                <p className="text-muted-foreground text-xs">
                  Check your spam folder or wait a few minutes before trying again.
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  className="w-full h-12 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-semibold rounded-xl transition-all duration-200"
                >
                  Try Another Email
                </Button>
                
                <Link href="/login" className="block">
                  <Button 
                    variant="ghost"
                    className="w-full h-12 text-secondary hover:text-secondary-hover hover:bg-secondary/5 font-semibold rounded-xl transition-all duration-200"
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need more help?{" "}
            <Link href="/contact" className="text-secondary hover:text-secondary-hover font-medium hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
