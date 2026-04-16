import type React from 'react';

import { LocalizedLink } from '#/components/common/localized-link';

import { NavigationMenuLink } from './navigation-menu';

type ListItemProps = {
  to: string;
  params?: Record<string, string>;
  title: string;
  children?: React.ReactNode;
  logoUrl?: string;
  badge?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export const ListItem = ({
  title,
  children,
  logoUrl,
  badge,
  ...props
}: ListItemProps) => {
  return (
    <NavigationMenuLink
      asChild
      className="hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl! transition-all duration-200"
    >
      <LocalizedLink {...props}>
        <div className="flex gap-4 items-start text-sm p-1">
          <div className="flex flex-col justify-center items-center h-12">
            <img
              src={logoUrl}
              alt="bank-crypto"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="flex flex-col gap-1.5 pt-0.5">
            <h2 className="text-[15px] leading-tight font-bold text-[#0A004F] dark:text-white">
              {title}
              {badge && (
                <span className="bg-blue-500 px-2 py-0.5 ml-2 rounded-md text-xs font-normal text-white">
                  {badge}
                </span>
              )}
            </h2>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-muted-foreground line-clamp-3">
              {children}
            </p>
          </div>
        </div>
      </LocalizedLink>
    </NavigationMenuLink>
  );
};
