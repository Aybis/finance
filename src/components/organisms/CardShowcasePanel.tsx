import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { ColorSwatch } from '@/components/atoms/ColorSwatch';
import { IconButton } from '@/components/atoms/IconButton';
import { InfoBadgeHint, KazaTooltip } from '@/components/atoms/InfoTooltip';
import { StatusPill } from '@/components/atoms/StatusPill';
import { CreditCardVisual } from '@/components/molecules/CreditCardVisual';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CARD_FINISH_ORDER } from '@/design-system/tokens';
import { useFinance } from '@/store/FinanceContext';

export function CardShowcasePanel() {
  const {
    state,
    selectedCard,
    selectCard,
    setCardFinish,
    setPrimaryCard,
  } = useFinance();
  const [flipped, setFlipped] = useState(false);

  const cards = state.cards;
  const activeIdx = Math.max(
    0,
    cards.findIndex((c) => c.id === selectedCard.id)
  );
  const prevCard = cards[(activeIdx - 1 + cards.length) % cards.length];
  const nextCard = cards[(activeIdx + 1) % cards.length];
  const outerPrevCard = cards[(activeIdx - 2 + cards.length) % cards.length];
  const outerNextCard = cards[(activeIdx + 2) % cards.length];

  const handleCycle = (dir: -1 | 1) => {
    const nextIndex = (activeIdx + dir + cards.length) % cards.length;
    setFlipped(false);
    selectCard(cards[nextIndex].id);
  };

  return (
    <Card className="@container flex h-full flex-col justify-center gap-4 px-4 py-5 sm:px-5">
      {/* Header Title & Tier Fee */}
      <div className="space-y-1 text-center">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-[20px] font-semibold tracking-tight text-[#18181B]">
            {selectedCard.name}
          </h2>
          {selectedCard.frozen && (
            <KazaTooltip
              title="Card Frozen"
              content="All new card authorizations are paused until you unfreeze this card."
            >
              <span>
                <StatusPill tone="frozen">Frozen</StatusPill>
              </span>
            </KazaTooltip>
          )}
          <InfoBadgeHint
            title={`${selectedCard.tier} Card Studio`}
            content="Switch cards using the carousel, customize recycled metallic finishes, or tap the card to inspect CVV & expiry."
          />
        </div>
        <KazaTooltip
          title="Annual Membership Fee"
          content={`Includes global zero-FX travel spend, purchase protection, and ${selectedCard.tier} reward tiers.`}
        >
          <p className="inline-block tabular-nums text-[15px] font-medium text-[#18181B] cursor-help">
            ${selectedCard.annualFee}{' '}
            <span className="text-xs font-normal text-[#71717A]">/ year</span>
          </p>
        </KazaTooltip>
      </div>

      {/* Flanking Labels */}
      <div className="mx-auto flex w-full max-w-[336px] items-center justify-between px-1 text-[10px]">
        <KazaTooltip content={`Switch carousel focus to ${prevCard.name}`}>
          <button
            type="button"
            onClick={() => handleCycle(-1)}
            className="kaza-tactile group flex items-center gap-1 text-left text-[#71717A] hover:text-[#18181B] cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-x-0.5 group-hover:opacity-100" />
            <div>
              <p className="font-semibold text-[#18181B]">{prevCard.name}</p>
              <p className="tabular-nums text-[9px] text-[#A1A1AA]">
                ${prevCard.annualFee} / year
              </p>
            </div>
          </button>
        </KazaTooltip>

        <KazaTooltip content={`Switch carousel focus to ${nextCard.name}`}>
          <button
            type="button"
            onClick={() => handleCycle(1)}
            className="kaza-tactile group flex items-center gap-1 text-right text-[#71717A] hover:text-[#18181B] cursor-pointer"
          >
            <div>
              <p className="font-semibold text-[#18181B]">{nextCard.name}</p>
              <p className="tabular-nums text-[9px] text-[#A1A1AA]">
                ${nextCard.annualFee} / year
              </p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
          </button>
        </KazaTooltip>
      </div>

      {/* Center-Anchored Tight Overlapping Card Deck */}
      <div className="relative flex h-[272px] w-full items-center justify-center overflow-hidden">
        {/* Outer subtle depth card — left */}
        {cards.length > 1 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden -translate-x-[calc(50%+74px)] -translate-y-1/2 scale-[0.80] opacity-55 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] @xs:block"
          >
            <CreditCardVisual card={outerPrevCard} interactiveTilt={false} size="md" />
          </div>
        )}

        {/* Outer subtle depth card — right */}
        {cards.length > 1 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden -translate-x-[calc(50%-74px)] -translate-y-1/2 scale-[0.80] opacity-55 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] @xs:block"
          >
            <CreditCardVisual card={outerNextCard} interactiveTilt={false} size="md" />
          </div>
        )}

        {/* Immediate left peeking card */}
        {cards.length > 1 && (
          <div
            onClick={() => handleCycle(-1)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCycle(-1)}
            aria-label={`Switch to ${prevCard.name}`}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-[calc(50%+44px)] -translate-y-1/2 scale-[0.90] opacity-90 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-x-[calc(50%+56px)] hover:opacity-100 cursor-pointer"
          >
            <CreditCardVisual card={prevCard} interactiveTilt={false} size="md" />
          </div>
        )}

        {/* Immediate right peeking card */}
        {cards.length > 1 && (
          <div
            onClick={() => handleCycle(1)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCycle(1)}
            aria-label={`Switch to ${nextCard.name}`}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-[calc(50%-44px)] -translate-y-1/2 scale-[0.90] opacity-90 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-x-[calc(50%-56px)] hover:opacity-100 cursor-pointer"
          >
            <CreditCardVisual card={nextCard} interactiveTilt={false} size="md" />
          </div>
        )}

        {/* Focal Center Card */}
        <div key={selectedCard.id} className="animate-kaza-card-in relative z-20">
          <CreditCardVisual
            card={selectedCard}
            flipped={flipped}
            onToggleFlip={() => setFlipped((v) => !v)}
          />
        </div>
      </div>

      {/* Color Swatches & Eco Copy */}
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2.5">
          {CARD_FINISH_ORDER.map((finish) => (
            <ColorSwatch
              key={finish}
              finish={finish}
              selected={selectedCard.finish === finish}
              onClick={() => setCardFinish(selectedCard.id, finish)}
            />
          ))}
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-[#18181B]">
            Choose the color of your card!
          </p>
          <p className="mx-auto max-w-[230px] text-[10px] leading-relaxed text-[#71717A]">
            Our cards are made of recycled materials that you can provide us
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <KazaTooltip
          title="Flip Card"
          content="Rotate card in 3D to view security CVV, cardholder name, and expiration date."
        >
          <IconButton
            variant="light"
            aria-label="Flip card to inspect CVV"
            onClick={() => setFlipped((v) => !v)}
            className="kaza-tactile"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </IconButton>
        </KazaTooltip>

        <KazaTooltip
          title={selectedCard.isPrimary ? 'Primary Payment Card' : 'Set as Primary Card'}
          content="Make this card your default checkout and Google Pay funding source."
        >
          <Button
            variant={selectedCard.isPrimary ? 'default' : 'outline'}
            onClick={() => setPrimaryCard(selectedCard.id)}
            className="kaza-tactile h-9 min-w-[144px] px-5 text-[11px] font-semibold"
          >
            {selectedCard.isPrimary
              ? `Active: ${selectedCard.tier}`
              : `Choose ${selectedCard.tier}`}
          </Button>
        </KazaTooltip>

        <KazaTooltip
          title="Confirm Selection"
          content="Save current finish and set this card active for payments."
        >
          <IconButton
            variant="light"
            aria-label="Confirm card selection"
            onClick={() => setPrimaryCard(selectedCard.id)}
            className="kaza-tactile"
          >
            <Check className="h-3.5 w-3.5" />
          </IconButton>
        </KazaTooltip>
      </div>
    </Card>
  );
}
