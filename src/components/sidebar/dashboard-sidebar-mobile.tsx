import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs';
import { LocalizedLink } from '#/components/common/localized-link';
import { dashboardMenuConfig } from '#/config/dashboard-menu';
import { useI18n } from '#/i18n/context';
import { stripLocalePrefix } from '#/i18n/routing';
import { cn } from '#/lib/utils';
import { useLocation } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function DashboardSidebarMobile() {
  const location = useLocation();
  const currentPath = location.pathname;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { t } = useI18n();
  const normalizedPath = stripLocalePrefix(currentPath);

  const getActiveMenu = () => {
    for (const menu of dashboardMenuConfig) {
      if (menu.to && normalizedPath === menu.to) {
        return menu.id;
      }
      if (menu.children) {
        const hasActiveChild = menu.children.some(
          (child) => child.to && normalizedPath.includes(child.to),
        );
        if (hasActiveChild) {
          return menu.id;
        }
      }
    }
    return dashboardMenuConfig[0]?.id || '';
  };

  const [activeTab, setActiveTab] = useState(getActiveMenu());

  useEffect(() => {
    setActiveTab(getActiveMenu());
  }, [currentPath]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  return (
    <div className="flex flex-col w-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        orientation="horizontal"
        className="w-full"
      >
        <div className="relative w-full border-b border-border">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 bg-linear-to-r from-background to-transparent hover:from-slate-100 dark:hover:from-slate-900 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 bg-linear-to-l from-background to-transparent hover:from-slate-100 dark:hover:from-slate-900 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide"
          >
            <TabsList
              variant="line"
              className="w-full min-w-max justify-start gap-2 rounded-none bg-transparent p-0 px-4 h-auto"
            >
              {dashboardMenuConfig.map((menu) => {
                const Icon = menu.icon
                  ? (Icons[
                      menu.icon as keyof typeof Icons
                    ] as React.ElementType)
                  : null;
                const hasChildren = menu.children && menu.children.length > 0;
                const content = (
                  <>
                    {Icon && <Icon className="size-5" strokeWidth={1.8} />}
                    <span className="text-[15px] font-medium whitespace-nowrap">
                      {t(`dashboard:menu.${menu.id}`, menu.label)}
                    </span>
                    {menu.badge && (
                      <span className="bg-[#e0f1e2] text-[#16a34a] text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                        {menu.badge}
                      </span>
                    )}
                  </>
                );
                return (
                  <TabsTrigger
                    key={menu.id}
                    value={menu.id}
                    className={cn(
                      'h-14 flex-none border-0 px-3',
                      'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
                      'transition-colors duration-200',
                      'after:bg-indigo-600 dark:after:bg-indigo-500',
                      'data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-500',
                    )}
                    asChild={!hasChildren}
                  >
                    {!hasChildren && menu.to ? (
                      <LocalizedLink
                        to={menu.to}
                        className="flex items-center gap-2"
                      >
                        {content}
                      </LocalizedLink>
                    ) : (
                      <div className="flex items-center gap-2">{content}</div>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>
        {dashboardMenuConfig.map((menu) => {
          const hasChildren = menu.children && menu.children.length > 0;
          return (
            <TabsContent
              key={menu.id}
              value={menu.id}
              className={cn('mt-0 w-full', !hasChildren && 'hidden')}
            >
              {hasChildren && (
                <div className="flex flex-col bg-white dark:bg-slate-950">
                  {menu.children?.map((child) => {
                    const isActive =
                      child.to && normalizedPath.includes(child.to);
                    return (
                      <LocalizedLink
                        key={child.id}
                        to={child.to || ''}
                        className={cn(
                          'flex items-center px-6 py-3 text-[15px] font-normal transition-colors',
                          isActive
                            ? 'bg-slate-50 text-slate-900 font-medium dark:bg-slate-900 dark:text-slate-100'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100',
                        )}
                      >
                        {t(`dashboard:${child.id}`, child.label)}
                      </LocalizedLink>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
