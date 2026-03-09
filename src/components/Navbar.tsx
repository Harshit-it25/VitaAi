import { HeartPulse } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center px-6 justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-500 p-2 rounded-xl">
          <HeartPulse className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">VitaAI</h1>
          <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Healthcare AI Assistant</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-slate-600 uppercase tracking-tighter">System Online</span>
        </div>
      </div>
    </nav>
  );
}
