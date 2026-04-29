const navigationItems = [
  {
    label: "Home",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3 11 9-7 9 7M5 10.5V20h5v-5h4v5h5v-9.5"
      />
    ),
  },
  {
    label: "Games",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 8.25h7.5v7.5h-7.5v-7.5ZM4.5 4.5h15v15h-15v-15ZM8.25 4.5v15M15.75 4.5v15M4.5 8.25h15M4.5 15.75h15"
      />
    ),
  },
  {
    label: "Analysis",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3"
      />
    ),
  },
  {
    label: "Practice",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 5v14m-7-7h14M7.5 7.5l9 9m0-9-9 9"
      />
    ),
  },
  {
    label: "AI Coach",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5 13.7 8l4.8 1.7-4.8 1.7L12 16l-1.7-4.6-4.8-1.7L10.3 8 12 3.5ZM18 15l.8 2.1L21 18l-2.2.9L18 21l-.8-2.1L15 18l2.2-.9L18 15Z"
      />
    ),
  },
  {
    label: "Calendar",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3v3m10-3v3M4.5 8.5h15M6 5h12a1.5 1.5 0 0 1 1.5 1.5V19A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19V6.5A1.5 1.5 0 0 1 6 5Z"
      />
    ),
  },
];

function Icon({ children }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      {children}
    </svg>
  );
}

export default function Sidebar({ activeItem, onActiveItemChange }) {
  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[#080a0e] px-4 py-5 text-slate-300 shadow-2xl shadow-black/30">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-950/40">
          <Icon>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 21h8M9 17h6l1-8h-2.5L12 4 10.5 9H8l1 8Z"
            />
          </Icon>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
            AURA CHESS
          </p>
          <p className="text-xs text-slate-500">Chess command center</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {navigationItems.map((item) => {
          const isActive = activeItem === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onActiveItemChange(item.label)}
              className={[
                "group relative flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-sm font-medium transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a0e]",
                isActive
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-300 shadow-inner shadow-purple-950/20"
                  : "text-slate-400 hover:bg-purple-500/10 hover:text-purple-300",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.8)]" />
              )}

              <span
                className={[
                  "grid h-9 w-9 shrink-0 place-items-center rounded-md transition-colors duration-200",
                  isActive
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-white/[0.03] text-slate-500 group-hover:text-purple-300",
                ].join(" ")}
              >
                <Icon>{item.icon}</Icon>
              </span>

              <span className="flex-1 text-left">{item.label}</span>

              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="group mt-6 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a0e]"
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple-300 to-fuchsia-400 text-sm font-bold text-slate-950">
          N
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">Neo Gambit</p>
          <p className="text-xs text-slate-500">Online</p>
        </div>

        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-slate-500 transition-colors duration-200 group-hover:text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </aside>
  );
}
