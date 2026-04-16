import { useState, useEffect, useCallback } from 'react';

const PRIVACY_KEY = 'xmeta_privacy_mode';

export const usePrivacyMode = () => {
  const [isHidden, setIsHidden] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(PRIVACY_KEY) === 'true';
  });

  const toggleHidden = useCallback(() => {
    setIsHidden((prev) => !prev);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentValue = localStorage.getItem(PRIVACY_KEY) === 'true';
      if (currentValue !== isHidden) {
        localStorage.setItem(PRIVACY_KEY, String(isHidden));
        window.dispatchEvent(
          new CustomEvent('privacy-mode-change', { detail: isHidden })
        );
      }
    }
  }, [isHidden]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PRIVACY_KEY) {
        setIsHidden(e.newValue === 'true');
      }
    };

    const handleCustomChange = (e: CustomEvent<boolean>) => {
      setIsHidden(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(
      'privacy-mode-change',
      handleCustomChange as EventListener,
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'privacy-mode-change',
        handleCustomChange as EventListener,
      );
    };
  }, []);

  return { isHidden, toggleHidden };
};
