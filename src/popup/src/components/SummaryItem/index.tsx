import { memo } from 'react';

import type { IconNames } from 'types/IconNames';
import type { SummaryItemType, SummaryKeys } from 'types/Summary';
import type { DataSource } from 'types/Storage';

import Icon from 'components/Icon';
import styles from './SummaryItem.module.css';

type ExtraKeys = 'rate' | 'distance' | 'durations';
type Type = SummaryKeys | ExtraKeys | string;

type Props = {
  type: Type;
  value: SummaryItemType;
  dataType?: DataSource;
};

const getIconType = (type: Type, dataType: DataSource): IconNames => {
  switch (type) {
    case 'count':
      return dataType === 'snappfood' ? 'delivery' : 'car';
    case 'prices':
    case 'maxPrice':
      return 'money';
    case 'rate':
      return 'star';
    case 'distance':
      return 'car';
    case 'durations':
      return 'calendar';
    default:
      return 'car';
  }
};

const getIconColor = (dataType: DataSource) => {
  return dataType === 'snappfood' ? '#fe02a6' : '#00d16f';
};

const SummaryItem = ({
  type,
  value: { message, unit, description },
  dataType = 'snapp',
}: Props) => {
  return (
    <div className={styles.summaryItem}>
      <div className={styles.icon} data-type={dataType}>
        <Icon type={getIconType(type, dataType)} color={getIconColor(dataType)} />
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
