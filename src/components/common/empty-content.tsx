import React from 'react';
import { useI18n } from '#/i18n/context';
import { cn } from '#/lib/utils';
import { InboxIcon } from 'lucide-react';

interface EmptyContentProps {
  title?: string;
  description?: string;
  className?: string;
}

export const EmptyContent: React.FC<EmptyContentProps> = ({
  title,
  description,
  className,
}) => {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in zoom-in duration-300',
        className,
      )}
    >
      <div className="relative mb-4">
        <InboxIcon size={40} />
      </div>
      <h3 className="text-base font-normal text-foreground/80 mb-1">
        {title || t('common:no-data')}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-62.5">
          {description}
        </p>
      )}
    </div>
  );
};
