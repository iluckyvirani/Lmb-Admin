import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/data/auth";
import { ROLE_LABEL } from "@/data/platform";
import { ErrorBanner, LoadingBlock } from "@/components/ui/States";

export function LoginPage() {
  const { user, ready, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from: string }).from !== "/login"
      ? (location.state as { from: string }).from
      : "/";

  const [email, setEmail] = useState("anika@lmb.demo");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingBlock label="Loading…" />
      </div>
    );
  }

  if (user) return <Navigate to={from} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,162,39,0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(201,162,39,0.08), transparent)",
        }}
      />

      <div className="relative w-full max-w-md border border-white/10 bg-background-secondary/90 p-8 shadow-2xl backdrop-blur">
        <p className="text-[11px] tracking-[0.3em] text-gold uppercase">
          LMB Admin
        </p>
        <h1 className="mt-3 font-heading text-3xl text-white">Sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Control panel for products, bookings, and Rocket shipping.
        </p>

        {error && (
          <div className="mt-5">
            <ErrorBanner message={error} />
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-xs text-muted">
            Email
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-gold/50"
            />
          </label>
          <label className="block text-xs text-muted">
            Password
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-white/10 bg-white/[0.04] px-3 py-2.5 pr-11 text-sm text-white outline-none focus:border-gold/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-1 text-muted hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer bg-gold py-3 text-xs font-medium tracking-wide text-background uppercase hover:bg-gold-accent disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-[11px] tracking-wide text-muted uppercase">
            Demo accounts · password{" "}
            <span className="text-gold">{DEMO_PASSWORD}</span>
          </p>
          <ul className="mt-3 space-y-1.5 text-xs text-muted">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.email}>
                <button
                  type="button"
                  className="cursor-pointer text-left hover:text-gold"
                  onClick={() => {
                    setEmail(a.email);
                    setPassword(DEMO_PASSWORD);
                    setError(null);
                  }}
                >
                  {a.email}{" "}
                  <span className="text-white/40">
                    ({ROLE_LABEL[a.role]})
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
