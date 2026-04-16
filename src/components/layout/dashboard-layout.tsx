import { useEffect, useRef } from 'react';

import { SidebarProvider, useSidebar } from '#/components/ui/sidebar';
import { TooltipProvider } from '#/components/ui/tooltip';
import { cn } from '#/lib/utils';

import {
  SidebarHoverProvider,
  useSidebarHover,
} from './sidebar-hover-context';

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  mobileSidebarContent?: React.ReactNode;
}>;

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <SidebarHoverProvider>
          <DashboardLayoutContent {...props} />
        </SidebarHoverProvider>
      </SidebarProvider>
    </TooltipProvider>
  );
}

function DashboardLayoutContent({
  children,
  sidebarContent,
  mobileSidebarContent,
}: DashboardLayoutProps) {
  const { state } = useSidebar();
  const { isHovered, setIsHovered } = useSidebarHover();
  const isEffectivelyExpanded = state === 'expanded' || isHovered;

  // Prevent immediate hover expansion on page load if the cursor already
  // happens to be over the sidebar — wait for either a brief delay or an
  // actual mouse movement before allowing hover-to-peek.
  const canHoverRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      canHoverRef.current = true;
    }, 500);

    const onMove = () => {
      canHoverRef.current = true;
    };
    window.addEventListener('mousemove', onMove, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div className="flex flex-col w-full bg-background">
      {mobileSidebarContent && (
        <div className="lg:hidden bg-background sticky top-0 z-10">
          {mobileSidebarContent}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden w-full">
        <aside
          onMouseEnter={() => {
            if (state === 'collapsed' && canHoverRef.current) {
              setIsHovered(true);
            }
          }}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            'hidden lg:block bg-background shrink-0 transition-[width] duration-300 ease-in-out z-20',
            isEffectivelyExpanded ? 'w-64 2xl:w-75' : 'w-20',
          )}
        >
          <div className="py-5.5 space-y-4 h-full">{sidebarContent}</div>
        </aside>

        <main className="flex-1 w-full">
          <div className="w-full h-full">
            <div className="p-4 sm:p-6 max-w-full">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
