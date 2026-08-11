import AuthLayout from "@/components/auth/AuthLayout";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <h1 className="text-4xl font-bold">
        Forgot Password
      </h1>

      <p className="mt-3 text-gray-600">
        Enter your email address and we will send you a password reset link.
      </p>

      <div className="mt-8 space-y-6">
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="Enter your email"
        />

        <AuthButton title="Send Reset Link" />
      </div>
    </AuthLayout>
  );
}