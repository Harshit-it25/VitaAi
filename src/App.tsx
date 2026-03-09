import { Navbar } from "./components/Navbar.tsx";
import { ChatUI } from "./components/ChatUI.tsx";
import { motion } from "motion/react";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 h-screen flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 max-h-[800px] w-full max-w-5xl mx-auto"
        >
          <ChatUI />
        </motion.div>
        
        <footer className="mt-8 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
          &copy; 2026 VitaAI &bull; Built with Google Gemini & LangChain
        </footer>
      </main>
    </div>
  );
}
