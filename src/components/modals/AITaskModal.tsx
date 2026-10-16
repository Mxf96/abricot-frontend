'use client';

import Modal from './Modal';

import styles from '@/styles/components/modals/Modal.module.scss';

type AITaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AITaskModal({
  isOpen,
  onClose,
}: AITaskModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.aiModal}>
        <h2>
          <span className={styles.aiStar}>✦</span>
          Créer une tâche
        </h2>

        <div className={styles.aiPrompt}>
          <input
            type="text"
            placeholder="Décrivez les tâches que vous souhaitez ajouter..."
            aria-label="Décrire les tâches"
          />

          <button type="button" aria-label="Envoyer">
            ✦
          </button>
        </div>
      </div>
    </Modal>
  );
}