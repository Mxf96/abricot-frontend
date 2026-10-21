'use client';

import { FormEvent, useEffect, useId, useRef, useState } from 'react';

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

  onEdit?: () => void;

  onDelete?: () => void;

  onAddComment?: (content: string) => Promise<void>;
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
  onDelete,
  onAddComment,
}: ProjectTaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);

  const [commentContent, setCommentContent] = useState('');

  const [commentError, setCommentError] = useState('');

  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const menuId = useId();

  const commentInputId = useId();

  const statusLabels: Record<TaskStatus, string> = {
    todo: 'À faire',
    'in-progress': 'En cours',
    done: 'Terminée',
  };

  /* -------------------------------------------------------------------------- */
  /*                              MENU ACTIONS                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  /* -------------------------------------------------------------------------- */
  /*                                  STATUS                                    */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                              MODIFIER TÂCHE                                */
  /* -------------------------------------------------------------------------- */

  const handleEdit = () => {
    setIsMenuOpen(false);

    onEdit?.();
  };

  /* -------------------------------------------------------------------------- */
  /*                              SUPPRIMER TÂCHE                               */
  /* -------------------------------------------------------------------------- */

  const handleDelete = () => {
    setIsMenuOpen(false);

    onDelete?.();
  };

  /* -------------------------------------------------------------------------- */
  /*                         OUVRIR COMMENTAIRE                                 */
  /* -------------------------------------------------------------------------- */

  const handleOpenCommentForm = () => {
    setIsMenuOpen(false);

    setCommentError('');

    setIsCommentFormOpen(true);
  };

  /* -------------------------------------------------------------------------- */
  /*                         FERMER COMMENTAIRE                                 */
  /* -------------------------------------------------------------------------- */

  const handleCloseCommentForm = () => {
    if (isCommentLoading) {
      return;
    }

    setCommentContent('');

    setCommentError('');

    setIsCommentFormOpen(false);
  };

  /* -------------------------------------------------------------------------- */
  /*                         AJOUTER COMMENTAIRE                                */
  /* -------------------------------------------------------------------------- */

  const handleAddComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setCommentError('');

    const content = commentContent.trim();

    if (!content) {
      setCommentError('Le commentaire ne peut pas être vide.');

      return;
    }

    if (!onAddComment) {
      setCommentError("L'ajout de commentaire n'est pas encore disponible.");

      return;
    }

    setIsCommentLoading(true);

    try {
      await onAddComment(content);

      setCommentContent('');

      setIsCommentFormOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setCommentError(error.message);
      } else {
        setCommentError(
          "Une erreur est survenue lors de l'ajout du commentaire."
        );
      }
    } finally {
      setIsCommentLoading(false);
    }
  };

  return (
    <article className={styles.taskCard}>
      {/* -------------------------------------------------------------------- */}
      {/*                              HEADER                                  */}
      {/* -------------------------------------------------------------------- */}

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

        {/* ---------------------------------------------------------------- */}
        {/*                           MENU ACTIONS                           */}
        {/* ---------------------------------------------------------------- */}

        <div className={styles.taskMenuWrapper} ref={menuRef}>
          <button
            type="button"
            className={styles.taskMenuButton}
            aria-label={`Actions pour ${title}`}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            ...
          </button>

          {isMenuOpen && (
            <div
              id={menuId}
              className={styles.taskMenu}
              role="menu"
              aria-label={`Actions pour ${title}`}
            >
              {onEdit && (
                <button
                  type="button"
                  className={styles.taskMenuAction}
                  role="menuitem"
                  onClick={handleEdit}
                >
                  Modifier
                </button>
              )}

              <button
                type="button"
                className={styles.taskMenuAction}
                role="menuitem"
                onClick={handleOpenCommentForm}
              >
                Ajouter un commentaire
              </button>

              {onDelete && (
                <button
                  type="button"
                  className={`${styles.taskMenuAction} ${styles.taskDeleteAction}`}
                  role="menuitem"
                  onClick={handleDelete}
                >
                  Supprimer
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/*                                DATE                                  */}
      {/* -------------------------------------------------------------------- */}

      <div className={styles.taskDate}>
        <span>Échéance :</span>

        <span>▣</span>

        <strong>{date}</strong>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/*                            ASSIGNATIONS                              */}
      {/* -------------------------------------------------------------------- */}

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

      {/* -------------------------------------------------------------------- */}
      {/*                     FORMULAIRE COMMENTAIRE                           */}
      {/* -------------------------------------------------------------------- */}

      {isCommentFormOpen && (
        <form className={styles.commentForm} onSubmit={handleAddComment}>
          <label htmlFor={commentInputId}>Ajouter un commentaire</label>

          <textarea
            id={commentInputId}
            value={commentContent}
            onChange={(event) => setCommentContent(event.target.value)}
            placeholder="Écrivez votre commentaire..."
            rows={3}
            maxLength={2000}
            disabled={isCommentLoading}
            required
          />

          {commentError && (
            <p className={styles.commentError} role="alert">
              {commentError}
            </p>
          )}

          <div className={styles.commentFormActions}>
            <button
              type="button"
              className={styles.cancelCommentButton}
              disabled={isCommentLoading}
              onClick={handleCloseCommentForm}
            >
              Annuler
            </button>

            <button
              type="submit"
              className={styles.addCommentButton}
              disabled={isCommentLoading || !commentContent.trim()}
            >
              {isCommentLoading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      )}

      {/* -------------------------------------------------------------------- */}
      {/*                            COMMENTAIRES                              */}
      {/* -------------------------------------------------------------------- */}

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