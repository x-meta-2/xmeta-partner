import { useCallback, useState } from 'react';

/**
 * Hook for managing dialog/modal open state with typed payload.
 *
 * Usage:
 *   const editDialog = useDialogState<User>()
 *
 *   <button onClick={() => editDialog.open(user)}>Edit</button>
 *
 *   <Dialog open={editDialog.isOpen} onOpenChange={editDialog.setOpen}>
 *     <EditForm user={editDialog.data} />
 *   </Dialog>
 */
export function useDialogState<T = undefined>() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);

  const open = useCallback((payload?: T) => {
    setData(payload);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setData(undefined), 150); // wait for close animation
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!next) close();
      else setIsOpen(true);
    },
    [close],
  );

  return {
    isOpen,
    data,
    open,
    close,
    setOpen,
  };
}
