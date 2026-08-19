export interface TabItem {
  id: string;
  label: string;
}

interface InsightsTabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

function TabButton({ tab, isActive, onClick }: { tab: TabItem; isActive: boolean; onClick: (id: string) => void }) {
  const handleClick = () => onClick(tab.id);

  return (
    <button
      onClick={handleClick}
      className={`flex h-15 shrink-0 cursor-pointer items-center justify-center rounded-full px-8 text-[16px] font-medium transition-colors ${
        isActive ? 'bg-brand-black text-brand-white' : 'text-brand-black bg-brand-white hover:bg-brand-white/70 border border-transparent'
      }`}
    >
      {tab.label}
    </button>
  );
}

export function InsightsTabs({ tabs, activeTabId, onTabChange }: InsightsTabsProps) {
  return (
    <div className='-mx-4 flex w-[calc(100%+2rem)] items-center gap-3 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:w-auto md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden'>
      {tabs.map((tab) => (
        <TabButton key={tab.id} tab={tab} isActive={activeTabId === tab.id} onClick={onTabChange} />
      ))}
    </div>
  );
}
