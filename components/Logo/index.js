import Image from 'next/image';

import styles from '../../styles/Home.module.css';

export const Logo = () => (
  <div className={styles.logo}>
    <Image
      src="/reverse.svg"
      alt="R feather logo by ruslyeffendi3120760"
      width={40}
      height={40}
    />
  </div>
);
