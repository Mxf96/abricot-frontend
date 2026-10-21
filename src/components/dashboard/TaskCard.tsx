import Link from 'next/link';

import type { DashboardTaskStatus } from '@/types/dashboard';

import styles from '../../styles/components/dashboard/Dashboard.module.scss';

type TaskCardProps = {
  title: string;
  description: string;
  project: string;
  projectId: string;
  date: string;
  comments: number;
  status: DashboardTaskStatus;
  variant?: 'list' | 'kanban';
};

export default function TaskCard({
  title,
  description,
  project,
  projectId,
  date,
  comments,
  status,
  variant = 'list',
}: TaskCardProps) {
  const statusLabels: Record<DashboardTaskStatus, string> = {
    todo: 'À faire',
    'in-progress': 'En cours',
    done: 'Terminée',
  };

  const getStatusClass = () => {
    switch (status) {
      case 'todo':
        return styles.todo;

      case 'in-progress':
        return styles.inProgress;

      case 'done':
        return styles.done;

      default:
        return '';
    }
  };

  return (
    <article
      className={`${styles.taskCard} ${
        variant === 'kanban' ? styles.kanbanTaskCard : ''
      }`}
    >
      <div className={styles.taskContent}>
        <div className={styles.taskTitleRow}>
          <h3>{title}</h3>

          {variant === 'kanban' && (
            <span className={`${styles.status} ${getStatusClass()}`}>
              {statusLabels[status]}
            </span>
          )}
        </div>

        <p>{description}</p>

        <div className={styles.taskInformations}>
          <span><span aria-hidden="true">📁 </span>{project}</span>

          <span className={styles.separator} aria-hidden="true" />

          <span><span aria-hidden="true">▣ </span>{date}</span>

          <span className={styles.separator} aria-hidden="true" />

          <span><span aria-hidden="true">▤ </span>{comments} commentaire{comments > 1 ? 's' : ''}</span>
        </div>

        {variant === 'kanban' && (
          <Link
            href={`/projects/${projectId}`}
            className={styles.kanbanViewButton}
          >
            Voir
          </Link>
        )}
      </div>

      {variant === 'list' && (
        <div className={styles.taskActions}>
          <span className={`${styles.status} ${getStatusClass()}`}>
            {statusLabels[status]}
          </span>

          <Link href={`/projects/${projectId}`} className={styles.viewButton}>
            Voir
          </Link>
        </div>
      )}
    </article>
  );
}