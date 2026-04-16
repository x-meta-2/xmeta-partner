import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { cn } from '#/lib/utils';
import { Button } from '#/components/ui/button';
import { useI18n } from '#/i18n/context';

type ServerlessPaginationProps = Readonly<{
  currentPage: number;
  hasNextPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  total?: number;
  className?: string;
}>;

export function ServerlessPagination({
  currentPage,
  hasNextPage,
  onNextPage,
  onPreviousPage,
  className,
}: ServerlessPaginationProps) {
  const { t } = useI18n();
  const canGoPrevious = currentPage > 1;

  return (
    <div
      className={cn(
        'flex items-center justify-end overflow-clip px-2',
        '@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4',
        className,
      )}
      style={{ overflowClipMargin: 1 }}
    >
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={onPreviousPage}
          disabled={!canGoPrevious}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <div className="flex w-25 items-center justify-center text-sm font-medium">
          {t('table:page')} {currentPage}
        </div>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={onNextPage}
          disabled={!hasNextPage}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
