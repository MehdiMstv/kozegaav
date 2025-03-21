import type { SummaryKeys } from 'types/Summary';

export const week_pattern = [
  'شنبه',
  'یک‌شنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];

export const day_pattern = [
  '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۱۰',
  '۱۱', '۱۲', '۱۳', '۱۴', '۱۵', '۱۶', '۱۷', '۱۸', '۱۹', '۲۰',
  '۲۱', '۲۲', '۲۳', '۲۴', '۲۵', '۲۶', '۲۷', '۲۸', '۲۹', '۳۰', '۳۱'
];

// Persian month names in order
export const month_pattern = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const data_pattern = ['total'];

export const summary_pattern = ['count', 'prices', 'distance', 'durations', 'maxPrice'] as const;
