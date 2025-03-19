import { memo } from 'react';
import type { DataSource } from 'types/Storage';
import styles from './ScrollDown.module.css';

interface Props {
  dataType?: DataSource;
}

const ScrollDown = ({ dataType = 'snapp' }: Props) => {
  return (
    <div className={styles.wrapper} data-type={dataType}>
      <span className={styles.chevron} />
      <span className={styles.chevron} />
      <span className={styles.chevron} />
    </div>
  );
};

export default memo(ScrollDown);
