import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "../lib/cn";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  labelId: string;
  children: ReactNode;
  panelClassName?: string;
}

export function Modal({ open, onClose, labelId, children, panelClassName }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6">
      {onClose ? (
        <button
          type="button"
          aria-label="Close dialog"
          className="absolute inset-0 cursor-default bg-forest/55 backdrop-blur-[3px]"
          onClick={onClose}
        />
      ) : (
        <div className="absolute inset-0 bg-forest/55 backdrop-blur-[3px]" />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className={cn(
          "relative w-full max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[2rem] border border-white/70 bg-[#fbf7ed] text-forest shadow-[0_30px_80px_rgba(15,38,28,0.42)] animate-sheet-in",
          panelClassName,
        )}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/75 text-forest/55 shadow-sm backdrop-blur transition hover:bg-white hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
