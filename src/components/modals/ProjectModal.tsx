'use client';

import Modal from './Modal';

import styles from '@/styles/components/modals/Modal.module.scss';

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
};

export default function ProjectModal({
  isOpen,
  onClose,
  mode,
}: ProjectModalProps) {
  const isEdit = mode === 'edit';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.formModal}>
        <h2>{isEdit ? 'Modifier un projet' : 'Créer un projet'}</h2>

        <form onSubmit={(event) => event.preventDefault()}>
          <div className={styles.field}>
            <label htmlFor="project-title">Titre*</label>

            <input
              id="project-title"
              name="title"
              type="text"
              defaultValue={isEdit ? 'Input' : ''}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="project-description">Description*</label>

            <input
              id="project-description"
              name="description"
              type="text"
              defaultValue={isEdit ? 'Input' : ''}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="project-contributors">Contributeurs</label>

            <select
              id="project-contributors"
              name="contributors"
              defaultValue=""
            >
              <option value="" disabled>
                {isEdit
                  ? '2 collaborateurs'
                  : 'Choisir un ou plusieurs collaborateurs'}
              </option>

              <option value="1">Bertrand Dupont</option>

              <option value="2">Anne Dupont</option>
            </select>
          </div>

          <button type="submit" className={styles.disabledButton}>
            {isEdit ? 'Enregistrer' : 'Ajouter un projet'}
          </button>
        </form>
      </div>
    </Modal>
  );
}