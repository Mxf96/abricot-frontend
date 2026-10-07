import Image from 'next/image';
import Link from 'next/link';

import styles from '../../styles/components/layout/Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" className={styles.logo}>
          <Image
            src="/assets/img/logo/Logo.jpg"
            alt="Abricot"
            width={145}
            height={35}
            priority
          />
        </Link>

        <nav className={styles.navigation} aria-label="Navigation principale">
          <Link
            href="/dashboard"
            className={`${styles.navLink} ${styles.active}`}
          >
            <span className={styles.dashboardIcon}>▦</span>
            Tableau de bord
          </Link>

          <Link href="/projects" className={styles.navLink}>
            <span className={styles.projectIcon}>▰</span>
            Projets
          </Link>
        </nav>

        <Link
          href="/account"
          className={styles.avatar}
          aria-label="Accéder à mon compte"
        >
          AD
        </Link>
      </div>
    </header>
  );
}