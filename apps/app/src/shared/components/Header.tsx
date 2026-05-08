import { logout, useAuth } from "wasp/client/auth";
import { Link } from "wasp/client/router";
import { Button } from "./Button";

export function Header() {
  const { data: user } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-hairline bg-steel">
      <div className="flex w-full max-w-screen-xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-signal">
            <span className="font-mono text-xs font-bold text-white">SR</span>
          </div>
          <span className="font-mono text-sm font-bold uppercase tracking-wider text-bone">
            Saltrun
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/"
                className="font-mono text-xs uppercase tracking-wider text-slate hover:text-bone"
              >
                Dashboard
              </Link>
              <Link
                to="/domains"
                className="font-mono text-xs uppercase tracking-wider text-slate hover:text-bone"
              >
                Domains
              </Link>
              <Link
                to="/sequences"
                className="font-mono text-xs uppercase tracking-wider text-slate hover:text-bone"
              >
                Sequences
              </Link>
              <div className="h-4 w-px bg-hairline" />
              <span className="font-mono text-xs text-slate">
                {user.email}
              </span>
              <Button size="sm" variant="ghost" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-mono text-xs uppercase tracking-wider text-slate hover:text-bone"
              >
                Login
              </Link>
              <Link to="/signup" className="btn-primary text-xs">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
