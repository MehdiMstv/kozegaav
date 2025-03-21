import {
  lazy,
  MouseEvent,
  ReactText,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react';
import setWith from 'lodash.setwith';

import type { Rides, RidesData, Orders, OrdersData, CommonData } from 'types/Rides';
import type { DataSource, SnappTaxiDataStorage, SnappfoodDataStorage } from 'types/Storage';

import constants from 'utils/constants';
import { data_pattern } from 'utils/patterns';

import Charts from 'components/Charts';
import Illustration from 'components/Illustration';
import Link from 'components/Link';
import Summary from 'components/Summary';
import styles from './Result.module.css';


interface Props {
  data: SnappTaxiDataStorage | SnappfoodDataStorage;
  dataType?: DataSource;
}

const Result = ({ data,  dataType = 'snapp' }: Props) => {
  // Extract the data based on type
  const displayData = dataType === 'snapp' 
    ? (data as SnappTaxiDataStorage).rides 
    : (data as SnappfoodDataStorage).orders;
  
  const options = useMemo(
    () =>
      Object.keys(displayData).sort((a, b) => {
        return (
          data_pattern.indexOf(b as string) - data_pattern.indexOf(a as string)
        );
      }),
    [displayData]
  );
  const [year, setYear] = useState<ReactText>(options[0]);

  const handleSelectYear = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement) {
      const year = event.target.dataset.year as string;
      setYear(year);
    }
  }, []);

  const getTotal = useMemo(() => {
    const _years = Object.keys(displayData).reduce((tmp, year) => {
      if (year === 'total') {
        return tmp;
      }

      const { _summary } = displayData[year] as CommonData;

      // add _years chart
      setWith(tmp, [year], {
        count: _summary.count,
        price: _summary.prices,
      });

      return tmp;
    }, {});

    if (displayData['total']) {
      displayData['total']._years = _years;
      return displayData['total'];
    }
    
    return null;
  }, [displayData]);

  const currentData = useMemo(
    () => (year === 'total' && getTotal ? getTotal : displayData[year]),
    [displayData, year, getTotal]
  );

  if (!currentData) {
    return <div className={styles.loadData}>{constants.loadData}</div>;
  }

  return (
    <div className={styles.result}>
      <Summary
        active={year}
        onSelectYear={handleSelectYear}
        ranges={currentData._ranges}
        rates={currentData._rates || {}}
        summary={currentData._summary}
        years={options}
        dataType={dataType}
      />
      <Charts data={currentData} dataType={dataType} />
    </div>
  );
};

export default Result;
