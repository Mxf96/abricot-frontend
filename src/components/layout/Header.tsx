'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from '@/styles/components/layout/Header.module.scss';

export default function Header() {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/dashboard');
  const isProjects = pathname.startsWith('/projects');

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" className={styles.logo}>
          <Image
            src="/assets/img/logo/Logo.jpg"
            alt="Abricot"
            width={147}
            height={19}
            priority
          />
        </Link>

        <nav className={styles.navigation} aria-label="Navigation principale">
          <Link
            href="/dashboard"
            className={styles.navImageLink}
            aria-label="Tableau de bord"
          >
            <Image
              src={
                isDashboard
                  ? '/assets/img/icons/table_active.jpg'
                  : '/assets/img/icons/table.jpg'
              }
              alt=""
              fill
              sizes="200px"
              className={styles.navImage}
              priority
            />
          </Link>

          <Link
            href="/projects"
            className={styles.navImageLink}
            aria-label="Projets"
          >
            <Image
              src={
                isProjects
                  ? '/assets/img/icons/folder_active.jpg'
                  : '/assets/img/icons/folder.jpg'
              }
              alt=""
              fill
              sizes="200px"
              className={styles.navImage}
              priority
            />
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