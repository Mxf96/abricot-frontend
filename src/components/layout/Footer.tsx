import Image from 'next/image';

import styles from '../../styles/components/layout/Footer.module.scss';

import footerLogoImage from '../../../public/assets/img/logo/Logo_footer.jpg';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Image className={styles.logo} src={footerLogoImage} alt="" />

      <span>Abricot 2026</span>
    </footer>
  );
}