import { cn } from '#/lib/utils';
import { Input } from '#/components/ui/input';
import { FieldError } from '#/components/ui/field';
import { X } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { z } from 'zod';

interface EmailAutocompleteProps extends Omit<
  React.ComponentProps<'input'>,
  'type' | 'onChange'
> {
  value?: string;
  onChange?: (value: string) => void;
}

const EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
];

const emailSchema = z.string().email({ message: 'Invalid email format' });

const isValidEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

const getValidationError = (email: string): string | null => {
  const result = emailSchema.safeParse(email);
  return result.success ? null : 'Invalid email or mobile number format';
};

export const EmailAutocomplete = forwardRef<
  HTMLInputElement,
  EmailAutocompleteProps
>(({ value = '', onChange, className, ...props }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const generateSuggestions = (input: string): string[] => {
    if (!input.trim()) {
      return [];
    }

    if (!input.includes('@')) {
      return EMAIL_DOMAINS.map((d) => `${input}@${d}`);
    }

    const atIndex = input.lastIndexOf('@');
    const prefix = input.substring(0, atIndex);
    const domain = input.substring(atIndex + 1);

    if (!prefix.trim()) {
      return [];
    }

    return EMAIL_DOMAINS.filter((d) =>
      d.toLowerCase().startsWith(domain.toLowerCase()),
    ).map((d) => `${prefix}@${d}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);

    const newSuggestions = generateSuggestions(newValue);
    setSuggestions(newSuggestions);
    setIsOpen(newSuggestions.length > 0);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalValue(suggestion);
    onChange?.(suggestion);
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter' && localValue && isValidEmail(localValue)) {
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (localValue && isValidEmail(localValue)) {
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const error = localValue.includes('@')
    ? getValidationError(localValue)
    : null;

  return (
    <div ref={containerRef} className="relative w-full space-y-2">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className={cn('pr-10', error && 'border-destructive', className)}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear email input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && <FieldError>{error}</FieldError>}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-popover border border-input rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  'w-full text-left px-3 py-2.5 text-sm transition-colors border-none bg-transparent cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700',
                )}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

EmailAutocomplete.displayName = 'EmailAutocomplete';
