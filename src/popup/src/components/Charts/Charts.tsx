import { useMemo } from 'react';

import type { CountPriceObject, Rides, Orders, CommonData } from 'types/Rides';
import type { BarChartsObject, BarChartTypes } from 'types/Charts';
import type { DataSource } from 'types/Storage';

import { colors, carColors } from 'utils/colors';
import { getCarsChunks, getSortedPattern } from 'utils/helpers';
import { week_pattern, month_pattern, day_pattern } from 'utils/patterns';

import BarChart from 'components/BarChart';

// Persian month names
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

interface Props {
  data: Rides | Orders;
  dataType?: DataSource;
}

const Charts = ({
  data,
  dataType = 'snapp',
}: Props) => {
  // Extract properties safely
  const { _rates, _types, _hours, _days, _weeks, _months, _years, _cars } = data as CommonData & {
    _rates?: CountPriceObject;
    _cars?: CountPriceObject;
  };

  // Transform month numbers to Persian names
  const transformedMonths = useMemo(() => {
    if (!_months) return {};
    
    const result: CountPriceObject = {};
    Object.entries(_months).forEach(([monthIndex, data]) => {
      const index = parseInt(monthIndex, 10);
      if (!isNaN(index) && index >= 0 && index < 12) {
        result[MONTHS[index]] = data;
      } else {
        result[monthIndex] = data;
      }
    });
    return result;
  }, [_months]);

  const BarCharts: BarChartsObject = useMemo(() => {
    const charts: BarChartsObject = {};
    
    if (_rates && dataType === 'snapp') charts._rates = _rates;
    if (_types) charts._types = _types;
    if (_hours) charts._hours = _hours;
    if (_days) charts._days = getSortedPattern(_days, day_pattern);
    
    if (_weeks) charts._weeks = getSortedPattern(_weeks, week_pattern);
    if (transformedMonths) charts._months = getSortedPattern(transformedMonths, month_pattern);
    if (_years) charts._years = _years;
    
    return charts;
  }, [_rates, _types, _hours, _days, _weeks, transformedMonths, _years, dataType]);

  const CarCharts: CountPriceObject[] = useMemo(
    () => _cars ? getCarsChunks(getSortedPattern(_cars, [], 'count')) : [],
    [_cars]
  );

  return (
    <>
      {(Object.keys(BarCharts) as string[]).map((type: string, index: number) => {
        const chart_data = BarCharts[type as BarChartTypes] || {};
        return (
          <BarChart
            key={type}
            color={colors[index]}
            type={type as BarChartTypes}
            data={(Object.keys(chart_data) as string[]).map((key: string) => {
              const { count, price } = chart_data[key];
              return {
                [type]: key,
                count,
                price,
              };
            })}
            dataType={dataType}
          />
        );
      })}
      {CarCharts.map((chart_data, index) => {
        const type: BarChartTypes = '_cars';
        return (
          <BarChart
            key={`${type}_${index}`}
            color={carColors[index]}
            type={type}
            data={(Object.keys(chart_data) as string[]).map((key: string) => {
              const { count, price } = chart_data[key];
              return {
                [type]: key,
                count,
                price,
              };
            })}
            dataType={dataType}
          />
        );
      })}
    </>
  );
};

export default Charts;
