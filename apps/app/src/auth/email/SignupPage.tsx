import { Link } from "react-router-dom";
import { SignupForm } from "wasp/client/auth";
import { AuthLayout } from "../AuthLayout";

export function SignupPage() {
  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="font-mono text-lg font-bold text-bone">Create account</h2>
        <p className="mt-1 font-mono text-xs text-slate">
          Enter your email to get started with Saltrun
        </p>
      </div>
      <SignupForm
        additionalFields={[
          {
            name: "username",
            type: "input",
            label: "Email",
            validations: {
              required: "Email is required",
            },
          },
        ]}
      />
      <div className="mt-6 border-t border-hairline pt-4">
        <span className="font-mono text-xs text-slate">
          {"Already have an account? "}
          <Link to="/login" className="text-signal hover:underline">
            Sign in
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
