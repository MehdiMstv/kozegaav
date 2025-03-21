import Link from 'components/Link';
import { memo } from 'react';
import constants from 'utils/constants';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <Link className={styles.link} url="snappHome">
        {constants.snapp}
      </Link>
      <Link className={styles.link} url="github">
        {constants.github}
      </Link>
      <Link className={styles.link} url="MehdiMstv">
        {constants.creator}
      </Link>
    </div>
  );
};

export default memo(Footer);
