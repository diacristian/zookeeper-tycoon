import { Check, CircleAlert, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export type NoticeTone = "info" | "success" | "error";

export interface NoticeMessage {
  id: number;
  message: string;
  tone: NoticeTone;
}

interface NoticeProps {
  notice: NoticeMessage | null;
}

export function Notice({ notice }: NoticeProps) {
  if (!notice) return null;

  const Icon = notice.tone === "success" ? Check : notice.tone === "error" ? CircleAlert : Sparkles;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[70] flex justify-center px-4">
      <div
        key={notice.id}
        role="status"
        aria-live="polite"
        className={cn(
          "flex max-w-md items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm font-bold shadow-[0_18px_45px_rgba(15,38,28,0.28)] backdrop-blur-md animate-toast-in",
          notice.tone === "success" && "border-emerald-300/40 bg-emerald-900 text-emerald-50",
          notice.tone === "error" && "border-red-300/40 bg-red-900 text-red-50",
          notice.tone === "info" && "border-white/20 bg-forest text-cream",
        )}
      >
        <span
          className={cn(
            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
            notice.tone === "success" && "bg-emerald-400 text-emerald-950",
            notice.tone === "error" && "bg-red-400 text-red-950",
            notice.tone === "info" && "bg-amber-300 text-forest",
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
        </span>
        <span className="leading-snug">{notice.message}</span>
      </div>
    </div>
  );
}
