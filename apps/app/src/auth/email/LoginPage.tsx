import { Link } from "react-router-dom";
import { LoginForm } from "wasp/client/auth";
import { AuthLayout } from "../AuthLayout";

export function LoginPage() {
  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="font-mono text-lg font-bold text-bone">Sign in</h2>
        <p className="mt-1 font-mono text-xs text-slate">
          Enter your email to receive a sign-in link
        </p>
      </div>
      <LoginForm />
      <div className="mt-6 border-t border-hairline pt-4">
        <span className="font-mono text-xs text-slate">
          {"Don't have an account? "}
          <Link to="/signup" className="text-signal hover:underline">
            Sign up
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
