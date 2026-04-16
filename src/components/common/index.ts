/**
 * Common (cross-feature) components.
 *
 * Layer 4 in the architecture: composed UI patterns built on `components/ui/`
 * primitives that any feature can drop in.
 */
export { CustomDialogForm } from './custom-dialog-form';
export { EmptyContent } from './empty-content';
export { ErrorBoundary } from './error-boundary';
export { LocalizedLink } from './localized-link';
export { PageHeader } from './page-header';
export { StatusTag } from './status-tag';

// Re-exports kept for legacy auth imports.
export { PasswordAutocomplete } from '../ui/password-autocomplete';
export { ConfirmPassword } from '../ui/confirm-password';
export { EmailAutocomplete } from '../ui/email-autocomplete';
