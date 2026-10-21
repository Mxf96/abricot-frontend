'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

import styles from '@/styles/components/layout/Header.module.scss';

import logoImage from '../../../public/assets/img/logo/Logo.jpg';

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

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        Aller au contenu principal
      </a>

      <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" className={styles.logo}>
          <Image src={logoImage} alt="Abricot" priority />
        </Link>

        <nav className={styles.navigation} aria-label="Navigation principale">
          <Link
            href="/dashboard"
            className={`${styles.navLink} ${
              isDashboard ? styles.activeNavLink : ''
            }`}
            aria-current={isDashboard ? 'page' : undefined}
          >
            <Image
              src={
                isDashboard
                  ? '/assets/img/icons/table_active.png'
                  : '/assets/img/icons/table.png'
              }
              alt=""
              width={24}
              height={24}
              className={styles.navIcon}
            />

            <span>Tableau de bord</span>
          </Link>

          <Link
            href="/projects"
            className={`${styles.navLink} ${
              isProjects ? styles.activeNavLink : ''
            }`}
            aria-current={isProjects ? 'page' : undefined}
          >
            <Image
              src={
                isProjects
                  ? '/assets/img/icons/folder_active.png'
                  : '/assets/img/icons/folder.png'
              }
              alt=""
              width={25}
              height={25}
              className={styles.navIcon}
            />

            <span>Projets</span>
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
    </>
  );
}