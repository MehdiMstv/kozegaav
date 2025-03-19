import { memo, useMemo } from 'react';

import type { Rides } from 'types/Rides';
import type { RateObject } from 'types/Summary';
import type { Props as YearSelectorProps } from 'components/YearSelector';
import type { DataSource } from 'types/Storage';
import type { SummaryKeys } from 'types/Summary';

import {
  getSummaryItemMessage,
  getRateSummaryMessage,
  getStartAndEndDate,
} from 'utils/messages';
import { summary_pattern } from 'utils/patterns';
import constants from 'utils/constants';
import useDownload from 'hooks/useDownload';
import useTweet from 'hooks/useTweet';

import Illustration from 'components/Illustration';
import ScrollDown from 'components/ScrollDown';
import SummaryItem from 'components/SummaryItem';
import YearSelector from 'components/YearSelector';
import styles from './Summary.module.css';

interface Props extends YearSelectorProps {
  rates: Rides['_rates'];
  ranges: Rides['_ranges'];
  summary: Rides['_summary'];
  dataType?: DataSource;
}

const Summary = ({
  active,
  onSelectYear,
  ranges,
  rates,
  summary,
  years,
  dataType = 'snapp',
}: Props) => {
  const {
    downloadRef,
    wrapperStyle,
    DownloadButton,
    buttonStyle,
    downloadButtonProps,
  } = useDownload({
    size: { width: 500, height: 500 },
    exportName: 'MySnapp',
  });

  const { TweetButton, tweetButtonProps } = useTweet({
    hashtags: dataType === 'snapp' ? constants.hashtag : constants.snappfood,
  });

  const keys = useMemo(
    () =>
      (Object.keys(summary) as Array<'count' | 'prices' | 'distance' | 'durations'>)
        .filter(key => dataType === 'snappfood' ? key !== 'distance' : true)
        .sort(
          (a, b) => summary_pattern.indexOf(a) - summary_pattern.indexOf(b)
        ),
    [summary, dataType]
  );

  const rate = useMemo<RateObject>(() => {
    return Object.entries(rates).reduce(
      (acc: { count: number; sum: number }, [rate, value]) => {
        if (typeof value === 'object' && 'count' in value) {
          acc.sum += value.count * Number(rate);
          acc.count += value.count;
        }
        return acc;
      },
      { count: 0, sum: 0 }
    );
  }, [rates]);

  return (
    <div className={styles.summary} ref={downloadRef}>
      <Illustration
        name="elements"
        className={styles.elements}
        width={280}
        height={200}
      />
      <ScrollDown dataType={dataType} />
      <YearSelector
        active={active}
        style={buttonStyle}
        onSelectYear={onSelectYear}
        years={years}
      />
      <div className={styles.box} style={wrapperStyle} data-type={dataType}>
        <div className={styles.buttonWrapper}>
          <DownloadButton {...downloadButtonProps} />
          <TweetButton style={buttonStyle} {...tweetButtonProps} />
        </div>
        {keys.map((key) => {
          const value = summary[key] !== undefined ? getSummaryItemMessage(summary[key], key as keyof typeof summary, dataType) : { message: '0', unit: '' };
          return <SummaryItem key={key} type={key as (SummaryKeys | 'durations')} value={value} dataType={dataType} />;
        })}
        {dataType === 'snapp' && (
          <SummaryItem type="rate" value={getRateSummaryMessage(rate, dataType)} dataType={dataType} />
        )}
        <div className={styles.date}>
          {getStartAndEndDate(ranges.start, ranges.end)}
        </div>
      </div>
    </div>
  );
};

export default memo(Summary);
