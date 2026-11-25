import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useFinance } from '@/store/FinanceContext';
import { cn } from '@/lib/utils';

export function ToastViewport() {
  const { toasts, dismissToast } = useFinance();
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[60] flex w-full max-w-xs flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'animate-kaza-toast flex items-start gap-2.5 rounded-2xl border px-3.5 py-2.5 text-white shadow-xl backdrop-blur-md',
            toast.variant === 'destructive'
              ? 'border-red-500/40 bg-red-950/95'
              : toast.variant === 'warning'
                ? 'border-amber-500/40 bg-zinc-900/95'
                : 'border-white/10 bg-[#232325]/95'
          )}
        >
          <span className="mt-0.5 shrink-0">
            {toast.variant === 'destructive' || toast.variant === 'warning' ? (
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            ) : toast.variant === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <Info className="h-4 w-4 text-zinc-300" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-[11px] text-zinc-300">{toast.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
