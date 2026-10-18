'use client';

import { FormEvent, useState } from 'react';

import Modal from './Modal';

import {
  ApiProjectDetails,
  ContributorRole,
  addContributor,
  createProject,
  removeContributor,
  updateProject,
} from '@/services/projectService';

import { getAuthToken } from '@/utils/authStorage';

import styles from '@/styles/components/modals/Modal.module.scss';

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;

  mode: 'create' | 'edit';

  project?: ApiProjectDetails | null;

  onSuccess?: () => void;
};

export default function ProjectModal({
  isOpen,
  onClose,
  mode,
  project = null,
  onSuccess,
}: ProjectModalProps) {
  const isEdit = mode === 'edit';

  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [contributorEmail, setContributorEmail] = useState('');

  const [contributorRole, setContributorRole] =
    useState<ContributorRole>('CONTRIBUTOR');

  const [contributorError, setContributorError] = useState('');

  const [isContributorLoading, setIsContributorLoading] = useState(false);

  const handleClose = () => {
    if (isLoading || isContributorLoading) {
      return;
    }

    setError('');
    setContributorError('');
    setContributorEmail('');
    setContributorRole('CONTRIBUTOR');

    onClose();
  };

  const handleAddContributor = async () => {
    if (!project) {
      setContributorError('Projet introuvable.');

      return;
    }

    const email = contributorEmail.trim().toLowerCase();

    if (!email) {
      setContributorError("L'adresse email est obligatoire.");

      return;
    }

    const token = getAuthToken();

    if (!token) {
      setContributorError('Session utilisateur introuvable.');

      return;
    }

    setContributorError('');
    setIsContributorLoading(true);

    try {
      await addContributor(token, project.id, {
        email,
        role: contributorRole,
      });

      setContributorEmail('');
      setContributorRole('CONTRIBUTOR');

      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        setContributorError(error.message);
      } else {
        setContributorError('Une erreur est survenue.');
      }
    } finally {
      setIsContributorLoading(false);
    }
  };

  const handleRemoveContributor = async (userId: string) => {
    if (!project) {
      setContributorError('Projet introuvable.');

      return;
    }

    const token = getAuthToken();

    if (!token) {
      setContributorError('Session utilisateur introuvable.');

      return;
    }

    setContributorError('');
    setIsContributorLoading(true);

    try {
      await removeContributor(token, project.id, userId);

      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        setContributorError(error.message);
      } else {
        setContributorError('Une erreur est survenue.');
      }
    } finally {
      setIsContributorLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    const token = getAuthToken();

    if (!token) {
      setError('Session utilisateur introuvable.');

      return;
    }

    if (isEdit && !project) {
      setError('Projet introuvable.');

      return;
    }

    const form = event.currentTarget;

    const formData = new FormData(form);

    const name = String(formData.get('name') ?? '').trim();

    const description = String(formData.get('description') ?? '').trim();

    if (!name) {
      setError('Le nom du projet est obligatoire.');

      return;
    }

    const contributorsValue = String(formData.get('contributors') ?? '').trim();

    const contributors = contributorsValue
      ? contributorsValue
          .split(',')
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean)
      : [];

    setIsLoading(true);

    try {
      if (isEdit && project) {
        await updateProject(token, project.id, {
          name,
          description,
        });
      } else {
        await createProject(token, {
          name,

          description: description || undefined,

          contributors: contributors.length > 0 ? contributors : undefined,
        });
      }

      form.reset();

      setError('');
      setContributorError('');
      setContributorEmail('');
      setContributorRole('CONTRIBUTOR');

      onClose();

      onSuccess?.();
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
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.formModal}>
        <h2>{isEdit ? 'Modifier un projet' : 'Créer un projet'}</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="project-title">Titre*</label>

            <input
              id="project-title"
              name="name"
              type="text"
              minLength={2}
              maxLength={100}
              required
              defaultValue={isEdit ? (project?.name ?? '') : ''}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="project-description">Description*</label>

            <input
              id="project-description"
              name="description"
              type="text"
              maxLength={500}
              required
              defaultValue={isEdit ? (project?.description ?? '') : ''}
            />
          </div>

          {/* -------------------------------------------------------------- */}
          {/*                    CRÉATION DU PROJET                           */}
          {/* -------------------------------------------------------------- */}

          {!isEdit && (
            <div className={styles.field}>
              <label htmlFor="project-contributors">Contributeurs</label>

              <input
                id="project-contributors"
                name="contributors"
                type="text"
                placeholder="alice@example.com, bob@example.com"
              />

              <span className={styles.fieldHint}>
                Séparez plusieurs adresses email par une virgule.
              </span>
            </div>
          )}

          {/* -------------------------------------------------------------- */}
          {/*                    MODIFICATION DU PROJET                       */}
          {/* -------------------------------------------------------------- */}

          {isEdit && project && (
            <div className={styles.contributorsField}>
              <label>Contributeurs</label>

              <details className={styles.contributorsDetails}>
                <summary>
                  {project.members.length === 0
                    ? 'Aucun collaborateur'
                    : `${project.members.length} ${
                        project.members.length > 1
                          ? 'collaborateurs'
                          : 'collaborateur'
                      }`}
                </summary>

                <div className={styles.contributorsPanel}>
                  {/* ------------------------------------------------------ */}
                  {/*               CONTRIBUTEURS EXISTANTS                  */}
                  {/* ------------------------------------------------------ */}

                  {project.members.length > 0 ? (
                    <div className={styles.contributorsList}>
                      {project.members.map((member) => (
                        <div key={member.id} className={styles.contributorItem}>
                          <div>
                            <strong>
                              {member.user.name?.trim() || member.user.email}
                            </strong>

                            {member.user.name && (
                              <span>{member.user.email}</span>
                            )}

                            <small>
                              {member.role === 'ADMIN'
                                ? 'Administrateur'
                                : 'Contributeur'}
                            </small>
                          </div>

                          <button
                            type="button"
                            className={styles.removeContributorButton}
                            disabled={isContributorLoading}
                            onClick={() =>
                              handleRemoveContributor(member.user.id)
                            }
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noContributors}>
                      Aucun contributeur pour le moment.
                    </p>
                  )}

                  {/* ------------------------------------------------------ */}
                  {/*                 AJOUT CONTRIBUTEUR                     */}
                  {/* ------------------------------------------------------ */}

                  <div className={styles.addContributor}>
                    <input
                      type="email"
                      value={contributorEmail}
                      onChange={(event) =>
                        setContributorEmail(event.target.value)
                      }
                      placeholder="email@exemple.com"
                      aria-label="Email du contributeur"
                      disabled={isContributorLoading}
                    />

                    <select
                      value={contributorRole}
                      onChange={(event) =>
                        setContributorRole(
                          event.target.value as ContributorRole
                        )
                      }
                      aria-label="Rôle du contributeur"
                      disabled={isContributorLoading}
                    >
                      <option value="CONTRIBUTOR">Contributeur</option>

                      <option value="ADMIN">Administrateur</option>
                    </select>

                    <button
                      type="button"
                      className={styles.addContributorButton}
                      disabled={isContributorLoading}
                      onClick={handleAddContributor}
                    >
                      {isContributorLoading ? 'Chargement...' : '+ Ajouter'}
                    </button>
                  </div>

                  {contributorError && (
                    <p className={styles.errorMessage} role="alert">
                      {contributorError}
                    </p>
                  )}
                </div>
              </details>
            </div>
          )}

          {/* -------------------------------------------------------------- */}
          {/*                       ERREUR PROJET                             */}
          {/* -------------------------------------------------------------- */}

          {error && (
            <p className={styles.errorMessage} role="alert">
              {error}
            </p>
          )}

          {/* -------------------------------------------------------------- */}
          {/*                         SUBMIT                                  */}
          {/* -------------------------------------------------------------- */}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || isContributorLoading}
          >
            {isLoading
              ? isEdit
                ? 'Modification...'
                : 'Création...'
              : isEdit
                ? 'Enregistrer'
                : 'Ajouter un projet'}
          </button>
        </form>
      </div>
    </Modal>
  );
}