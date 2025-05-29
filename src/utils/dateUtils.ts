/**
 * UTC Date Utilities
 * Ensures consistent timezone handling across the application
 * All calculations use UTC to avoid timezone discrepancies
 * Display functions convert UTC to user's local timezone
 */

/**
 * Get current time in UTC
 */
export const getCurrentUTC = (): Date => {
  return new Date();
};

/**
 * Convert any date to UTC Date object
 * Ensures date strings from API are properly parsed as UTC
 */
export const toUTC = (date: Date | string): Date => {
  if (date instanceof Date) {
    return date;
  }
  
  // If it's a string, ensure it's parsed as UTC
  // If the string doesn't end with 'Z' or timezone info, assume it's UTC
  if (typeof date === 'string') {
    // If no timezone info, append 'Z' to force UTC parsing
    if (!date.includes('Z') && !date.includes('+') && !date.includes('-', 10)) {
      return new Date(date + 'Z');
    }
    return new Date(date);
  }
  
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
 * Format date for display (converts UTC to user's local timezone for display)
 */
export const formatDateUTC = (date?: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return 'N/A';
  
  // Parse the date as UTC first
  const utcDate = toUTC(date);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    // Don't specify timeZone - let it use user's local timezone automatically
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(utcDate);
};

/**
 * Format date for display with explicit timezone info
 */
export const formatDateWithTimezone = (date?: Date | string, showTimezone: boolean = true): string => {
  if (!date) return 'N/A';
  
  const utcDate = toUTC(date);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...(showTimezone && { timeZoneName: 'short' })
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(utcDate);
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
 * This ensures dates sent to the API are always in UTC
 */
export const createUTCDate = (dateString?: string, timeString?: string): Date => {
  if (dateString && timeString) {
    // Create a UTC date by appending 'Z' to force UTC interpretation
    return new Date(`${dateString}T${timeString}:00.000Z`);
  }
  return getCurrentUTC();
};

/**
 * Create date from local user input and convert to UTC for API
 * Use this when user inputs a date/time in their local timezone
 * but you need to send it as UTC to the API
 */
export const createUTCFromLocalInput = (dateString: string, timeString: string): Date => {
  // Create date in user's local timezone first
  const localDate = new Date(`${dateString}T${timeString}:00`);
  // Return as-is, JavaScript will handle UTC conversion automatically
  return localDate;
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

/**
 * Convert UTC date to user's local timezone for form inputs
 * Use this when you need to populate date/time inputs with UTC dates from API
 */
export const formatUTCForLocalInput = (date: Date | string): { date: string; time: string } => {
  const utcDate = toUTC(date);
  
  // Convert to local time for display in form inputs
  const year = utcDate.getFullYear();
  const month = String(utcDate.getMonth() + 1).padStart(2, '0');
  const day = String(utcDate.getDate()).padStart(2, '0');
  const hours = String(utcDate.getHours()).padStart(2, '0');
  const minutes = String(utcDate.getMinutes()).padStart(2, '0');
  
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`
  };
};

/**
 * Format date for display with user's timezone (more explicit about timezone)
 * Use this for important dates where timezone clarity is needed
 */
export const formatDateWithUserTimezone = (date?: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return 'N/A';
  
  const utcDate = toUTC(date);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short' // Always show timezone for clarity
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(utcDate);
}; 