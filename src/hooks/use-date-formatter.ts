import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import { useState, useEffect } from 'react';

dayjs.extend(utcPlugin);

const getOffsetMinutes = (tz: string): number => {
  const value = Number.parseFloat(tz.replace('UTC', ''));
  return value * 60;
};

export const useDateFormatter = () => {
  const getUserTimezone = (): string => {
    return localStorage.getItem('user_timezone') || 'UTC+8';
  };

  const [currentTimezone, setCurrentTimezone] = useState<string>(() => {
    if (typeof globalThis.window === 'undefined') return 'UTC+8';
    return getUserTimezone();
  });

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{
        key: string;
        value: string;
      }>;
      if (customEvent.detail?.key === 'timezone') {
        setCurrentTimezone(customEvent.detail.value);
      }
    };

    if (typeof globalThis.window !== 'undefined') {
      globalThis.window.addEventListener('user-preferences-change', handler);
    }

    return () => {
      if (typeof globalThis.window !== 'undefined') {
        globalThis.window.removeEventListener(
          'user-preferences-change',
          handler,
        );
      }
    };
  }, []);

  const formatWithTimezone = (
    timestamp: Dayjs | Date | number | string,
    format: string = 'YYYY-MM-DD HH:mm:ss',
  ): string => {
    const rawTZ = currentTimezone;
    const offsetMinutes = getOffsetMinutes(rawTZ);

    return dayjs(timestamp).utcOffset(offsetMinutes).format(format);
  };

  const formatNow = (format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
    return formatWithTimezone(dayjs(), format);
  };

  return {
    formatWithTimezone,
    formatNow,
    getUserTimezone,
  };
};
