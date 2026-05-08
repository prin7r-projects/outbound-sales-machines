import { Link } from "react-router-dom";
import { ResetPasswordForm } from "wasp/client/auth";
import { AuthLayout } from "../AuthLayout";

export function PasswordResetPage() {
  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="font-mono text-lg font-bold text-bone">Set new password</h2>
        <p className="mt-1 font-mono text-xs text-slate">
          Choose a new password for your account
        </p>
      </div>
      <ResetPasswordForm />
      <div className="mt-6 border-t border-hairline pt-4">
        <span className="font-mono text-xs text-slate">
          {"Done? "}
          <Link to="/login" className="text-signal hover:underline">
            Sign in
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
