import { CheckCircle2, Rocket } from 'lucide-react';
import { KazaTooltip } from '@/components/atoms/InfoTooltip';
import { cn } from '@/lib/utils';

interface ProUpgradeCardProps {
  isPro?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export function ProUpgradeCard({
  isPro = false,
  compact = false,
  onClick,
}: ProUpgradeCardProps) {
  const tooltipText = isPro
    ? 'Kaza Pro is active: 2x rewards, 0% coin swap fees, and unlimited virtual cards.'
    : 'Unlock 2x cashback, 0% FX & crypto swaps, and brushed aluminum cards ($12/mo).';

  if (compact) {
    return (
      <KazaTooltip title={isPro ? 'Kaza Pro Active' : 'Kaza Pro'} content={tooltipText} side="right">
        <button
          type="button"
          onClick={onClick}
          className="kaza-tactile flex h-10 w-10 items-center justify-center rounded-2xl border border-[#F0D9C8] bg-gradient-to-br from-[#FFF9F4] to-[#F7DEC8] text-[#18181B] shadow-2xs hover:scale-105 cursor-pointer"
        >
          {isPro ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Rocket className="h-4 w-4" />}
        </button>
      </KazaTooltip>
    );
  }

  return (
    <KazaTooltip title={isPro ? 'Kaza Pro Active' : 'Upgrade to Kaza Pro'} content={tooltipText} side="right">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'kaza-tactile group relative w-full overflow-hidden rounded-[18px] border p-3.5 text-left hover:-translate-y-0.5 hover:shadow-md cursor-pointer',
          isPro
            ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-teal-50'
            : 'border-[#EAEAEF] bg-white'
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-80 blur-[1px] transition-transform duration-500 ease-out group-hover:scale-115"
          style={{
            background: isPro
              ? 'radial-gradient(circle at 40% 40%, #A7F3D0 0%, #6EE7B7 45%, rgba(255,255,255,0) 75%)'
              : 'radial-gradient(circle at 40% 40%, #FDE2C8 0%, #F5B58B 48%, rgba(255,255,255,0) 75%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-5 right-3 h-16 w-16 rounded-full opacity-60"
          style={{
            background: isPro
              ? 'radial-gradient(circle, #D1FAE5 0%, rgba(255,255,255,0) 70%)'
              : 'radial-gradient(circle, #F9CAA7 0%, rgba(255,255,255,0) 70%)',
          }}
        />

        <div className="relative z-10 max-w-[78%] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#18181B]">
            <span>{isPro ? 'Pro Active' : 'Pro'}</span>
            {isPro ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <span role="img" aria-label="rocket" className="text-xs">
                🚀
              </span>
            )}
          </div>
          <p className="text-[10px] leading-[1.35] text-[#71717A]">
            {isPro
              ? '2x cashback & unlimited cards active'
              : 'Everything you need for smart personal finance'}
          </p>
        </div>
      </button>
    </KazaTooltip>
  );
}
