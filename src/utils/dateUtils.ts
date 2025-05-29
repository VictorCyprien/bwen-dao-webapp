/**
 * UTC Date Utilities
 * Ensures consistent timezone handling across the application
 * All calculations use UTC to avoid timezone discrepancies
 */

/**
 * Get current time in UTC
 */
export const getCurrentUTC = (): Date => {
  return new Date();
};

/**
 * Convert any date to UTC Date object
 */
export const toUTC = (date: Date | string): Date => {
  return new Date(date);
};

/**
 * Calculate time difference using UTC timestamps
 */
export const getTimeRemainingUTC = (targetDate: Date | string): {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
} => {
  const now = getCurrentUTC();
  const target = toUTC(targetDate);
  const diff = target.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { total: diff, days, hours, minutes, seconds, expired: false };
};

/**
 * Format time remaining from UTC calculation
 */
export const formatTimeRemainingUTC = (targetDate: Date | string): string => {
  const remaining = getTimeRemainingUTC(targetDate);
  
  if (remaining.expired) return 'Expired';
  
  if (remaining.days > 0) {
    return `${remaining.days} day${remaining.days === 1 ? '' : 's'}, ${remaining.hours} hour${remaining.hours === 1 ? '' : 's'} and ${remaining.minutes} minute${remaining.minutes === 1 ? '' : 's'}`;
  } else if (remaining.hours > 0) {
    return `${remaining.hours} hour${remaining.hours === 1 ? '' : 's'} and ${remaining.minutes} minute${remaining.minutes === 1 ? '' : 's'}`;
  } else {
    return `${remaining.minutes} minute${remaining.minutes === 1 ? '' : 's'}`;
  }
};

/**
 * Format date for display (converts UTC to user's local timezone for display only)
 */
export const formatDateUTC = (date?: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return 'N/A';
  
  const utcDate = toUTC(date);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // User's local timezone for display
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(utcDate);
};

/**
 * Get time ago string from UTC date
 */
export const getTimeAgoUTC = (dateString: string | Date): string => {
  const date = toUTC(dateString);
  const now = getCurrentUTC();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

/**
 * Create date in UTC for API submissions
 */
export const createUTCDate = (dateString?: string, timeString?: string): Date => {
  if (dateString && timeString) {
    return new Date(`${dateString}T${timeString}:00.000Z`);
  }
  return getCurrentUTC();
};

/**
 * Check if a date/time is in the future (UTC comparison)
 */
export const isFutureUTC = (date: Date | string): boolean => {
  const target = toUTC(date);
  const now = getCurrentUTC();
  return target.getTime() > now.getTime();
};

/**
 * Check if a date/time has expired (UTC comparison)
 */
export const isExpiredUTC = (date: Date | string): boolean => {
  return !isFutureUTC(date);
}; 