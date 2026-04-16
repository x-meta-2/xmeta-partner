import { cn } from '#/lib/utils';
import { Input } from '#/components/ui/input';
import { X, Eye, EyeOff, Check } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface PasswordAutocompleteProps extends Omit<
  React.ComponentProps<'input'>,
  'type' | 'onChange'
> {
  value?: string;
  hideRequirements?: boolean;
  onChange?: (value: string) => void;
}

interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const checkPasswordRequirements = (password: string): PasswordRequirements => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  };
};

const RequirementItem: React.FC<{
  met: boolean;
  text: string;
}> = ({ met, text }) => (
  <div className="flex items-center gap-2 text-sm">
    <div
      className={cn(
        'flex items-center justify-center w-4 h-4 rounded-full transition-colors',
        met
          ? 'bg-green-500 text-white'
          : 'border border-gray-300 dark:border-gray-600',
      )}
    >
      {met && <Check className="w-3 h-3" />}
    </div>
    <span
      className={
        met
          ? 'text-green-600 dark:text-green-400'
          : 'text-gray-600 dark:text-gray-400'
      }
    >
      {text}
    </span>
  </div>
);

export const PasswordAutocomplete = forwardRef<
  HTMLInputElement,
  PasswordAutocompleteProps
>(
  (
    { value = '', onChange, className, hideRequirements = false, ...props },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [state, setState] = useState({
      localValue: value,
      isOpen: false,
      showPassword: false,
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      } as PasswordRequirements,
    });

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const newRequirements = checkPasswordRequirements(newValue);
      onChange?.(newValue);

      setState((prev) => ({
        ...prev,
        localValue: newValue,
        requirements: newRequirements,
        isOpen: newValue.length > 0,
      }));
    };

    const handleClear = () => {
      onChange?.('');
      setState({
        localValue: '',
        isOpen: false,
        showPassword: false,
        requirements: {
          minLength: false,
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecialChar: false,
        },
      });
      inputRef.current?.focus();
    };

    const handleFocus = () => {
      setState((prev) => ({
        ...prev,
        isOpen: prev.localValue.length > 0,
      }));
    };

    const handleBlur = () => {
      setState((prev) => ({
        ...prev,
        isOpen: false,
      }));
    };

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setState((prev) => ({ ...prev, isOpen: false }));
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div ref={containerRef} className="relative w-full space-y-2">
        <div className="relative">
          <Input
            ref={inputRef}
            type={state.showPassword ? 'text' : 'password'}
            value={state.localValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn('pr-10', className)}
            {...props}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {state.localValue && (
              <button
                type="button"
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={
                  state.showPassword ? 'Hide password' : 'Show password'
                }
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
          </div>
        </div>

        {!hideRequirements && state.isOpen && state.localValue.length > 0 && (
          <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Password requirements:
            </div>
            <RequirementItem
              met={state.requirements.minLength}
              text="At least 8-20 characters"
            />
            <RequirementItem
              met={state.requirements.hasUppercase}
              text="At least 1 uppercase letter"
            />
            <RequirementItem
              met={state.requirements.hasLowercase}
              text="At least 1 lowercase letter"
            />
            <RequirementItem
              met={state.requirements.hasNumber}
              text="At least 1 number"
            />
            <RequirementItem
              met={state.requirements.hasSpecialChar}
              text="At least 1 special character (!@#$%^&*)"
            />
          </div>
        )}
      </div>
    );
  },
);

PasswordAutocomplete.displayName = 'PasswordAutocomplete';
