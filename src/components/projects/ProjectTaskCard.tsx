'use client';

import styles from '@/styles/components/projects/SingleProject.module.scss';

type TaskStatus = 'todo' | 'in-progress' | 'done';

type TaskAssignee = {
  id: string;
  initials: string;
  name: string;
};

type TaskComment = {
  id: string;
  content: string;
  author: string;
};

type ProjectTaskCardProps = {
  title: string;
  description: string;
  date: string;
  status: TaskStatus;
  comments: number;
  assignees: TaskAssignee[];
  commentItems: TaskComment[];
  onEdit: () => void;
};

export default function ProjectTaskCard({
  title,
  description,
  date,
  status,
  comments,
  assignees,
  commentItems,
  onEdit,
}: ProjectTaskCardProps) {
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
    <article className={styles.taskCard}>
      <div className={styles.taskTop}>
        <div className={styles.taskMain}>
          <div className={styles.taskTitle}>
            <h3>{title}</h3>

            <span className={`${styles.status} ${getStatusClass()}`}>
              {statusLabels[status]}
            </span>
          </div>

          <p>{description}</p>
        </div>

        <button
          type="button"
          className={styles.taskMenuButton}
          aria-label={`Modifier ${title}`}
          onClick={onEdit}
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

        {assignees.length === 0 ? (
          <span>Non assignée</span>
        ) : (
          assignees.map((assignee) => (
            <div key={assignee.id}>
              <span className={styles.avatar}>{assignee.initials}</span>

              <span className={styles.memberBadge}>{assignee.name}</span>
            </div>
          ))
        )}
      </div>

      <details className={styles.comments}>
        <summary>
          <span>Commentaires ({comments})</span>

          <span className={styles.commentArrow}>⌃</span>
        </summary>

        <div className={styles.commentsContent}>
          {commentItems.length === 0 ? (
            <p>Aucun commentaire.</p>
          ) : (
            commentItems.map((comment) => (
              <p key={comment.id}>
                <strong>{comment.author}</strong>
                {' : '}
                {comment.content}
              </p>
            ))
          )}
        </div>
      </details>
    </article>
  );
}