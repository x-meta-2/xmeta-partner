import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type SidebarHoverContextType = {
  isHovered: boolean;
  setIsHovered: (isHovered: boolean) => void;
};

const SidebarHoverContext = createContext<SidebarHoverContextType | undefined>(
  undefined,
);

export function SidebarHoverProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [isHovered, setIsHovered] = useState(false);

  const memoData = useMemo(() => ({ isHovered, setIsHovered }), [isHovered]);

  return (
    <SidebarHoverContext.Provider value={memoData}>
      {children}
    </SidebarHoverContext.Provider>
  );
}

export function useSidebarHover() {
  const context = useContext(SidebarHoverContext);
  if (context === undefined) {
    throw new Error(
      'useSidebarHover must be used within a SidebarHoverProvider',
    );
  }
  return context;
}
