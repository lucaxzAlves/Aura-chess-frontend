import Sidebar from "../components/Sidebar.jsx";

export default function MainLayout({
  activeItem,
  onActiveItemChange,
  children,
  fullBleed = false,
}) {
  return (
    <div className="flex min-h-screen bg-[#0b0f16] text-slate-100">
      <Sidebar activeItem={activeItem} onActiveItemChange={onActiveItemChange} />

      <main
        className={[
          "flex-1",
          fullBleed ? "min-h-screen overflow-hidden bg-[#0f0f14] p-0" : "overflow-y-auto p-8",
        ].join(" ")}
      >
        {children}
      </main>
    </div>
  );
}
