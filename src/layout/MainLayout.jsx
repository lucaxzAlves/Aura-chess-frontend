import Sidebar from "../components/Sidebar.jsx";

export default function MainLayout({ activeItem, onActiveItemChange, children }) {
  return (
    <div className="flex min-h-screen bg-[#0b0f16] text-slate-100">
      <Sidebar activeItem={activeItem} onActiveItemChange={onActiveItemChange} />

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
