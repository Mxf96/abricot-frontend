'use client';

import { FormEvent, useState } from 'react';

import Modal from './Modal';

import {
  ApiProjectTask,
  createTask,
  updateTask,
} from '@/services/projectService';

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

  task?: ApiProjectTask | null;

  onSuccess?: () => void;
};

function getDateInputValue(date: string | null | undefined) {
  if (!date) {
    return '';
  }

  return new Date(date).toISOString().slice(0, 10);
}

type AssigneeSelectorProps = {
  assignees: TaskAssigneeOption[];
  initialSelectedIds: string[];
};

function AssigneeSelector({
  assignees,
  initialSelectedIds,
}: AssigneeSelectorProps) {
  const [selectedAssigneeIds, setSelectedAssigneeIds] =
    useState<string[]>(initialSelectedIds);

  const toggleAssignee = (userId: string) => {
    setSelectedAssigneeIds((current) => {
      if (current.includes(userId)) {
        return current.filter((id) => id !== userId);
      }

      return [...current, userId];
    });
  };

  return (
    <fieldset className={styles.assigneesField}>
      <legend>Assigné à :</legend>

      {assignees.length === 0 ? (
        <p className={styles.noAssignees}>Aucun utilisateur disponible.</p>
      ) : (
        <div className={styles.assigneesList}>
          {assignees.map((assignee) => {
            const isSelected = selectedAssigneeIds.includes(assignee.id);

            return (
              <label
                key={assignee.id}
                className={`${styles.assigneeOption} ${
                  isSelected ? styles.assigneeOptionSelected : ''
                }`}
              >
                <input
                  type="checkbox"
                  name="assignees"
                  value={assignee.id}
                  checked={isSelected}
                  onChange={() => toggleAssignee(assignee.id)}
                />

                <span className={styles.assigneeCheckbox}>
                  {isSelected ? '✓' : ''}
                </span>

                <span className={styles.assigneeName}>{assignee.name}</span>
              </label>
            );
          })}
        </div>
      )}

      <span className={styles.fieldHint}>
        Cliquez sur un utilisateur pour l&apos;ajouter ou le retirer de la
        tâche.
      </span>
    </fieldset>
  );
}

export default function TaskModal({
  isOpen,
  onClose,
  mode,
  projectId,
  assignees,
  task = null,
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

    setError('');

    if (!projectId) {
      setError('Projet introuvable.');

      return;
    }

    if (isEdit && !task) {
      setError('Tâche introuvable.');

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

    const status = String(formData.get('status') ?? 'TODO') as
      'TODO' | 'IN_PROGRESS' | 'DONE';

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
      if (isEdit && task) {
        await updateTask(projectId, task.id, {
          title,
          description,
          priority,
          status,
          dueDate,
          assigneeIds,
        });
      } else {
        await createTask(projectId, {
          title,
          description: description || undefined,
          priority,
          dueDate: dueDate || undefined,
          assigneeIds: assigneeIds.length > 0 ? assigneeIds : undefined,
        });
      }

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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={isEdit ? 'Modifier la tâche' : 'Créer une tâche'}
    >
      <div className={styles.formModal}>
        <h2>{isEdit ? 'Modifier la tâche' : 'Créer une tâche'}</h2>

        <form onSubmit={handleSubmit}>
          {/* -------------------------------------------------------------- */}
          {/*                              TITRE                             */}
          {/* -------------------------------------------------------------- */}

          <div className={styles.field}>
            <label htmlFor="task-title">Titre*</label>

            <input
              id="task-title"
              name="title"
              type="text"
              minLength={2}
              maxLength={200}
              required
              defaultValue={isEdit ? (task?.title ?? '') : ''}
            />
          </div>

          {/* -------------------------------------------------------------- */}
          {/*                          DESCRIPTION                           */}
          {/* -------------------------------------------------------------- */}

          <div className={styles.field}>
            <label htmlFor="task-description">Description</label>

            <input
              id="task-description"
              name="description"
              type="text"
              maxLength={1000}
              defaultValue={isEdit ? (task?.description ?? '') : ''}
            />
          </div>

          {/* -------------------------------------------------------------- */}
          {/*                            ÉCHÉANCE                            */}
          {/* -------------------------------------------------------------- */}

          <div className={styles.field}>
            <label htmlFor="task-date">Échéance</label>

            <input
              id="task-date"
              name="dueDate"
              type="date"
              defaultValue={isEdit ? getDateInputValue(task?.dueDate) : ''}
            />
          </div>

          {/* -------------------------------------------------------------- */}
          {/*                            PRIORITÉ                            */}
          {/* -------------------------------------------------------------- */}

          <div className={styles.field}>
            <label htmlFor="task-priority">Priorité</label>

            <select
              id="task-priority"
              name="priority"
              defaultValue={isEdit ? (task?.priority ?? 'MEDIUM') : 'MEDIUM'}
            >
              <option value="LOW">Faible</option>

              <option value="MEDIUM">Moyenne</option>

              <option value="HIGH">Haute</option>

              <option value="URGENT">Urgente</option>
            </select>
          </div>

          {/* -------------------------------------------------------------- */}
          {/*                            ASSIGNÉS                            */}
          {/* -------------------------------------------------------------- */}

          <AssigneeSelector
            assignees={assignees}
            initialSelectedIds={
              isEdit && task
                ? task.assignees.map((assignee) => assignee.user.id)
                : assignees.length === 1
                  ? [assignees[0].id]
                  : []
            }
          />

          {/* -------------------------------------------------------------- */}
          {/*                     STATUT - CRÉATION                          */}
          {/* -------------------------------------------------------------- */}

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

          {/* -------------------------------------------------------------- */}
          {/*                    STATUT - MODIFICATION                        */}
          {/* -------------------------------------------------------------- */}

          {isEdit && (
            <fieldset className={styles.statusField}>
              <legend>Statut :</legend>

              <div className={styles.statusList}>
                <label className={`${styles.status} ${styles.todo}`}>
                  <input
                    type="radio"
                    name="status"
                    value="TODO"
                    defaultChecked={task?.status === 'TODO'}
                  />
                  À faire
                </label>

                <label className={`${styles.status} ${styles.inProgress}`}>
                  <input
                    type="radio"
                    name="status"
                    value="IN_PROGRESS"
                    defaultChecked={task?.status === 'IN_PROGRESS'}
                  />
                  En cours
                </label>

                <label className={`${styles.status} ${styles.done}`}>
                  <input
                    type="radio"
                    name="status"
                    value="DONE"
                    defaultChecked={task?.status === 'DONE'}
                  />
                  Terminée
                </label>
              </div>
            </fieldset>
          )}

          {/* -------------------------------------------------------------- */}
          {/*                             ERREUR                             */}
          {/* -------------------------------------------------------------- */}

          {error && (
            <p className={styles.errorMessage} role="alert">
              {error}
            </p>
          )}

          {/* -------------------------------------------------------------- */}
          {/*                             SUBMIT                             */}
          {/* -------------------------------------------------------------- */}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading
              ? isEdit
                ? 'Modification...'
                : 'Création...'
              : isEdit
                ? 'Enregistrer'
                : '+ Ajouter une tâche'}
          </button>
        </form>
      </div>
    </Modal>
  );
}