'use client';

import { useEffect, useMemo, useState } from 'react';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import KanbanColumn from '@/components/dashboard/KanbanColumn';
import TaskCard from '@/components/dashboard/TaskCard';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProjectModal from '@/components/modals/ProjectModal';

import { useAuth } from '@/context/AuthContext';

import { AssignedTask, getAssignedTasks } from '@/services/dashboardService';

import type { DashboardTask, DashboardTaskStatus } from '@/types/dashboard';

import { getAuthToken } from '@/utils/authStorage';

import styles from '../../styles/components/dashboard/Dashboard.module.scss';

type DashboardView = 'list' | 'kanban';

const priorityOrder = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

function mapStatus(status: AssignedTask['status']): DashboardTaskStatus | null {
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

function transformTask(task: AssignedTask): DashboardTask | null {
  const status = mapStatus(task.status);

  if (!status) {
    return null;
  }

  return {
    id: task.id,
    title: task.title,
    description: task.description ?? 'Aucune description',
    project: task.project.name,
    projectId: task.project.id,
    date: formatDate(task.dueDate),
    comments: task.comments.length,
    status,
  };
}

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [view, setView] = useState<DashboardView>('list');

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const [tasks, setTasks] = useState<DashboardTask[]>([]);

  const [search, setSearch] = useState('');

  const [isTasksLoading, setIsTasksLoading] = useState(true);

  const [tasksError, setTasksError] = useState('');

  useEffect(() => {
    if (isAuthLoading || !user) {
      return;
    }

    let isCancelled = false;

    const loadAssignedTasks = async () => {
      const token = getAuthToken();

      if (!token) {
        return;
      }

      setTasksError('');
      setIsTasksLoading(true);

      try {
        const response = await getAssignedTasks(token);

        const sortedTasks = [...response.data.tasks].sort((a, b) => {
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

        const dashboardTasks = sortedTasks
          .map(transformTask)
          .filter((task): task is DashboardTask => task !== null);

        if (!isCancelled) {
          setTasks(dashboardTasks);
        }
      } catch (error) {
        if (!isCancelled) {
          if (error instanceof Error) {
            setTasksError(error.message);
          } else {
            setTasksError('Une erreur est survenue.');
          }
        }
      } finally {
        if (!isCancelled) {
          setIsTasksLoading(false);
        }
      }
    };

    loadAssignedTasks();

    return () => {
      isCancelled = true;
    };
  }, [isAuthLoading, user?.id]);

  const filteredTasks = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(value) ||
        task.description.toLowerCase().includes(value) ||
        task.project.toLowerCase().includes(value)
      );
    });
  }, [tasks, search]);

  const todoTasks = filteredTasks.filter((task) => task.status === 'todo');

  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === 'in-progress'
  );

  const doneTasks = filteredTasks.filter((task) => task.status === 'done');

  return (
    <ProtectedRoute>
      <Header />

      <main className={styles.dashboard}>
        <section className={styles.dashboardHeader}>
          <div>
            <h1>Tableau de bord</h1>

            <p>
              Bonjour {user?.name ?? user?.email}, voici un aperçu de vos
              projets et tâches
            </p>
          </div>

          <button
            type="button"
            className={styles.createProjectButton}
            onClick={() => setIsCreateProjectOpen(true)}
          >
            + Créer un projet
          </button>
        </section>

        <div className={styles.viewSelector}>
          <button
            type="button"
            className={`${styles.viewButtonSelector} ${
              view === 'list' ? styles.selectedView : ''
            }`}
            onClick={() => setView('list')}
          >
            <span className={styles.viewIcon}>✓</span>

            <span>Liste</span>
          </button>

          <button
            type="button"
            className={`${styles.viewButtonSelector} ${
              view === 'kanban' ? styles.selectedView : ''
            }`}
            onClick={() => setView('kanban')}
          >
            <span className={styles.viewIcon}>▣</span>

            <span>Kanban</span>
          </button>
        </div>

        {view === 'list' && (
          <section className={styles.tasksSection}>
            <div className={styles.tasksHeader}>
              <div>
                <h2>Mes tâches assignées</h2>

                <p>Par ordre de priorité</p>
              </div>

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

            <div className={styles.tasksList}>
              {isTasksLoading && <p>Chargement des tâches...</p>}

              {!isTasksLoading && tasksError && (
                <p role="alert">{tasksError}</p>
              )}

              {!isTasksLoading && !tasksError && filteredTasks.length === 0 && (
                <p>Aucune tâche assignée.</p>
              )}

              {!isTasksLoading &&
                !tasksError &&
                filteredTasks.map((task) => (
                  <TaskCard key={task.id} {...task} />
                ))}
            </div>
          </section>
        )}

        {view === 'kanban' && (
          <section className={styles.kanban}>
            {isTasksLoading ? (
              <p>Chargement des tâches...</p>
            ) : tasksError ? (
              <p role="alert">{tasksError}</p>
            ) : (
              <>
                <KanbanColumn title="À faire" tasks={todoTasks} />

                <KanbanColumn title="En cours" tasks={inProgressTasks} />

                <KanbanColumn title="Terminées" tasks={doneTasks} />
              </>
            )}
          </section>
        )}
      </main>

      <ProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        mode="create"
      />

      <Footer />
    </ProtectedRoute>
  );
}
