'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

import AITaskModal from '@/components/modals/AITaskModal';
import ProjectModal from '@/components/modals/ProjectModal';
import TaskModal from '@/components/modals/TaskModal';

import ProjectTaskCard from '@/components/projects/ProjectTaskCard';

import { useAuth } from '@/context/AuthContext';

import {
  ApiProjectDetails,
  ApiProjectTask,
  createTaskComment,
  deleteTask,
  getProject,
  getProjectTasks,
} from '@/services/projectService';


import styles from '@/styles/components/projects/SingleProject.module.scss';

type TaskStatus = 'todo' | 'in-progress' | 'done';

type StatusFilter = 'all' | TaskStatus;

type DisplayTask = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: TaskStatus;
  comments: number;

  assignees: {
    id: string;
    initials: string;
    name: string;
  }[];

  commentItems: {
    id: string;
    content: string;
    author: string;
  }[];
};

const priorityOrder: Record<ApiProjectTask['priority'], number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

function getInitials(name: string | null, email: string) {
  if (name) {
    const names = name.trim().split(/\s+/);

    if (names.length === 1) {
      return names[0].slice(0, 2).toUpperCase();
    }

    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }

  return email.slice(0, 2).toUpperCase();
}

function getDisplayName(name: string | null, email: string) {
  return name?.trim() || email;
}

function mapStatus(status: ApiProjectTask['status']): TaskStatus | null {
  switch (status) {
    case 'TODO':
      return 'todo';

    case 'IN_PROGRESS':
      return 'in-progress';

    case 'DONE':
      return 'done';

    case 'CANCELLED':
      return null;

    default:
      return null;
  }
}

function formatDate(date: string | null) {
  if (!date) {
    return 'Sans échéance';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(date));
}

function transformTask(task: ApiProjectTask): DisplayTask | null {
  const status = mapStatus(task.status);

  if (!status) {
    return null;
  }

  return {
    id: task.id,

    title: task.title,

    description: task.description ?? 'Aucune description',

    date: formatDate(task.dueDate),

    status,

    comments: task.comments.length,

    assignees: task.assignees.map((assignee) => ({
      id: assignee.id,

      initials: getInitials(assignee.user.name, assignee.user.email),

      name: getDisplayName(assignee.user.name, assignee.user.email),
    })),

    commentItems: task.comments.map((comment) => ({
      id: comment.id,

      content: comment.content,

      author: getDisplayName(comment.author.name, comment.author.email),
    })),
  };
}

export default function SingleProjectPage() {
  const params = useParams<{ id: string }>();

  const router = useRouter();

  const projectId = params.id;

  const { user, isLoading: isAuthLoading } = useAuth();

  const [project, setProject] = useState<ApiProjectDetails | null>(null);

  const [tasks, setTasks] = useState<DisplayTask[]>([]);

  const [apiTasks, setApiTasks] = useState<ApiProjectTask[]>([]);

  const [selectedTask, setSelectedTask] = useState<ApiProjectTask | null>(null);

  const [isProjectLoading, setIsProjectLoading] = useState(true);

  const [projectError, setProjectError] = useState('');

  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const [projectRefreshKey, setProjectRefreshKey] = useState(0);

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);

  const [isAiOpen, setIsAiOpen] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                             CHARGEMENT PROJET                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (isAuthLoading || !user || !projectId) {
      return;
    }

    let isCancelled = false;

    const loadProject = async () => {
      setProjectError('');
      setIsProjectLoading(true);

      try {
        const [projectResponse, tasksResponse] = await Promise.all([
          getProject(projectId),

          getProjectTasks(projectId),
        ]);

        const sortedTasks = [...tasksResponse.data.tasks].sort((a, b) => {
          const priorityDifference =
            priorityOrder[a.priority] - priorityOrder[b.priority];

          if (priorityDifference !== 0) {
            return priorityDifference;
          }

          if (a.dueDate && b.dueDate) {
            return (
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );
          }

          if (a.dueDate) {
            return -1;
          }

          if (b.dueDate) {
            return 1;
          }

          return 0;
        });

        const transformedTasks = sortedTasks
          .map(transformTask)
          .filter((task): task is DisplayTask => task !== null);

        if (!isCancelled) {
          setProject(projectResponse.data.project);

          setApiTasks(sortedTasks);

          setTasks(transformedTasks);
        }
      } catch (error) {
        if (!isCancelled) {
          if (error instanceof Error) {
            setProjectError(error.message);
          } else {
            setProjectError('Une erreur est survenue.');
          }
        }
      } finally {
        if (!isCancelled) {
          setIsProjectLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      isCancelled = true;
    };
  }, [projectId, isAuthLoading, user?.id, projectRefreshKey]);

  /* -------------------------------------------------------------------------- */
  /*                              FILTRE TÂCHES                                 */
  /* -------------------------------------------------------------------------- */

  const filteredTasks = useMemo(() => {
    const value = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !value ||
        task.title.toLowerCase().includes(value) ||
        task.description.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === 'all' || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  /* -------------------------------------------------------------------------- */
  /*                              PERMISSIONS                                   */
  /* -------------------------------------------------------------------------- */

  const isProjectAdmin = project?.userRole === 'ADMIN';

  const canCreateDeleteTasks =
    project?.userRole === 'ADMIN' || project?.userRole === 'CONTRIBUTOR';

  const canEditTasks = isProjectAdmin;

  /* -------------------------------------------------------------------------- */
  /*                            CONTRIBUTEURS                                   */
  /* -------------------------------------------------------------------------- */

  const totalPeople = project ? project.members.length + 1 : 0;

  const taskAssigneeOptions = project
    ? [
        {
          id: project.owner.id,

          name: getDisplayName(project.owner.name, project.owner.email),
        },

        ...project.members.map((member) => ({
          id: member.user.id,

          name: getDisplayName(member.user.name, member.user.email),
        })),
      ]
    : [];

  /* -------------------------------------------------------------------------- */
  /*                              MODIFIER TÂCHE                                */
  /* -------------------------------------------------------------------------- */

  const handleEditTask = (taskId: string) => {
    const taskToEdit = apiTasks.find((task) => task.id === taskId);

    if (!taskToEdit) {
      return;
    }

    setSelectedTask(taskToEdit);

    setIsEditTaskOpen(true);
  };

  /* -------------------------------------------------------------------------- */
  /*                              SUPPRIMER TÂCHE                               */
  /* -------------------------------------------------------------------------- */

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la tâche "${taskTitle}" ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(projectId, taskId);

      setProjectRefreshKey((current) => current + 1);
    } catch (error) {
      if (error instanceof Error) {
        setProjectError(error.message);
      } else {
        setProjectError('Une erreur est survenue lors de la suppression.');
      }
    }
  };

  const handleAddTaskComment = async (taskId: string, content: string) => {
    await createTaskComment(projectId, taskId, content);

    setProjectRefreshKey((current) => current + 1);
  };

  /* -------------------------------------------------------------------------- */
  /*                          PROJET SUPPRIMÉ                                   */
  /* -------------------------------------------------------------------------- */

  const handleProjectDeleted = () => {
    router.push('/projects');
  };

  return (
    <ProtectedRoute>
      <Header />

      <main className={styles.projectPage}>
        {/* -------------------------------------------------------------- */}
        {/*                         CHARGEMENT                             */}
        {/* -------------------------------------------------------------- */}

        {isProjectLoading && <p>Chargement du projet...</p>}

        {/* -------------------------------------------------------------- */}
        {/*                            ERREUR                              */}
        {/* -------------------------------------------------------------- */}

        {!isProjectLoading && projectError && (
          <section className={styles.projectHeader}>
            <div>
              <p role="alert">{projectError}</p>

              <Link
                href="/projects"
                className={styles.backButton}
                aria-label="Retour aux projets"
              >
                ←
              </Link>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------------- */}
        {/*                            PROJET                              */}
        {/* -------------------------------------------------------------- */}

        {!isProjectLoading && !projectError && project && (
          <>
            {/* -------------------------------------------------------- */}
            {/*                     EN-TÊTE PROJET                       */}
            {/* -------------------------------------------------------- */}

            <section className={styles.projectHeader}>
              <div className={styles.projectInformations}>
                <Link
                  href="/projects"
                  className={styles.backButton}
                  aria-label="Retour aux projets"
                >
                  ←
                </Link>

                <div>
                  <div className={styles.projectTitle}>
                    <h1>{project.name}</h1>

                    {isProjectAdmin && (
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => setIsEditProjectOpen(true)}
                      >
                        Modifier
                      </button>
                    )}
                  </div>

                  <p>{project.description ?? 'Aucune description'}</p>
                </div>
              </div>

              {canCreateDeleteTasks && (
                <div className={styles.projectActions}>
                  <button
                    type="button"
                    className={styles.createTaskButton}
                    onClick={() => setIsCreateTaskOpen(true)}
                  >
                    Créer une tâche
                  </button>

                  <button
                    type="button"
                    className={styles.aiButton}
                    onClick={() => setIsAiOpen(true)}
                  >
                    <span>✦</span>
                    IA
                  </button>
                </div>
              )}
            </section>

            {/* -------------------------------------------------------- */}
            {/*                      CONTRIBUTEURS                       */}
            {/* -------------------------------------------------------- */}

            <section className={styles.contributorsBar}>
              <div className={styles.contributorsTitle}>
                <span>Contributeurs</span>

                <span className={styles.contributorsCount}>
                  {totalPeople} {totalPeople > 1 ? 'personnes' : 'personne'}
                </span>
              </div>

              <div className={styles.contributors}>
                <span className={`${styles.avatar} ${styles.ownerAvatar}`}>
                  {getInitials(project.owner.name, project.owner.email)}
                </span>

                <span className={styles.ownerBadge}>Propriétaire</span>

                {project.members.map((member) => (
                  <div key={member.id}>
                    <span className={styles.avatar}>
                      {getInitials(member.user.name, member.user.email)}
                    </span>

                    <span className={styles.memberBadge}>
                      {getDisplayName(member.user.name, member.user.email)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* -------------------------------------------------------- */}
            {/*                           TÂCHES                         */}
            {/* -------------------------------------------------------- */}

            <section className={styles.tasksSection}>
              <div className={styles.tasksHeader}>
                <div>
                  <h2>Tâches</h2>

                  <p>Par ordre de priorité</p>
                </div>

                <div className={styles.tasksTools}>
                  {/* -------------------------------------------------- */}
                  {/*                     VUES                           */}
                  {/* -------------------------------------------------- */}

                  <div className={styles.viewSelector}>
                    <button
                      type="button"
                      className={`${styles.viewButton} ${styles.activeView}`}
                    >
                      ✓<span>Liste</span>
                    </button>

                    <button type="button" className={styles.viewButton}>
                      ▣<span>Calendrier</span>
                    </button>
                  </div>

                  {/* -------------------------------------------------- */}
                  {/*                     FILTRE                         */}
                  {/* -------------------------------------------------- */}

                  <select
                    className={styles.statusSelect}
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as StatusFilter)
                    }
                    aria-label="Filtrer par statut"
                  >
                    <option value="all">Statut</option>

                    <option value="todo">À faire</option>

                    <option value="in-progress">En cours</option>

                    <option value="done">Terminée</option>
                  </select>

                  {/* -------------------------------------------------- */}
                  {/*                    RECHERCHE                        */}
                  {/* -------------------------------------------------- */}

                  <div className={styles.search}>
                    <input
                      type="search"
                      placeholder="Rechercher une tâche"
                      aria-label="Rechercher une tâche"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />

                    <span>⌕</span>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------ */}
              {/*                     LISTE TÂCHES                       */}
              {/* ------------------------------------------------------ */}

              <div className={styles.tasksList}>
                {filteredTasks.length === 0 ? (
                  <p>Aucune tâche trouvée.</p>
                ) : (
                  filteredTasks.map((task) => (
                    <ProjectTaskCard
                      key={task.id}
                      {...task}
                      onEdit={
                        canEditTasks
                          ? () => handleEditTask(task.id)
                          : undefined
                      }
                      onDelete={
                        canCreateDeleteTasks
                          ? () => handleDeleteTask(task.id, task.title)
                          : undefined
                      }
                      onAddComment={(content) =>
                        handleAddTaskComment(task.id, content)
                      }
                    />
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ---------------------------------------------------------------- */}
      {/*                      MODIFICATION PROJET                          */}
      {/* ---------------------------------------------------------------- */}

      {isProjectAdmin && (
        <ProjectModal
          isOpen={isEditProjectOpen}
          onClose={() => setIsEditProjectOpen(false)}
          mode="edit"
          project={project}
          onSuccess={() => setProjectRefreshKey((current) => current + 1)}
          onDeleteSuccess={handleProjectDeleted}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/*                       CRÉATION TÂCHE                              */}
      {/* ---------------------------------------------------------------- */}

      {canCreateDeleteTasks && (
        <TaskModal
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          mode="create"
          projectId={projectId}
          assignees={taskAssigneeOptions}
          onSuccess={() => setProjectRefreshKey((current) => current + 1)}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/*                      MODIFICATION TÂCHE                           */}
      {/* ---------------------------------------------------------------- */}

      {canEditTasks && (
        <TaskModal
          isOpen={isEditTaskOpen}
          onClose={() => {
            setIsEditTaskOpen(false);

            setSelectedTask(null);
          }}
          mode="edit"
          projectId={projectId}
          assignees={taskAssigneeOptions}
          task={selectedTask}
          onSuccess={() => setProjectRefreshKey((current) => current + 1)}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/*                             IA                                    */}
      {/* ---------------------------------------------------------------- */}

      <AITaskModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      <Footer />
    </ProtectedRoute>
  );
}