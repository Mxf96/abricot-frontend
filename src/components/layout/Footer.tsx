import Image from 'next/image';

import styles from '../../styles/components/layout/Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Image
        src="/assets/img/logo/Logo_footer.jpg"
        alt="Abricot 2026"
        width={101}
        height={12.86}
      />

      <span>Abricot 2026</span>
    </footer>
  );
}