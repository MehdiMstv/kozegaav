import {
  MouseEvent,
  ReactText,
  useCallback,
  useMemo,
  useState,
} from 'react';
import setWith from 'lodash.setwith';

import type { Rides, Orders, CommonData } from 'types/Rides';
import type { DataSource, SnappTaxiDataStorage, SnappfoodDataStorage } from 'types/Storage';

import constants from 'utils/constants';
import { data_pattern } from 'utils/patterns';

import Charts from 'components/Charts';
import Summary from 'components/Summary';
import styles from './Result.module.css';


interface Props {
  data: SnappTaxiDataStorage | SnappfoodDataStorage;
  dataType?: DataSource;
}

const Result = ({ data, dataType = 'snapp' }: Props) => {
  // Extract the data based on type with proper type assertion
  const displayData = dataType === 'snapp' 
    ? (data as SnappTaxiDataStorage).rides 
    : (data as SnappfoodDataStorage).orders;
  
  // Sort years based on data pattern
  const sortedYears = useMemo(
    () => Object.keys(displayData).sort(
      (a, b) => data_pattern.indexOf(String(b)) - data_pattern.indexOf(String(a))
    ),
    [displayData]
  );

  const [selectedYear, setSelectedYear] = useState<ReactText>(sortedYears[0]);

  const handleYearSelect = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement) {
      const year = event.target.dataset.year;
      if (year) setSelectedYear(year);
    }
  }, []);

  // Calculate total statistics across all years
  const totalStats = useMemo(() => {
    const yearlyStats = Object.entries(displayData).reduce<Record<string, { count: number; price: number }>>(
      (acc, [year, yearData]) => {
        if (year === 'total') return acc;

        const { _summary } = yearData as CommonData;
        acc[year] = {
          count: _summary.count,
          price: _summary.prices,
        };
        return acc;
      }, 
      {}
    );

    if (displayData['total']) {
      displayData['total']._years = yearlyStats;
      return displayData['total'];
    }
    
    return null;
  }, [displayData]);

  // Get current year's data or total stats
  const currentData = useMemo(
    () => (selectedYear === 'total' && totalStats ? totalStats : displayData[selectedYear]),
    [displayData, selectedYear, totalStats]
  );

  if (!currentData) {
    return <div className={styles.loadData}>{constants.loadData}</div>;
  }

  return (
    <div className={styles.result}>
      <Summary
        active={selectedYear}
        onSelectYear={handleYearSelect}
        ranges={currentData._ranges}
        rates={dataType === 'snapp' ? (currentData as Rides)._rates || {} : {}}
        summary={currentData._summary}
        years={sortedYears}
        dataType={dataType}
      />
      <Charts 
        data={currentData} 
        dataType={dataType} 
      />
    </div>
  );
};

export default Result;
