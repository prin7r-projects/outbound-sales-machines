import { ForgotPasswordForm } from "wasp/client/auth";
import { AuthLayout } from "../AuthLayout";
import { Link } from "react-router-dom";

export function RequestPasswordResetPage() {
  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="font-mono text-lg font-bold text-bone">Reset password</h2>
        <p className="mt-1 font-mono text-xs text-slate">
          Enter your email to receive a reset link
        </p>
      </div>
      <ForgotPasswordForm />
      <div className="mt-6 border-t border-hairline pt-4">
        <span className="font-mono text-xs text-slate">
          {"Remember your password? "}
          <Link to="/login" className="text-signal hover:underline">
            Sign in
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
