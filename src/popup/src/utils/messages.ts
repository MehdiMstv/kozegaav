import type { BarChartTypes } from 'types/Charts';
import type { RateObject, SummaryItemType, SummaryKeys } from 'types/Summary';
import type { DataSource } from 'types/Storage';

import { formattedNumber, getPrice } from './number';

const SNAPP_BIKE = 'اسنپ بایک';

const isSnappBike = (name: string) => name === SNAPP_BIKE;

const formatCarName = (name: string, dataType: DataSource = 'snapp') => {
  if (dataType === 'snappfood') return name;
  return `ماشین ${name}`;
};

const getRidesCount = (count: React.ReactText, dataType: DataSource = 'snapp') => {
  return `${count} ${dataType === 'snapp' ? 'سفر' : 'سفارش'}`;
};

type GetTypeFormatType = { 
  format: (value: string, dataType?: DataSource) => string 
};

const MONTHS = [
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

const getTypeFormat: {
  [type in BarChartTypes]: GetTypeFormatType;
} = {
  _hours: { format: (value) => `ساعت ${value}` },
  _weeks: { format: (value) => `${value}` },
  _days: { format: (value) => `روز ${value}ام` },
  _months: { 
    format: (value) => {
      const monthIndex = parseInt(value, 10);
      if (!isNaN(monthIndex) && monthIndex >= 0 && monthIndex < 12) {
        return MONTHS[monthIndex];
      }
      return `${value} ماه`;
    } 
  },
  _years: { format: (value) => `سال ${value}` },
  _types: { format: (value) => `${value}` },
  _rates: { format: (value) => `${value} امتیاز` },
  _cars: {
    format: (value, dataType = 'snapp') => {
      if (isSnappBike(value)) return SNAPP_BIKE;
      return formatCarName(value, dataType);
    },
  },
};

const getFormattedSummary: {
  [type: string]: {
    format: (value: number, dataType?: DataSource) => SummaryItemType;
  };
} = {
  count: {
    format: (value: number, dataType: DataSource = 'snapp') => {
      return { 
        message: formattedNumber(value), 
        unit: dataType === 'snapp' ? 'سفر' : 'سفارش' 
      };
    },
  },
  prices: {
    format: (value: number) => {
      return {
        message: getPrice(Number(value), false),
        unit: 'تومان',
      };
    },
  },
  distance: {
    format: (value: number) => {
      return {
        message: formattedNumber(value, 2),
        unit: 'کیلومتر',
      };
    },
  },
  durations: {
    format: (value: number) => {
      return {
        message: formattedNumber(value, 0),
        unit: 'دقیقه',
      };
    },
  },
};

export const getTooltipMessage = (
  count: React.ReactText,
  price: number,
  value: string,
  type: BarChartTypes,
  dataType: DataSource = 'snapp'
) => {
  const formattedValue = getTypeFormat[type].format(value, dataType);
  return `${formattedValue} | ${getPrice(price)} (${getRidesCount(count, dataType)})`;
};

export const getSummaryItemMessage = (value: number, type: string, dataType: DataSource = 'snapp') => {
  if (!getFormattedSummary[type]) {
    // Fallback for any unknown summary types
    return {
      message: formattedNumber(value),
      unit: '',
    };
  }
  
  // Always try to pass the dataType parameter
  try {
    return getFormattedSummary[type].format(value, dataType);
  } catch (e) {
    // If it doesn't accept the dataType parameter, call with just the value
    return getFormattedSummary[type].format(value);
  }
};

export const getRateSummaryMessage = (
  { count, sum }: RateObject,
  dataType: DataSource = 'snapp'
): SummaryItemType => {
  return {
    description: `${count} ${dataType === 'snapp' ? 'سفر' : 'سفارش'}`,
    message: formattedNumber(sum / count, 2),
    unit: 'امتیاز',
  };
};

export const getStartAndEndDate = (start: string, end: string) =>
  `${start}   تا   ${end}`;

export const mapToPersian: { [type in BarChartTypes]: string } = {
  _hours: 'ساعت‌های شبانه‌روز',
  _weeks: 'روزهای هفته',
  _days: 'روزهای ماه',
  _months: 'ماه‌های سال',
  _years: 'سال',
  _cars: 'مدل ماشین',
  _rates: 'امتیاز سفر',
  _types: 'نوع سرویس',
};

export const getMapToPersian = (type: BarChartTypes, dataType: DataSource = 'snapp'): string => {
  if (type === '_cars' && dataType === 'snappfood') {
    return 'رستوران';
  }
  return mapToPersian[type];
};

export const getExportName: { [type in BarChartTypes]: string } = {
  _hours: 'Hours',
  _weeks: 'Weeks',
  _days: 'Days',
  _months: 'Months',
  _years: 'Years',
  _cars: 'Cars',
  _rates: 'Rates',
  _types: 'ServiceTypes',
};

export const getErrorMessage: { [statusCode: string]: string } = {
  401: 'خیلی وقته بهم سر نزدی! باید دوباره وارد حساب اسنپت بشی.',
};

export const getLastRideDateMessage = (lastEndRange: string) => {
  return `تاریخ آخرین سفر: ${lastEndRange}`;
};
