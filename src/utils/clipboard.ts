import { toast } from 'sonner';

/**
 * Copy `text` to the system clipboard and toast a success/failure message.
 *
 * Returns `true` on success so callers can drive UI state (e.g. flipping a
 * "Copied!" check icon for a couple of seconds).
 *
 * @example
 *   const copied = await copyToClipboard(link.url, 'Link copied');
 *   if (copied) setCopiedFlag(true);
 */
export async function copyToClipboard(
  text: string,
  successMessage: string = 'Copied',
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
    return true;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Failed to copy');
    return false;
  }
}
