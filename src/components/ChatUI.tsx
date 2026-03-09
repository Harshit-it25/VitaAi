import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, Trash2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { motion, AnimatePresence } from "motion/react";
import { Message } from "../types.ts";
import { processChatMessageFrontend } from "../services/aiService.ts";

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      if (response.ok) {
        const history = await response.json();
        if (history.length === 0) {
          setMessages([
            {
              id: "welcome",
              text: "Hello! I am VitaAI, your healthcare assistant. How can I help you today?",
              sender: "bot",
            },
          ]);
        } else {
          setMessages(history.map((m: any) => ({
            id: m.id,
            text: m.text,
            sender: m.sender,
            metadata: m.intent ? {
              intent: m.intent,
              topic: m.topic,
              language: m.language
            } : undefined
          })));
        }
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const clearHistory = async () => {
    if (!confirm("Are you sure you want to clear your chat history?")) return;
    try {
      await fetch("/api/history", { method: "DELETE" });
      setMessages([
        {
          id: "welcome",
          text: "History cleared. How can I help you today?",
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 1. Save user message to DB
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMsg),
      });

      // 2. Process with Gemini on Frontend
      const data = await processChatMessageFrontend(input);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "bot",
        metadata: data.metadata,
      };

      // 3. Save AI response to DB
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...botMsg,
          intent: botMsg.metadata?.intent,
          topic: botMsg.metadata?.topic,
          language: botMsg.metadata?.language
        }),
      });

      setMessages((prev) => [...prev, botMsg]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message || "I encountered an error processing your request."}`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
      {/* Header Info */}
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">RAG-Powered Knowledge Retrieval</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={clearHistory}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            title="Clear History"
          >
            <Trash2 size={14} />
          </button>
          <div className="text-[10px] text-slate-400 font-mono">v1.1.0-PROD</div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <div key={msg.id}>
              <MessageBubble message={msg} />
            </div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mb-6"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <span className="text-sm text-slate-500 italic">Analyzing intent & retrieving context...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about symptoms, treatments, or prevention..."
            className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 pr-16 text-sm focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400 text-slate-900"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-200"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-3 text-[10px] text-center text-slate-400 font-medium uppercase tracking-tighter">
          This AI provides information based on a medical knowledge base. Always consult a professional.
        </p>
      </div>
    </div>
  );
}
