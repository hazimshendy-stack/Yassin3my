import { createContext, useContext, useState, useCallback } from 'react';
const UICtx = createContext(null);
export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  return <UICtx.Provider value={{ sidebarOpen, openSidebar, closeSidebar, toggleSidebar }}>{children}</UICtx.Provider>;
}
export function useUI() {
  const c = useContext(UICtx);
  if (!c) throw new Error('useUI needs UIProvider');
  return c;
}
