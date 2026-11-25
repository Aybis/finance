import { useRef, useState } from 'react';
import { Check, Copy, Eye, EyeOff, Leaf, Snowflake, Wifi } from 'lucide-react';
import { KazaTooltip } from '@/components/atoms/InfoTooltip';
import { CARD_FINISHES } from '@/design-system/tokens';
import { cn } from '@/lib/utils';
import type { FinanceCard } from '@/types/finance';

interface CreditCardVisualProps {
  card: FinanceCard;
  flipped?: boolean;
  onToggleFlip?: () => void;
  interactiveTilt?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function CreditCardVisual({
  card,
  flipped = false,
  onToggleFlip,
  interactiveTilt = true,
  size = 'md',
  className,
}: CreditCardVisualProps) {
  const [revealNumber, setRevealNumber] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 30, hovering: false });
  const rafRef = useRef<number | null>(null);

  const finish = CARD_FINISHES[card.finish];
  const isDark = card.finish === 'obsidian';

  const formattedNumber = revealNumber
    ? card.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
    : `•••• ${card.cardNumber.slice(-4)}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(card.cardNumber).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactiveTilt || size === 'sm') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const ry = (x - 0.5) * 14;
    const rx = (0.5 - y) * 14;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTilt({ rx, ry, gx: x * 100, gy: y * 100, hovering: true });
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 30, hovering: false });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        'perspective-1000 relative select-none',
        size === 'sm' ? 'h-[206px] w-[142px]' : 'h-[252px] w-[176px]',
        className
      )}
    >
      {/* Subtle 60fps pointer tilt wrapper */}
      <div
        className="h-full w-full transition-transform duration-200 ease-out"
        style={{
          transform:
            interactiveTilt && size === 'md'
              ? `rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`
              : undefined,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <div
          onClick={onToggleFlip}
          role={onToggleFlip ? 'button' : undefined}
          tabIndex={onToggleFlip ? 0 : undefined}
          onKeyDown={
            onToggleFlip
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleFlip();
                  }
                }
              : undefined
          }
          aria-label={`${card.name} ending in ${card.cardNumber.slice(-4)}`}
          className={cn(
            'preserve-3d relative h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
            onToggleFlip && 'cursor-pointer',
            flipped && 'rotate-y-180'
          )}
          style={{ willChange: 'transform' }}
        >
          {/* FRONT FACE */}
          <div
            className="backface-hidden absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[20px] border p-4 shadow-[0_24px_44px_-16px_rgba(24,24,27,0.24)] transition-all duration-300"
            style={{
              background: finish.cardBackground,
              borderColor: finish.borderColor,
              color: finish.textColor,
            }}
          >
            {/* Silk metallic curved wave overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: finish.waveOverlay }}
            />
            {/* Dynamic 60fps pointer specular glare */}
            {interactiveTilt && size === 'md' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-200"
                style={{
                  opacity: tilt.hovering ? 0.55 : 0,
                  background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 60%)`,
                }}
              />
            )}

            <svg
              aria-hidden="true"
              viewBox="0 0 180 260"
              className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
              preserveAspectRatio="none"
            >
              <path
                d="M-20 80 C 45 45, 90 140, 195 95 L 195 265 L -20 265 Z"
                fill={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.34)'}
              />
              <path
                d="M-20 145 C 55 110, 110 195, 195 160 L 195 265 L -20 265 Z"
                fill={isDark ? 'rgba(0,0,0,0.22)' : 'rgba(180,165,140,0.16)'}
              />
            </svg>

            {/* Frozen overlay */}
            {card.frozen && (
              <div className="animate-kaza-overlay absolute inset-0 z-20 flex flex-col items-center justify-center gap-1.5 bg-sky-100/60 backdrop-blur-[3px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-sky-700 shadow-sm">
                  <Snowflake className="h-4 w-4" />
                </div>
                <span className="rounded-full bg-[#232325]/85 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                  FROZEN
                </span>
              </div>
            )}

            {/* Top Row: Credit Card & G Pay */}
            <div className="relative z-10 flex items-center justify-between">
              <span
                className="text-[10px] font-medium tracking-tight"
                style={{ color: finish.mutedTextColor }}
              >
                Credit Card
              </span>
              <KazaTooltip
                title="Google Pay Linked"
                content="Tokenized for instant tap-to-pay & one-tap Android/Chrome checkout."
              >
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold tracking-tight">
                  <span className="font-bold">G</span>
                  <span style={{ color: finish.mutedTextColor }}>Pay</span>
                </span>
              </KazaTooltip>
            </div>

            {/* Middle Right: NFC + Brushed EMV Chip */}
            <div className="relative z-10 flex flex-col items-end justify-center gap-2 pr-0.5">
              <KazaTooltip
                title="Contactless & EMV Chip"
                content={
                  card.security.contactless
                    ? 'NFC tap-to-pay is active on this card.'
                    : 'Contactless tap-to-pay is currently disabled in Security Settings.'
                }
              >
                <div className="flex flex-col items-end gap-2">
                  <Wifi
                    className="h-4 w-4 rotate-90 opacity-75"
                    style={{ color: finish.textColor }}
                  />
                  <div
                    className={cn(
                      'grid h-7 w-9 grid-cols-3 grid-rows-3 gap-[1.5px] rounded-[5px] border p-[2px] shadow-inner',
                      finish.chipTone === 'gold'
                        ? 'border-amber-200/40 bg-gradient-to-br from-amber-200/80 via-amber-300/70 to-amber-500/70'
                        : 'border-black/15 bg-gradient-to-br from-[#F4F4F5] via-[#D4D4D8] to-[#A1A1AA]'
                    )}
                  >
                    <span className="rounded-[1px] border border-black/15" />
                    <span className="rounded-[1px] border border-black/15" />
                    <span className="rounded-[1px] border border-black/15" />
                    <span className="col-span-3 rounded-[1px] border border-black/15" />
                    <span className="rounded-[1px] border border-black/15" />
                    <span className="rounded-[1px] border border-black/15" />
                    <span className="rounded-[1px] border border-black/15" />
                  </div>
                </div>
              </KazaTooltip>
            </div>

            {/* Bottom Row: Masked Number + Network */}
            <div className="relative z-10 flex items-end justify-between gap-1">
              <div className="space-y-0.5">
                <KazaTooltip
                  title="Card Number"
                  content={
                    revealNumber
                      ? 'Click to hide full 16-digit card number.'
                      : 'Click to reveal the full 16-digit card number.'
                  }
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRevealNumber((v) => !v);
                    }}
                    className="inline-flex items-center gap-1 text-left font-mono text-[10px] font-semibold tracking-wider opacity-90 hover:opacity-100 cursor-pointer"
                  >
                    <span>{formattedNumber}</span>
                  </button>
                </KazaTooltip>
                {revealNumber && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[8px] font-medium opacity-75 hover:opacity-100 cursor-pointer"
                  >
                    {copied ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
                    {copied ? 'Copied' : 'Copy number'}
                  </button>
                )}
              </div>

              {card.network === 'VISA' ? (
                <span className="text-[13px] font-extrabold italic tracking-tight">
                  VISA
                </span>
              ) : (
                <div className="flex items-center">
                  <span className="h-4 w-4 rounded-full bg-[#EB001B]/90" />
                  <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#F79E1B]/90" />
                </div>
              )}
            </div>
          </div>

          {/* BACK FACE */}
          <div
            className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[20px] border p-4 shadow-[0_24px_44px_-16px_rgba(24,24,27,0.24)]"
            style={{
              background: finish.cardBackground,
              borderColor: finish.borderColor,
              color: finish.textColor,
            }}
          >
            <div className="-mx-4 mt-2 h-8 bg-[#18181B]/90" />

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-white/80 px-2.5 py-1.5 text-[#18181B]">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[#71717A]">
                  CVV
                </span>
                <span className="font-mono text-xs font-bold">{card.cvv}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div>
                  <p className="text-[8px] uppercase" style={{ color: finish.mutedTextColor }}>
                    Cardholder
                  </p>
                  <p className="font-semibold">{card.holderName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase" style={{ color: finish.mutedTextColor }}>
                    Expires
                  </p>
                  <p className="font-mono font-semibold">{card.expiry}</p>
                </div>
              </div>
            </div>

            <div
              className="flex items-center justify-between border-t pt-2 text-[8px]"
              style={{ borderColor: finish.borderColor, color: finish.mutedTextColor }}
            >
              <span className="inline-flex items-center gap-1">
                <Leaf className="h-2.5 w-2.5" />
                100% Recycled
              </span>
              <span className="inline-flex items-center gap-0.5 font-medium">
                {revealNumber ? <EyeOff className="h-2.5 w-2.5" /> : <Eye className="h-2.5 w-2.5" />}
                Tap to flip
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
