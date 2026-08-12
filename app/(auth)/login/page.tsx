import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>

      <h1 className="text-4xl font-bold">

        Welcome Back 👋

      </h1>

      <p className="mt-3 text-gray-600">

        Sign in to continue your healthcare journey.

      </p>

      <LoginForm />

    </AuthLayout>
  );
}