'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { login, register } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

import styles from '../../styles/components/auth/AuthPage.module.scss';

import logoImage from '../../../public/assets/img/logo/Logo.jpg';

type AuthPageProps = {
  mode: 'login' | 'register' | 'forgot-password';
};

export default function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const { saveSession } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    : '/assets/img/login/Sign_In.jpg';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password);

        router.push('/login');
        return;
      }

      if (isLogin) {
        const response = await login(email, password);

        saveSession(response.data.user);

        router.push('/dashboard');
        return;
      }

      if (isForgotPassword) {
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Une erreur est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.authPage}>
      <section className={styles.authPanel}>
        <div className={styles.authContent}>
          <Image src={logoImage} alt="Abricot" priority />

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

            <form onSubmit={handleSubmit}>
              {isRegister && (
                <div className={styles.field}>
                  <label htmlFor="name">Nom</label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
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
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              )}

              {error && <p role="alert">{error}</p>}

              <button
                className={styles.submitButton}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : buttonText}
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