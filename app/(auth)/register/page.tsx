import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <h1 className="text-4xl font-bold">
        Create Account
      </h1>

      <p className="mt-3 text-gray-600">
        Join PharmaEase and never miss your medicine refills.
      </p>

      <RegisterForm />
    </AuthLayout>
  );
}