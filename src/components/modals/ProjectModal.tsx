'use client';

import { FormEvent, useState } from 'react';

import Modal from './Modal';

import { createProject } from '@/services/projectService';

import { getAuthToken } from '@/utils/authStorage';

import styles from '@/styles/components/modals/Modal.module.scss';

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
};

export default function ProjectModal({
  isOpen,
  onClose,
  mode,
  onSuccess,
}: ProjectModalProps) {
  const isEdit = mode === 'edit';

  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (isLoading) {
      return;
    }

    setError('');
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit) {
      return;
    }

    setError('');

    const token = getAuthToken();

    if (!token) {
      setError('Session utilisateur introuvable.');

      return;
    }

    const form = event.currentTarget;

    const formData = new FormData(form);

    const name = String(formData.get('name') ?? '').trim();

    const description = String(formData.get('description') ?? '').trim();

    const contributorsValue = String(formData.get('contributors') ?? '').trim();

    const contributors = contributorsValue
      ? contributorsValue
          .split(',')
          .map((email) => email.trim())
          .filter(Boolean)
      : [];

    if (!name) {
      setError('Le nom du projet est obligatoire.');

      return;
    }

    setIsLoading(true);

    try {
      await createProject(token, {
        name,

        description: description || undefined,

        contributors: contributors.length > 0 ? contributors : undefined,
      });

      form.reset();

      setError('');

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
              defaultValue={isEdit ? 'Input' : ''}
              minLength={2}
              maxLength={100}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="project-description">Description*</label>

            <input
              id="project-description"
              name="description"
              type="text"
              defaultValue={isEdit ? 'Input' : ''}
              maxLength={500}
              required
            />
          </div>

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

          {error && (
            <p className={styles.errorMessage} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || isEdit}
          >
            {isLoading
              ? 'Création...'
              : isEdit
                ? 'Enregistrer'
                : 'Ajouter un projet'}
          </button>
        </form>
      </div>
    </Modal>
  );
}