import ResetPasswordForm from "../_components/forms/reset-password-form";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token || "";

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 max-w-md text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Invalid Reset Link</h1>
          <p className="text-muted-foreground mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <a
            href="/forget-password"
            className="inline-block px-6 py-3 bg-linear-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Request New Link
          </a>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}
