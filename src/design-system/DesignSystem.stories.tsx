import type { Meta, StoryObj } from '@storybook/react';
import { CARD_FINISHES, CARD_FINISH_ORDER, KAZA_COLORS, KAZA_RADII } from './tokens';

function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] p-8 text-[#18181B]">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-2 border-b border-[#EAEAEF] pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71717A]">
            Kaza Design System v1.0
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Monochrome Tactile Finance &amp; Card Studio
          </h1>
          <p className="max-w-2xl text-sm text-[#71717A]">
            High-clarity neutral surfaces, crisp tabular numerals, charcoal ink active states,
            60fps GPU-composited motion, and pearlescent metallic card finishes built with Tailwind CSS v4 and Radix primitives.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Color Tokens</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {Object.entries(KAZA_COLORS).map(([name, hex]) => (
              <div
                key={name}
                className="rounded-2xl border border-[#EAEAEF] bg-white p-3 shadow-xs"
              >
                <div
                  className="mb-2.5 h-12 w-full rounded-xl border border-black/5"
                  style={{ backgroundColor: hex }}
                />
                <div className="text-xs font-semibold text-[#18181B]">{name}</div>
                <div className="font-mono text-[11px] text-[#71717A]">{hex}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Metallic Card Finishes</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {CARD_FINISH_ORDER.map((key) => {
              const spec = CARD_FINISHES[key];
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-[#EAEAEF] bg-white p-3 shadow-xs"
                >
                  <div
                    className="mb-3 h-24 w-full rounded-xl border"
                    style={{
                      background: spec.cardBackground,
                      borderColor: spec.borderColor,
                    }}
                  />
                  <div className="text-xs font-semibold">{spec.label}</div>
                  <div className="mt-0.5 text-[11px] text-[#71717A]">{spec.description}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-3xl border border-[#EAEAEF] bg-white p-6">
            <h2 className="text-lg font-semibold">Typography Scale</h2>
            <div className="space-y-2.5">
              <div>
                <span className="text-[11px] text-[#71717A]">Display Greeting · 24px SemiBold</span>
                <p className="text-2xl font-semibold tracking-tight">Good Morning, Alvie</p>
              </div>
              <div>
                <span className="text-[11px] text-[#71717A]">KPI Hero Figure · 22px Tabular</span>
                <p className="tabular-nums text-[22px] font-semibold tracking-tight">$5,465.00</p>
              </div>
              <div>
                <span className="text-[11px] text-[#71717A]">Widget Title · 14px SemiBold</span>
                <p className="text-sm font-semibold">Spending Categories</p>
              </div>
              <div>
                <span className="text-[11px] text-[#71717A]">Muted Caption · 12px Regular</span>
                <p className="text-xs text-[#71717A]">
                  Our cards are made of recycled materials that you can provide us
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#EAEAEF] bg-white p-6">
            <h2 className="text-lg font-semibold">Radius &amp; Elevation</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(KAZA_RADII).map(([key, radius]) => (
                <div
                  key={key}
                  className="flex items-center justify-between border border-[#EAEAEF] bg-[#F9F9FB] px-3.5 py-3"
                  style={{ borderRadius: radius }}
                >
                  <span className="text-xs font-medium capitalize">{key}</span>
                  <span className="font-mono text-[11px] text-[#71717A]">{radius}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const meta: Meta<typeof DesignSystemShowcase> = {
  title: 'Design System/Overview',
  component: DesignSystemShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof DesignSystemShowcase>;

export const TokensAndMaterials: Story = {};
