import {
  MouseEvent,
  ReactText,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { memo } from 'react';

import type { Rides } from 'types/Rides';
import type { RateObject } from 'types/Summary';
import type { Props as YearSelectorProps } from 'components/YearSelector';
import type { DataSource } from 'types/Storage';
import type { SummaryKeys } from 'types/Summary';
import type { CountPriceObject } from 'types/Rides';
import type { CommonSummary } from 'types/Rides';

import {
  getFormattedSummary,
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

type Props = {
  active: ReactText;
  onSelectYear: (event: MouseEvent<HTMLDivElement>) => void;
  ranges?: {
    start: string;
    end: string;
  };
  rates: CountPriceObject;
  summary: CommonSummary;
  years: string[];
  dataType?: DataSource;
};

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

  const rate = useMemo<{ count: number; sum: number }>(() => {
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

  const keys = useMemo(
    () =>
      (Object.keys(summary) as Array<'count' | 'prices' | 'distance' | 'durations' | 'maxPrice'>)
        .filter(key => {
          if (dataType === 'snappfood') {
            return key === 'count' || key === 'prices' || key === 'durations' || key === 'maxPrice';
          }
          return key !== 'maxPrice';
        })
        .sort(
          (a, b) => summary_pattern.indexOf(a) - summary_pattern.indexOf(b)
        ),
    [summary, dataType]
  );

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
        {keys.map((key) => (
          <SummaryItem
            key={key}
            type={key}
            value={getFormattedSummary[key].format(summary[key], dataType)}
            dataType={dataType}
          />
        ))}
        {rate.count > 0 && dataType === 'snapp' && (
          <SummaryItem type="rate" value={getRateSummaryMessage(rate, dataType)} dataType={dataType} />
        )}
        {ranges && (
          <div className={styles.date}>
            {getStartAndEndDate(ranges.start, ranges.end)}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Summary);
