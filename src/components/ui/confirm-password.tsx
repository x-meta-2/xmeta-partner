import { cn } from '#/lib/utils';
import { Input } from '#/components/ui/input';
import { FieldError } from '#/components/ui/field';
import { X, Eye, EyeOff, Check } from 'lucide-react';
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface ConfirmPasswordProps extends Omit<
  React.ComponentProps<'input'>,
  'type' | 'onChange'
> {
  value?: string;
  onChange?: (value: string) => void;
  passwordValue?: string;
}

export const ConfirmPassword = forwardRef<
  HTMLInputElement,
  ConfirmPasswordProps
>(
  ({ value = '', onChange, passwordValue = '', className, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [state, setState] = useState({
      localValue: value,
      showPassword: false,
    });

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);

      setState((prev) => ({
        ...prev,
        localValue: newValue,
      }));
    };

    const handleClear = () => {
      onChange?.('');
      setState({
        localValue: '',
        showPassword: false,
      });
      inputRef.current?.focus();
    };

    const isMatching = state.localValue.length > 0 && state.localValue === passwordValue;
    const isMismatched = state.localValue.length > 0 && state.localValue !== passwordValue;

    return (
      <div className="relative w-full space-y-2">
        <div className="relative">
          <Input
            ref={inputRef}
            type={state.showPassword ? 'text' : 'password'}
            value={state.localValue}
            onChange={handleInputChange}
            className={cn(
              'pr-10',
              isMismatched && 'border-destructive',
              className,
            )}
            aria-invalid={isMismatched ? 'true' : 'false'}
            {...props}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {state.localValue && (
              <button
                type="button"
                onClick={() =>
                  setState((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                }
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={state.showPassword ? 'Hide password' : 'Show password'}
              >
                {state.showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
            {state.localValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Clear password input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isMatching && (
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500 text-white">
                <Check className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>

        {isMismatched && (
          <FieldError>Passwords do not match</FieldError>
        )}
      </div>
    );
  },
);

ConfirmPassword.displayName = 'ConfirmPassword';
