import styles from '@/styles/components/projects/SingleProject.module.scss';

type TaskStatus = 'todo' | 'in-progress' | 'done';

type ProjectTaskCardProps = {
  title: string;
  description: string;
  date: string;
  status: TaskStatus;
  comments: number;
};

export default function ProjectTaskCard({
  title,
  description,
  date,
  status,
  comments,
}: ProjectTaskCardProps) {
  const statusLabel: Record<TaskStatus, string> = {
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
    <article className={styles.taskCard}>
      <div className={styles.taskTop}>
        <div className={styles.taskMain}>
          <div className={styles.taskTitle}>
            <h3>{title}</h3>

            <span className={`${styles.status} ${getStatusClass()}`}>
              {statusLabel[status]}
            </span>
          </div>

          <p>{description}</p>
        </div>

        <button
          type="button"
          className={styles.taskMenuButton}
          aria-label={`Options pour ${title}`}
        >
          ...
        </button>
      </div>

      <div className={styles.taskDate}>
        <span>Échéance :</span>
        <span>▣</span>
        <strong>{date}</strong>
      </div>

      <div className={styles.assignees}>
        <span>Assigné à :</span>

        <span className={styles.avatar}>BD</span>
        <span className={styles.memberBadge}>Bertrand Dupont</span>

        <span className={styles.avatar}>AD</span>
        <span className={styles.memberBadge}>Anne Dupont</span>
      </div>

      <details className={styles.comments}>
        <summary>
          <span>Commentaires ({comments})</span>

          <span className={styles.commentArrow}>⌃</span>
        </summary>

        <div className={styles.commentsContent}>
          Aucun commentaire affiché pour le moment.
        </div>
      </details>
    </article>
  );
}