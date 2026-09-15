/**
 * UI Tabs Component.
 * Accessible tab navigation with active pill animation support.
 */
import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const TabsContext = createContext({
  activeTab: '',
  setActiveTab: () => {},
});

export function Tabs({ defaultValue, value, onValueChange, className, children }) {
  const [selected, setSelected] = useState(defaultValue || '');
  const activeTab = value !== undefined ? value : selected;

  const handleTabChange = (val) => {
    if (onValueChange) onValueChange(val);
    else setSelected(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn('w-full space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div
      className={cn(
        'inline-flex h-11 items-center justify-start rounded-xl bg-slate-900/90 p-1 text-slate-400 border border-slate-800 shadow-sm overflow-x-auto max-w-full',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, disabled }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-xs md:text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="tab-pill"
          className="absolute inset-0 bg-indigo-600 rounded-lg shadow-sm"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function TabsContent({ value, className, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('focus-visible:outline-none', className)}
    >
      {children}
    </motion.div>
  );
}

export default Tabs;
