export default function Practice() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-xl shadow-black/10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300">
          <svg
            aria-hidden="true"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14m-7-7h14M7.5 7.5l9 9m0-9-9 9"
            />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-white">Practice</h1>
        <p className="mt-2 text-sm text-slate-400">Practice page coming soon.</p>
      </div>
    </section>
  );
}
