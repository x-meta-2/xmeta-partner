import { useLocation } from '@tanstack/react-router';
import { LocalizedLink } from '#/components/common/localized-link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '#/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible';
import * as Icons from 'lucide-react';
import { dashboardMenuConfig } from '#/config/dashboard-menu';
import { cn } from '#/lib/utils';
import { useI18n } from '#/i18n/context';
import { stripLocalePrefix } from '#/i18n/routing';
import { useSidebarHover } from '#/components/layout/sidebar-hover-context';
import React, { useState, useEffect } from 'react';

export function DashboardSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useI18n();
  const normalizedPath = stripLocalePrefix(currentPath);

  const { state, toggleSidebar } = useSidebar();
  const { isHovered } = useSidebarHover();

  const isExpanded = state === 'expanded';
  const isEffectivelyExpanded = isExpanded || isHovered;

  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialStates: Record<string, boolean> = {};
    dashboardMenuConfig.forEach((menu) => {
      const hasChildren = menu.children && menu.children.length > 0;
      const isParentActive =
        hasChildren &&
        menu.children?.some((c) => c.to && normalizedPath.includes(c.to));
      if (menu.id === 'wallet' || isParentActive) {
        initialStates[menu.id] = true;
      }
    });
    setOpenMenus(initialStates);
  }, [normalizedPath]);

  const handleToggleMenu = (menuId: string) => {
    setOpenMenus((prev) => {
      const isOpen = !!prev[menuId];
      return {
        [menuId]: !isOpen,
      };
    });
  };

  return (
    <div className="flex flex-col border border-l-0 border-border rounded-r-3xl overflow-hidden h-[86vh] bg-card transition-all duration-300">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardMenuConfig.map((menu) => {
                const Icon = menu.icon
                  ? (Icons[
                      menu.icon as keyof typeof Icons
                    ] as React.ElementType)
                  : null;
                const hasChildren = menu.children && menu.children.length > 0;
                const isParentActive =
                  hasChildren &&
                  menu.children?.some(
                    (c) => c.to && normalizedPath.includes(c.to),
                  );
                const isDirectActive =
                  !hasChildren && menu.to && normalizedPath === menu.to;
                const isGroupActive = isParentActive || isDirectActive;
                const isOpen = isExpanded
                  ? !!openMenus[menu.id]
                  : isHovered &&
                    (hoveredMenuId === menu.id || !!openMenus[menu.id]);

                return (
                  <div
                    key={menu.id}
                    className="flex flex-col w-full border-b border-border last:border-b-0"
                    onMouseEnter={() => setHoveredMenuId(menu.id)}
                    onMouseLeave={() => setHoveredMenuId(null)}
                  >
                    {hasChildren ? (
                      <Collapsible
                        open={isOpen}
                        onOpenChange={() => handleToggleMenu(menu.id)}
                        className="group/collapsible"
                        disabled={!isEffectivelyExpanded}
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              className={cn(
                                'h-14 w-full justify-between rounded-none px-6 outline-none transition-all',
                                isGroupActive
                                  ? 'bg-primary-soft text-primary hover:bg-primary-soft hover:text-primary'
                                  : 'text-foreground hover:bg-muted',
                                !isEffectivelyExpanded && 'justify-center px-0',
                              )}
                            >
                              <div
                                className={cn(
                                  'flex items-center gap-4',
                                  !isEffectivelyExpanded &&
                                    'justify-center gap-0',
                                )}
                              >
                                {Icon && (
                                  <Icon
                                    className="size-5.5 shrink-0"
                                    strokeWidth={1.8}
                                  />
                                )}
                                {isEffectivelyExpanded && (
                                  <span className="font-medium text-[16px] whitespace-nowrap animate-in fade-in duration-300">
                                    {t(`dashboard:menu.${menu.id}`, menu.label)}
                                  </span>
                                )}
                              </div>
                              {isEffectivelyExpanded && (
                                <Icons.ChevronDown
                                  className={cn(
                                    'size-5 transition-transform duration-200 block',
                                    isOpen ? 'rotate-180' : '',
                                    isGroupActive
                                      ? ''
                                      : 'text-muted-foreground',
                                  )}
                                />
                              )}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          {isEffectivelyExpanded && (
                            <CollapsibleContent>
                              <SidebarMenuSub className="mx-0 border-none px-0 flex flex-col gap-0 pb-2 bg-transparent">
                                {menu.children?.map((child) => {
                                  const isActive =
                                    child.to &&
                                    normalizedPath.includes(child.to);
                                  return (
                                    <SidebarMenuSubItem key={child.id}>
                                      <SidebarMenuSubButton
                                        asChild
                                        className={cn(
                                          'h-13 rounded-none',
                                          isActive
                                            ? 'bg-primary-soft text-primary font-medium'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                        )}
                                      >
                                        <LocalizedLink
                                          to={child.to || ''}
                                          className="flex items-center gap-3 pl-14 pr-6"
                                        >
                                          <span className="text-[15px] whitespace-nowrap">
                                            {t(
                                              `dashboard:${child.id}`,
                                              child.label,
                                            )}
                                          </span>
                                        </LocalizedLink>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          )}
                        </SidebarMenuItem>
                      </Collapsible>
                    ) : (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className={cn(
                            'h-14 relative rounded-none px-6 outline-none transition-all',
                            isGroupActive
                              ? 'bg-primary-soft text-primary hover:bg-primary-soft hover:text-primary'
                              : 'text-foreground hover:bg-muted',
                            !isEffectivelyExpanded && 'justify-center px-0',
                          )}
                        >
                          <LocalizedLink
                            to={menu.to || ''}
                            className={cn(
                              'flex items-center w-full',
                              isEffectivelyExpanded
                                ? 'justify-between'
                                : 'justify-center',
                            )}
                          >
                            <div
                              className={cn(
                                'flex items-center gap-4',
                                !isEffectivelyExpanded &&
                                  'justify-center gap-0',
                              )}
                            >
                              {Icon && (
                                <Icon
                                  className="size-5.5 shrink-0"
                                  strokeWidth={1.8}
                                />
                              )}
                              {isEffectivelyExpanded && (
                                <span className="font-medium text-[16px] whitespace-nowrap animate-in fade-in duration-300">
                                  {t(`dashboard:menu.${menu.id}`, menu.label)}
                                </span>
                              )}
                            </div>
                            {isEffectivelyExpanded && menu.badge && (
                              <span className="bg-success-soft text-success text-[11.5px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                                {menu.badge}
                              </span>
                            )}
                          </LocalizedLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>

      <div className="mt-auto border-t border-border p-2">
        <button
          onClick={toggleSidebar}
          className="flex h-10 w-full items-center justify-center rounded-xl transition-colors hover:bg-muted outline-none"
        >
          <Icons.ChevronsRight
            className={cn(
              'size-5.5 text-muted-foreground transition-transform duration-300',
              isExpanded && 'rotate-180',
            )}
          />
        </button>
      </div>
    </div>
  );
}
