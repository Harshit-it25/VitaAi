import { motion } from "motion/react";
import { cn } from "@/src/lib/utils.ts";
import { User, Bot, Activity } from "lucide-react";
import { Message } from "../types.ts";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full gap-3 mb-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
          isUser ? "bg-slate-900 text-white" : "bg-emerald-500 text-white"
        )}
      >
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>

      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
            isUser
              ? "bg-slate-900 text-white rounded-tr-none"
              : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
          )}
        >
          {message.text}
        </div>

        {!isUser && message.metadata && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.metadata.intent && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-[10px] font-semibold text-slate-600 rounded-full border border-slate-200 uppercase tracking-wider">
                <Activity size={10} />
                Intent: {message.metadata.intent.replace("_", " ")}
              </span>
            )}
            {message.metadata.topic && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-[10px] font-semibold text-emerald-700 rounded-full border border-emerald-100 uppercase tracking-wider">
                Topic: {message.metadata.topic}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
