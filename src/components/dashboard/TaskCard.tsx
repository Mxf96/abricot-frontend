import styles from '../../styles/components/dashboard/Dashboard.module.scss';

type TaskStatus = 'todo' | 'in-progress' | 'done';

type TaskCardProps = {
  title: string;
  description: string;
  project: string;
  date: string;
  comments: number;
  status: TaskStatus;
  variant?: 'list' | 'kanban';
};

export default function TaskCard({
  title,
  description,
  project,
  date,
  comments,
  status,
  variant = 'list',
}: TaskCardProps) {
  const statusLabels: Record<TaskStatus, string> = {
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
          <span>📁 {project}</span>

          <span className={styles.separator} />

          <span>▣ {date}</span>

          <span className={styles.separator} />

          <span>▤ {comments}</span>
        </div>

        {variant === 'kanban' && (
          <button type="button" className={styles.kanbanViewButton}>
            Voir
          </button>
        )}
      </div>

      {variant === 'list' && (
        <div className={styles.taskActions}>
          <span className={`${styles.status} ${getStatusClass()}`}>
            {statusLabels[status]}
          </span>

          <button type="button" className={styles.viewButton}>
            Voir
          </button>
        </div>
      )}
    </article>
  );
}