'use client';

import { FormEvent, useState } from 'react';

import Modal from './Modal';

import { createTask } from '@/services/projectService';

import { getAuthToken } from '@/utils/authStorage';

import styles from '@/styles/components/modals/Modal.module.scss';

export type TaskAssigneeOption = {
  id: string;
  name: string;
};

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';

  projectId: string;

  assignees: TaskAssigneeOption[];

  onSuccess?: () => void;
};

export default function TaskModal({
  isOpen,
  onClose,
  mode,
  projectId,
  assignees,
  onSuccess,
}: TaskModalProps) {
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

    if (!projectId) {
      setError('Projet introuvable.');

      return;
    }

    const form = event.currentTarget;

    const formData = new FormData(form);

    const title = String(formData.get('title') ?? '').trim();

    const description = String(formData.get('description') ?? '').trim();

    const dueDate = String(formData.get('dueDate') ?? '').trim();

    const priority = String(formData.get('priority') ?? 'MEDIUM') as
      'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

    const assigneeIds = formData
      .getAll('assignees')
      .map((id) => String(id))
      .filter(Boolean);

    if (!title) {
      setError('Le titre de la tâche est obligatoire.');

      return;
    }

    if (title.length < 2) {
      setError('Le titre doit contenir au moins 2 caractères.');

      return;
    }

    setIsLoading(true);

    try {
      await createTask(token, projectId, {
        title,

        description: description || undefined,

        priority,

        dueDate: dueDate || undefined,

        assigneeIds: assigneeIds.length > 0 ? assigneeIds : undefined,
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
        <h2>{isEdit ? 'Modifier' : 'Créer une tâche'}</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="task-title">{isEdit ? 'Titre' : 'Titre*'}</label>

            <input
              id="task-title"
              name="title"
              type="text"
              minLength={2}
              maxLength={200}
              required={!isEdit}
              defaultValue={isEdit ? 'Authentification JWT' : ''}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="task-description">Description</label>

            <input
              id="task-description"
              name="description"
              type="text"
              maxLength={1000}
              defaultValue={
                isEdit
                  ? "Implémenter le système d'authentification avec tokens JWT"
                  : ''
              }
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="task-date">Échéance</label>

            <input id="task-date" name="dueDate" type="date" />
          </div>

          {!isEdit && (
            <div className={styles.field}>
              <label htmlFor="task-priority">Priorité</label>

              <select id="task-priority" name="priority" defaultValue="MEDIUM">
                <option value="LOW">Faible</option>

                <option value="MEDIUM">Moyenne</option>

                <option value="HIGH">Haute</option>

                <option value="URGENT">Urgente</option>
              </select>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="task-assignees">Assigné à :</label>

            <select
              id="task-assignees"
              name="assignees"
              className={styles.multiSelect}
              multiple
              size={Math.min(Math.max(assignees.length, 2), 5)}
              defaultValue={assignees.length === 1 ? [assignees[0].id] : []}
            >
              {assignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>

            <span className={styles.fieldHint}>
              Vous pouvez sélectionner plusieurs collaborateurs.
            </span>
          </div>

          {!isEdit && (
            <fieldset className={styles.statusField}>
              <legend>Statut :</legend>

              <div className={styles.statusList}>
                <span className={`${styles.status} ${styles.todo}`}>
                  À faire
                </span>
              </div>
            </fieldset>
          )}

          {isEdit && (
            <fieldset className={styles.statusField}>
              <legend>Statut :</legend>

              <div className={styles.statusList}>
                <label className={`${styles.status} ${styles.todo}`}>
                  <input
                    type="radio"
                    name="status"
                    value="todo"
                    defaultChecked
                  />
                  À faire
                </label>

                <label className={`${styles.status} ${styles.inProgress}`}>
                  <input type="radio" name="status" value="in-progress" />
                  En cours
                </label>

                <label className={`${styles.status} ${styles.done}`}>
                  <input type="radio" name="status" value="done" />
                  Terminée
                </label>
              </div>
            </fieldset>
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
                : '+ Ajouter une tâche'}
          </button>
        </form>
      </div>
    </Modal>
  );
}