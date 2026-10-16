'use client';

import { FormEvent, useEffect, useState } from 'react';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

import { useAuth } from '@/context/AuthContext';

import { updateProfile } from '@/services/authService';

import { getAuthToken } from '@/utils/authStorage';

import styles from '@/styles/components/account/Account.module.scss';

export default function AccountPage() {
  const { user, updateUser } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fullName = user.name?.trim() ?? '';
    const nameParts = fullName.split(/\s+/).filter(Boolean);

    const firstNameValue = nameParts.shift() ?? '';
    const lastNameValue = nameParts.join(' ');

    setFirstName(firstNameValue);
    setLastName(lastNameValue);
    setEmail(user.email);
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    const token = getAuthToken();

    if (!token) {
      setError('Session utilisateur introuvable.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (!fullName) {
      setError('Le nom est obligatoire.');
      return;
    }

    if (!email.trim()) {
      setError("L'adresse email est obligatoire.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await updateProfile(token, fullName, email.trim());

      updateUser(response.data.user);

      setSuccess('Profil mis à jour avec succès.');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Une erreur est survenue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Header />

      <main className={styles.accountPage}>
        <section className={styles.accountCard}>
          <div className={styles.accountHeader}>
            <h1>Mon compte</h1>

            <p>{user?.name ?? user?.email}</p>
          </div>

          <form className={styles.accountForm} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="lastName">Nom</label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="firstName">Prénom</label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {error && (
              <p className={styles.errorMessage} role="alert">
                {error}
              </p>
            )}

            {success && <p className={styles.successMessage}>{success}</p>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Modification...' : 'Modifier les informations'}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </ProtectedRoute>
  );
}