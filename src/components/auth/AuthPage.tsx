import Image from 'next/image';
import Link from 'next/link';

import styles from '../../styles/components/auth/AuthPage.module.scss';

type AuthPageProps = {
  mode: 'login' | 'register' | 'forgot-password';
};

export default function AuthPage({ mode }: AuthPageProps) {
  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isForgotPassword = mode === 'forgot-password';

  const title = isLogin
    ? 'Connexion'
    : isRegister
      ? 'Inscription'
      : 'Mot de passe oublié';

  const buttonText = isLogin
    ? 'Se connecter'
    : isRegister
      ? "S'inscrire"
      : 'Réinitialiser le mot de passe';

  const backgroundImage = isLogin
    ? '/assets/img/login/Log_In.jpg'
    : '/assets/img/login/Sign_In.jpg ';

  return (
    <main className={styles.authPage}>
      <section className={styles.authPanel}>
        <div className={styles.authContent}>
          <Image
            className={styles.logo}
            src="/assets/img/logo/Logo.jpg"
            alt="Abricot"
            width={254}
            height={50}
            priority
          />

          <div className={styles.formContainer}>
            <h1 className={isForgotPassword ? styles.forgotTitle : undefined}>
              {title}
            </h1>

            {isForgotPassword && (
              <p className={styles.forgotDescription}>
                Saisissez votre adresse email pour réinitialiser votre mot de
                passe.
              </p>
            )}

            <form>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                />
              </div>

              {!isForgotPassword && (
                <div className={styles.field}>
                  <label htmlFor="password">Mot de passe</label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                </div>
              )}

              <button className={styles.submitButton} type="submit">
                {buttonText}
              </button>

              {isLogin && (
                <div className={styles.forgotPassword}>
                  <Link href="/forgot-password">Mot de passe oublié ?</Link>
                </div>
              )}

              {isForgotPassword && (
                <div className={styles.forgotPassword}>
                  <Link href="/login">Retour à la connexion</Link>
                </div>
              )}
            </form>
          </div>

          {!isForgotPassword && (
            <div className={styles.switchPage}>
              {isLogin ? (
                <>
                  <span>Pas encore de compte ?</span>
                  <Link href="/register">Créer un compte</Link>
                </>
              ) : (
                <>
                  <span>Déjà inscrit ?</span>
                  <Link href="/login">Se connecter</Link>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section
        className={styles.imagePanel}
        style={{
          backgroundImage: `url("${backgroundImage}")`,
        }}
        aria-hidden="true"
      />
    </main>
  );
}