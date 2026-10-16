'use client';

import Modal from './Modal';

import styles from '@/styles/components/modals/Modal.module.scss';

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
};

export default function TaskModal({ isOpen, onClose, mode }: TaskModalProps) {
  const isEdit = mode === 'edit';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.formModal}>
        <h2>{isEdit ? 'Modifier' : 'Créer une tâche'}</h2>

        <form onSubmit={(event) => event.preventDefault()}>
          <div className={styles.field}>
            <label htmlFor="task-title">{isEdit ? 'Titre' : 'Titre*'}</label>

            <input
              id="task-title"
              name="title"
              type="text"
              defaultValue={isEdit ? 'Authentification JWT' : ''}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="task-description">
              {isEdit ? 'Description' : 'Description*'}
            </label>

            <input
              id="task-description"
              name="description"
              type="text"
              defaultValue={
                isEdit
                  ? "Implémenter le système d'authentification avec tokens JWT"
                  : ''
              }
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="task-date">
              {isEdit ? 'Échéance' : 'Échéance*'}
            </label>

            <input
              id="task-date"
              name="date"
              type="text"
              defaultValue={isEdit ? '9 mars' : ''}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="task-assignees">Assigné à :</label>

            <select id="task-assignees" name="assignees" defaultValue="">
              <option value="" disabled>
                {isEdit
                  ? '2 collaborateurs'
                  : 'Choisir un ou plusieurs collaborateurs'}
              </option>

              <option value="1">Bertrand Dupont</option>
              <option value="2">Anne Dupont</option>
            </select>
          </div>

          <fieldset className={styles.statusField}>
            <legend>Statut :</legend>

            <div className={styles.statusList}>
              <label className={`${styles.status} ${styles.todo}`}>
                <input type="radio" name="status" value="todo" defaultChecked />
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

          <button type="submit" className={styles.disabledButton}>
            {isEdit ? 'Enregistrer' : '+ Ajouter une tâche'}
          </button>
        </form>
      </div>
    </Modal>
  );
}