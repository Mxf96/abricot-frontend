'use client';

import { FormEvent, useState } from 'react';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

import { useAuth } from '@/context/AuthContext';

import {
  updatePassword,
  updateProfile,
} from '@/services/authService';


import styles from '@/styles/components/account/Account.module.scss';

export default function AccountPage() {
  const { user, updateUser } = useAuth();

  /* -------------------------------------------------------------------------- */
  /*                              PROFIL UTILISATEUR                             */
  /* -------------------------------------------------------------------------- */

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                             MOT DE PASSE                                   */
  /* -------------------------------------------------------------------------- */

  const [currentPassword, setCurrentPassword] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordError, setPasswordError] = useState('');

  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [isPasswordLoading, setIsPasswordLoading] =
    useState(false);

  /* -------------------------------------------------------------------------- */
  /*                         MODIFICATION DU PROFIL                             */
  /* -------------------------------------------------------------------------- */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    setSuccess('');

    const formData = new FormData(event.currentTarget);

    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();

    const fullName = `${firstName} ${lastName}`.trim();

    if (!fullName) {
      setError(
        'Le nom est obligatoire.'
      );

      return;
    }

    if (!email.trim()) {
      setError(
        "L'adresse email est obligatoire."
      );

      return;
    }

    setIsLoading(true);

    try {
      const response =
        await updateProfile(
          fullName,
          email
        );

      updateUser(
        response.data.user
      );

      setSuccess(
        'Profil mis à jour avec succès.'
      );
    } catch (error) {
      if (
        error instanceof Error
      ) {
        setError(
          error.message
        );
      } else {
        setError(
          'Une erreur est survenue.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                     MODIFICATION DU MOT DE PASSE                          */
  /* -------------------------------------------------------------------------- */

  const handlePasswordSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setPasswordError('');

    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError(
        'Le mot de passe actuel est obligatoire.'
      );

      return;
    }

    if (!newPassword) {
      setPasswordError(
        'Le nouveau mot de passe est obligatoire.'
      );

      return;
    }

    if (
      newPassword ===
      currentPassword
    ) {
      setPasswordError(
        "Le nouveau mot de passe doit être différent de l'actuel."
      );

      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (
      !passwordRegex.test(
        newPassword
      )
    ) {
      setPasswordError(
        'Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&).'
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setPasswordError(
        'La confirmation du mot de passe ne correspond pas.'
      );

      return;
    }

    setIsPasswordLoading(true);

    try {
      const response =
        await updatePassword(
          currentPassword,
          newPassword
        );

      setCurrentPassword('');

      setNewPassword('');

      setConfirmPassword('');

      setPasswordSuccess(
        response.message ||
          'Mot de passe modifié avec succès.'
      );
    } catch (error) {
      if (
        error instanceof Error
      ) {
        setPasswordError(
          error.message
        );
      } else {
        setPasswordError(
          'Une erreur est survenue.'
        );
      }
    } finally {
      setIsPasswordLoading(
        false
      );
    }
  };

  const fullName = user?.name?.trim() ?? '';
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const initialFirstName = nameParts[0] ?? '';
  const initialLastName = nameParts.slice(1).join(' ');

  return (
    <ProtectedRoute>
      <Header />

      <main
        id="main-content"
        className={
          styles.accountPage
        }
      >
        <section
          className={
            styles.accountCard
          }
        >
          {/* -------------------------------------------------------------- */}
          {/*                           HEADER                               */}
          {/* -------------------------------------------------------------- */}

          <div
            className={
              styles.accountHeader
            }
          >
            <h1>
              Mon compte
            </h1>

            <p>
              {user?.name ??
                user?.email}
            </p>
          </div>

          {/* -------------------------------------------------------------- */}
          {/*                    INFORMATIONS PERSONNELLES                    */}
          {/* -------------------------------------------------------------- */}

          <form
            key={`${user?.id ?? 'anonymous'}-${user?.name ?? ''}-${user?.email ?? ''}`}
            className={
              styles.accountForm
            }
            onSubmit={
              handleSubmit
            }
          >
            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="lastName"
              >
                Nom
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                defaultValue={initialLastName}
                autoComplete="family-name"
              />
            </div>

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="firstName"
              >
                Prénom
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                defaultValue={initialFirstName}
                autoComplete="given-name"
              />
            </div>

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="email"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email ?? ''}
                autoComplete="email"
                required
              />
            </div>

            {error && (
              <p
                className={
                  styles.errorMessage
                }
                role="alert"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                className={
                  styles.successMessage
                }
                role="status"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              className={
                styles.submitButton
              }
              disabled={
                isLoading
              }
            >
              {isLoading
                ? 'Modification...'
                : 'Modifier les informations'}
            </button>
          </form>

          {/* -------------------------------------------------------------- */}
          {/*                    MODIFIER LE MOT DE PASSE                     */}
          {/* -------------------------------------------------------------- */}

          <section
            className={
              styles.passwordSection
            }
          >
            <div
              className={
                styles.passwordHeader
              }
            >
              <h2>
                Modifier le mot de passe
              </h2>

              <p>
                Choisissez un nouveau mot de passe pour votre compte.
              </p>
            </div>

            <form
              className={
                styles.accountForm
              }
              onSubmit={
                handlePasswordSubmit
              }
            >
              {/* ---------------------------------------------------------- */}
              {/*                 MOT DE PASSE ACTUEL                        */}
              {/* ---------------------------------------------------------- */}

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="currentPassword"
                >
                  Mot de passe actuel
                </label>

                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={
                    currentPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setCurrentPassword(
                      event.target
                        .value
                    )
                  }
                  autoComplete="current-password"
                  disabled={
                    isPasswordLoading
                  }
                  required
                />
              </div>

              {/* ---------------------------------------------------------- */}
              {/*                 NOUVEAU MOT DE PASSE                       */}
              {/* ---------------------------------------------------------- */}

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="newPassword"
                >
                  Nouveau mot de passe
                </label>

                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={
                    newPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setNewPassword(
                      event.target
                        .value
                    )
                  }
                  autoComplete="new-password"
                  aria-describedby="newPasswordHint"
                  disabled={
                    isPasswordLoading
                  }
                  required
                />

                <span
                  id="newPasswordHint"
                  className={
                    styles.fieldHint
                  }
                >
                  8 caractères minimum,
                  avec une majuscule,
                  une minuscule, un
                  chiffre et un caractère
                  spécial (@$!%*?&).
                </span>
              </div>

              {/* ---------------------------------------------------------- */}
              {/*               CONFIRMATION MOT DE PASSE                    */}
              {/* ---------------------------------------------------------- */}

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="confirmPassword"
                >
                  Confirmer le nouveau mot de passe
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setConfirmPassword(
                      event.target
                        .value
                    )
                  }
                  autoComplete="new-password"
                  disabled={
                    isPasswordLoading
                  }
                  required
                />
              </div>

              {/* ---------------------------------------------------------- */}
              {/*                         ERREUR                             */}
              {/* ---------------------------------------------------------- */}

              {passwordError && (
                <p
                  className={
                    styles.errorMessage
                  }
                  role="alert"
                >
                  {passwordError}
                </p>
              )}

              {/* ---------------------------------------------------------- */}
              {/*                        SUCCÈS                              */}
              {/* ---------------------------------------------------------- */}

              {passwordSuccess && (
                <p
                  className={
                    styles.successMessage
                  }
                  role="status"
                >
                  {passwordSuccess}
                </p>
              )}

              {/* ---------------------------------------------------------- */}
              {/*                        BOUTON                              */}
              {/* ---------------------------------------------------------- */}

              <button
                type="submit"
                className={
                  styles.submitButton
                }
                disabled={
                  isPasswordLoading
                }
              >
                {isPasswordLoading
                  ? 'Modification...'
                  : 'Modifier le mot de passe'}
              </button>
            </form>
          </section>
        </section>
      </main>

      <Footer />
    </ProtectedRoute>
  );
}