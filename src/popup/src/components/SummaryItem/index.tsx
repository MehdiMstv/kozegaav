import { memo } from 'react';

import type { IconNames } from 'types/IconNames';
import type { SummaryItemType, SummaryKeys } from 'types/Summary';
import type { DataSource, SnappTaxiDataStorage, SnappfoodDataStorage } from 'types/Storage';

import Icon from 'components/Icon';
import styles from './SummaryItem.module.css';

type ExtraKeys = 'rate' | 'distance' | 'durations';
type Type = SummaryKeys | ExtraKeys | string;

type Props = {
  type: Type;
  value: SummaryItemType;
  dataType?: DataSource;
};

const getIconType = {
  count: 'car' as IconNames,
  prices: 'money' as IconNames,
  rate: 'star' as IconNames,
  distance: 'car' as IconNames,  // Using car icon for distance
  durations: 'calendar' as IconNames, // Using calendar icon for duration
};

const getIconColor = (dataType: DataSource) => {
  return dataType === 'snappfood' ? '#fe02a6' : '#00d16f';
};

const SummaryItem = ({
  type,
  value: { message, unit, description },
  dataType = 'snapp',
}: Props) => {
  // Use a default icon if the type is not in getIconType
  const iconType = getIconType[type as keyof typeof getIconType] || 'car';
  const iconColor = getIconColor(dataType);
  
  return (
    <div className={styles.summaryItem}>
      <div className={styles.icon} data-type={dataType}>
        <Icon type={iconType} color={iconColor} />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <span>{message}</span>
          <span>{unit}</span>
        </div>
        {description && (
          <span className={styles.description}>({description})</span>
        )}
      </div>
    </div>
  );
};

export default memo(SummaryItem);
