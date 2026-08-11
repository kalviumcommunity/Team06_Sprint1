import AuthLayout from "@/components/auth/AuthLayout";
import AuthButton from "@/components/auth/AuthButton";
import PasswordInput from "@/components/auth/PasswordInput";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <h1 className="text-4xl font-bold">
        Reset Password
      </h1>

      <p className="mt-3 text-gray-600">
        Create a new password for your PharmaEase account.
      </p>

      <div className="mt-8 space-y-6">
        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm password"
        />

        <AuthButton title="Reset Password" />
      </div>
    </AuthLayout>
  );
}