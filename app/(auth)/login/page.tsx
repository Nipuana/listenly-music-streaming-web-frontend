import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoginForm from "@/components/forms/login-form";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}