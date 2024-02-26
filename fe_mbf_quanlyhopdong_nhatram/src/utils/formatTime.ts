/* eslint-disable import/no-duplicates */
import { format, formatDistanceToNow, getTime, isValid } from 'date-fns';

import { vi } from 'date-fns/locale';
// ----------------------------------------------------------------------

type InputValue = Date | string | number | null;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd/MM/yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd/MM/yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: vi,
      })
    : '';
}

export function fDateFilter(date: InputValue, newFormat?: string) {
  if (isValid(date)) {
    const fm = newFormat || 'yyyy-MM-dd';
    return date ? format(new Date(date), fm) : '';
  }
  return null;
}

export const convertDateStringtoDate = (dateString: string): string => {
  if (dateString === '') {
    return '';
  }
  // Split the date string into day, month, and year
  const [day, month, year] = dateString.split('/');

  // Create a new Date object with the year, month (subtract 1 because months are zero-based), and day
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));

  // Get the individual components of the date
  const formattedYear = date.getFullYear();
  const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  const formattedDay = date.getDate().toString().padStart(2, '0');

  // Assemble the formatted date string in the desired format
  const formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;

  return formattedDate;
};

export const parseDuration = (durationString: string) => {
  const parts = durationString.split(' ');
  const duration = { years: 0, months: 0, days: 0 };

  if (parts.length > 0) {
    const yearIndex = parts.indexOf('năm');
    if (yearIndex !== -1) {
      duration.years = parseInt(parts[yearIndex - 1], 10);
    }

    const monthIndex = parts.indexOf('tháng');
    if (monthIndex !== -1) {
      duration.months = parseInt(parts[monthIndex - 1], 10);
    }

    const dayIndex = parts.indexOf('ngày');
    if (dayIndex !== -1) {
      duration.days = parseInt(parts[dayIndex - 1], 10);
    }
  }

  return duration;
};

export const parseDateString = (dateString: string) => {
  const parts = dateString.split('/');
  const formattedDate = parts.reverse().join('-');
  return new Date(formattedDate);
};
