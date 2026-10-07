import Image from 'next/image';

import styles from '../../styles/components/layout/Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Image
        src="/assets/img/logo/Logo.svg"
        alt="Abricot"
        width={100}
        height={25}
      />

      <span>Abricot 2026</span>
    </footer>
  );
}