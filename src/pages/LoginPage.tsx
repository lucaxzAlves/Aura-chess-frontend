import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

type Mode = "login" | "register";

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const title = useMemo(() => (mode === "login" ? "Entrar" : "Criar conta"), [mode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await login({ email: email.trim(), password });
      } else {
        await register({ name: name.trim(), email: email.trim(), password });
      }

      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Erro inesperado";
      if (message.toLowerCase().includes("401") || message.toLowerCase().includes("invál")) {
        setError("Email ou senha inválidos");
        return;
      }
      setError(message);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f0f14] p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_55%)]" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-purple-500/20 bg-[#171720] p-6 shadow-2xl">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {mode === "login"
            ? "Acesse sua conta para continuar."
            : "Crie sua conta para começar a usar a plataforma."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" && (
            <label className="grid gap-2 text-sm">
              <span className="text-slate-300">Nome</span>
              <input
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                disabled={loading}
                className="pointer-events-auto rounded-xl border border-white/10 bg-white px-3 py-2 text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:opacity-60"
              />
            </label>
          )}

          <label className="grid gap-2 text-sm">
            <span className="text-slate-300">Email</span>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
              className="pointer-events-auto rounded-xl border border-white/10 bg-white px-3 py-2 text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:opacity-60"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-slate-300">Senha</span>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="pointer-events-auto rounded-xl border border-white/10 bg-white px-3 py-2 text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:opacity-60"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-60"
          >
            {loading ? "Carregando..." : title}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setError("");
            setMode((prev) => (prev === "login" ? "register" : "login"));
          }}
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-purple-400/60 hover:text-white"
        >
          {mode === "login" ? "Criar conta" : "Já tenho conta"}
        </button>
      </div>
    </section>
  );
}
