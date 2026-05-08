import { Link } from "react-router-dom";
import { VerifyEmailForm } from "wasp/client/auth";
import { AuthLayout } from "../AuthLayout";

export function EmailVerificationPage() {
  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="font-mono text-lg font-bold text-bone">Verify email</h2>
        <p className="mt-1 font-mono text-xs text-slate">
          Check your inbox for the verification link
        </p>
      </div>
      <VerifyEmailForm />
      <div className="mt-6 border-t border-hairline pt-4">
        <span className="font-mono text-xs text-slate">
          {"Verified? "}
          <Link to="/login" className="text-signal hover:underline">
            Sign in
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
