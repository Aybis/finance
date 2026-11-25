import type { Meta, StoryObj } from '@storybook/react';
import { FinanceProvider, useFinance } from '@/store/FinanceContext';
import { RightSidebar } from './RightSidebar';

function RightSidebarHarness({
  initialTab,
}: {
  initialTab: 'messages' | 'notifications' | 'profile';
}) {
  const { openRightPanel, activeRightPanel } = useFinance();

  return (
    <div className="flex h-[680px] w-full overflow-hidden border border-[#EAEAEF] bg-[#F9F9FB]">
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
        <p className="text-sm font-semibold text-[#18181B]">Main Content Area</p>
        <p className="text-xs text-[#71717A]">
          Active right panel: {activeRightPanel ?? 'closed'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openRightPanel(initialTab)}
            className="rounded-full bg-[#232325] px-4 py-2 text-xs font-medium text-white cursor-pointer"
          >
            Open {initialTab}
          </button>
          <button
            type="button"
            onClick={() => openRightPanel(null)}
            className="rounded-full border border-[#EAEAEF] bg-white px-4 py-2 text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}

const meta: Meta<typeof RightSidebar> = {
  title: 'Organisms/RightSidebar',
  component: RightSidebar,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof RightSidebar>;

export const InteractivePushBar: Story = {
  render: () => (
    <FinanceProvider>
      <RightSidebarHarness initialTab="messages" />
    </FinanceProvider>
  ),
};
