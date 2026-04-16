import React, { useRef, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog';
import { Button } from '#/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '#/lib/utils';
import { useI18n } from '#/i18n/context';

interface ModalPropsConfig {
  onCancel?: (e: MouseEvent | null) => void;
  onOk?: (e: MouseEvent) => void;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  className?: string;
  wrapClassName?: string;
  afterOpenChange?: (open: boolean) => void;
}

interface ButtonConfig {
  text?: ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  disabled?: boolean;
  className?: string;
}

interface CustomDialogFormProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title?: ReactNode;
  description?: ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onCancel?: () => void;
  onSubmit?: () => void | Promise<void>;
  children?: ReactNode;
  submitButton?: ButtonConfig;
  cancelButton?: ButtonConfig;
  loading?: boolean;
  disabled?: boolean;
  destroyOnClose?: boolean;
  showCloseButton?: boolean;
  width?: number;
  showFooter?: boolean;
  onFinish?: (body?: unknown) => Promise<unknown>;
  onSuccess?: () => void;
  successData?: () => void;
  isValid?: boolean;
  customCancelAction?: () => void;
  modalProps?: ModalPropsConfig;
  formRef?: React.RefObject<HTMLFormElement>;
}

export const CustomDialogForm = React.forwardRef<
  HTMLDivElement,
  CustomDialogFormProps
>(
  (
    {
      title,
      description,
      open,
      onOpenChange,
      onCancel,
      onSubmit,
      children,
      submitButton = { text: 'Submit' },
      loading = false,
      disabled = false,
      showCloseButton = true,
      width = 450,
      showFooter = true,
      onFinish,
      onSuccess,
      customCancelAction,
      modalProps = {},
      className,
    },
    ref,
  ) => {
    const { t } = useI18n();
    const WRAP_CLASS_PREFIX = 'custom-modal-wrap-';
    const instanceKeyRef = useRef<string>(
      `cm-${Math.random().toString(36).slice(2)}`,
    );
    const wrapClassName = useMemo(
      () => `${WRAP_CLASS_PREFIX}${instanceKeyRef.current}`,
      [],
    );

    const rafIdRef = useRef<number | null>(null);
    const MAX_RAF_ATTEMPTS = 24;

    const updateOverlayPosition = (attempt = 0) => {
      const modalEl = document.querySelector(
        `.${wrapClassName} [role="dialog"]`,
      );
      if (!modalEl) {
        if (attempt < MAX_RAF_ATTEMPTS) {
          rafIdRef.current = requestAnimationFrame(() =>
            updateOverlayPosition(attempt + 1),
          );
        }
        return;
      }
      const rect = modalEl.getBoundingClientRect();
      const isInvalidSize = rect.width <= 0 || rect.height <= 0;
      const isInvalidPos = rect.top === 0 && rect.left === 0;
      if ((isInvalidSize || isInvalidPos) && attempt < MAX_RAF_ATTEMPTS) {
        rafIdRef.current = requestAnimationFrame(() =>
          updateOverlayPosition(attempt + 1),
        );
      }
    };

    useEffect(() => {
      const handleResize = () => updateOverlayPosition(0);
      rafIdRef.current = requestAnimationFrame(() => updateOverlayPosition(0));
      window.addEventListener('resize', handleResize);
      return () => {
        if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
        window.removeEventListener('resize', handleResize);
      };
    }, [open, wrapClassName]);

    const submitButtonText = submitButton.text || 'Submit';

    const handleCancel = () => {
      if (customCancelAction) {
        customCancelAction();
      } else {
        onCancel?.();
      }
      onOpenChange?.(false);
      modalProps?.onCancel?.(null);
    };

    const handleSubmit = async () => {
      try {
        if (onSubmit) {
          await onSubmit();
        } else if (onFinish) {
          await onFinish();
        }
        onSuccess?.();
      } catch (error) {
        console.error('Form submission error:', error);
      }
    };

    const handleOpenChange = (nextOpen: boolean) => {
      if (nextOpen) {
        modalProps?.afterOpenChange?.(nextOpen);
      } else {
        handleCancel();
      }
      onOpenChange?.(nextOpen);
    };

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={showCloseButton}
          ref={ref}
          className={cn(
            `${modalProps?.wrapClassName} ${wrapClassName}`,
            'rounded-3xl bg-white dark:bg-[#1E1E1E] p-5',
            className,
            modalProps?.className,
          )}
          style={{
            width: `${width}px`,
            maxWidth: '90vw',
          }}
          onEscapeKeyDown={(e) => {
            if (!modalProps?.maskClosable) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div className="flex-1 pr-4">
                {title ? (
                  <DialogTitle className="text-lg text-gray-900 dark:text-white font-medium">
                    {title}
                  </DialogTitle>
                ) : (
                  <DialogTitle className="sr-only">Dialog</DialogTitle>
                )}
                {description ? (
                  <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-normal">
                    {description}
                  </DialogDescription>
                ) : (
                  <DialogDescription className="sr-only">
                    Dialog content
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>
          <div className="px-1 overflow-y-auto max-h-[50vh] overflow-x-hidden">
            {children}
          </div>
          {showFooter && (
            <DialogFooter
              className="flex gap-3 p-1 pt-0 border-none rounded-b-3xl w-full flex-1"
              showCloseButton
              closeButtonText={t('dashboard:cancel')}
            >
              {submitButton.text && (
                <Button
                  onClick={handleSubmit}
                  variant="default"
                  disabled={disabled || loading || submitButton.disabled}
                  className={cn(
                    'flex-1 font-semibold py-2.5 h-auto transition-all duration-200',
                    'shadow-md hover:shadow-lg',
                    disabled && 'opacity-50 cursor-not-allowed',
                    submitButton.className,
                  )}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {submitButtonText}
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  },
);

CustomDialogForm.displayName = 'CustomDialogForm';

export interface ActionComponentProps<T> {
  open: boolean;
  onCancel: () => void;
  onFinish?: () => void;
  detail?: T;
  details?: T[];
}
