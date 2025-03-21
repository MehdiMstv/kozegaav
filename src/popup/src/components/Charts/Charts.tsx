import { useMemo } from 'react';

import type { CountPriceObject, Rides, Orders, CommonData } from 'types/Rides';
import type { BarChartsObject, BarChartTypes } from 'types/Charts';
import type { DataSource } from 'types/Storage';

import { colors, carColors } from 'utils/colors';
import { getCarsChunks, getSortedPattern } from 'utils/helpers';
import { week_pattern, month_pattern, day_pattern } from 'utils/patterns';

import BarChart from 'components/BarChart';

// Move to constants file
const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
] as const;

interface Props {
  data: Rides | Orders;
  dataType?: DataSource;
}

const Charts = ({ data, dataType = 'snapp' }: Props) => {
  // Extract properties with proper type assertions
  const { _types, _hours, _days, _weeks, _months, _years } = data as CommonData;
  const _rates = dataType === 'snapp' ? (data as Rides)._rates : undefined;
  const _cars = dataType === 'snapp' ? (data as Rides)._cars : undefined;

  // Transform month numbers to Persian names
  const transformedMonths = useMemo(() => {
    if (!_months) return {};
    
    return Object.entries(_months).reduce<CountPriceObject>((result, [monthIndex, data]) => {
      const index = parseInt(monthIndex, 10);
      const key = !isNaN(index) && index >= 0 && index < 12 
        ? PERSIAN_MONTHS[index] 
        : monthIndex;
      result[key] = data;
      return result;
    }, {});
  }, [_months]);

  const barCharts: BarChartsObject = useMemo(() => {
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

  const carCharts: CountPriceObject[] = useMemo(
    () => _cars ? getCarsChunks(getSortedPattern(_cars, [], 'count')) : [],
    [_cars]
  );

  return (
    <>
      {(Object.keys(barCharts) as BarChartTypes[]).map((type, index) => (
        <BarChart
          key={type}
          color={dataType === 'snapp' ? colors[index] : colors[index + 1]}
          type={type}
          data={Object.entries(barCharts[type] || {}).map(([key, { count, price }]) => ({
            [type]: key,
            count,
            price,
          }))}
          dataType={dataType}
        />
      ))}
      {carCharts.map((chartData, index) => {
        const type: BarChartTypes = dataType === 'snapp' ? '_cars' : '_restaurants';
        return (
          <BarChart
            key={`${type}_${index}`}
            color={carColors[index]}
            type={type}
            data={Object.entries(chartData).map(([key, { count, price }]) => ({
              [type]: key,
              count,
              price,
            }))}
            dataType={dataType}
          />
        );
      })}
    </>
  );
};

export default Charts;
