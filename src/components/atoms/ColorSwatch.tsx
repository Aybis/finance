import { KazaTooltip } from '@/components/atoms/InfoTooltip';
import { CARD_FINISHES } from '@/design-system/tokens';
import { cn } from '@/lib/utils';
import type { CardFinish } from '@/types/finance';

interface ColorSwatchProps {
  finish: CardFinish;
  selected?: boolean;
  onClick?: () => void;
}

export function ColorSwatch({ finish, selected = false, onClick }: ColorSwatchProps) {
  const spec = CARD_FINISHES[finish];

  return (
    <KazaTooltip title={spec.label} content={spec.description}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Select ${spec.label} finish`}
        aria-pressed={selected}
        className={cn(
          'kaza-tactile relative flex h-6 w-6 items-center justify-center rounded-full cursor-pointer',
          selected
            ? 'scale-105 ring-2 ring-[#232325] ring-offset-2 ring-offset-[#FBFBFB]'
            : 'ring-1 ring-black/10 hover:scale-110'
        )}
        style={{ background: spec.swatchGradient }}
      >
        <span className="sr-only">{spec.label}</span>
      </button>
    </KazaTooltip>
  );
}
