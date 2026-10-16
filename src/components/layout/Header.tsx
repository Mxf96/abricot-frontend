'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

import styles from '@/styles/components/layout/Header.module.scss';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuth();

  const isDashboard = pathname.startsWith('/dashboard');
  const isProjects = pathname.startsWith('/projects');
  const isAccount = pathname.startsWith('/account');

  const getInitials = () => {
    if (user?.name) {
      const names = user.name.trim().split(/\s+/);

      if (names.length === 1) {
        return names[0].slice(0, 2).toUpperCase();
      }

      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }

    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }

    return 'U';
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

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

        <div className={styles.accountActions}>
          <Link
            href="/account"
            className={`${styles.avatar} ${
              isAccount ? styles.activeAvatar : ''
            }`}
            aria-label="Accéder à mon compte"
          >
            {getInitials()}
          </Link>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}