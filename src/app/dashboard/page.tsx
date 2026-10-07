'use client';

import { useState } from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import KanbanColumn from '@/components/dashboard/KanbanColumn';
import TaskCard from '@/components/dashboard/TaskCard';

import styles from '../../styles/components/dashboard/Dashboard.module.scss';

type DashboardView = 'list' | 'kanban';

type TaskStatus = 'todo' | 'in-progress' | 'done';

type Task = {
  id: number;
  title: string;
  description: string;
  project: string;
  date: string;
  comments: number;
  status: TaskStatus;
};

const listTasks: Task[] = [
  {
    id: 1,
    title: 'Nom de la tâche',
    description: 'Description de la tâche',
    project: 'Nom du projet',
    date: '9 mars',
    comments: 2,
    status: 'todo',
  },
  {
    id: 2,
    title: 'Nom de la tâche',
    description: 'Description de la tâche',
    project: 'Nom du projet',
    date: '9 mars',
    comments: 2,
    status: 'in-progress',
  },
  {
    id: 3,
    title: 'Nom de la tâche',
    description: 'Description de la tâche',
    project: 'Nom du projet',
    date: '9 mars',
    comments: 2,
    status: 'todo',
  },
  {
    id: 4,
    title: 'Nom de la tâche',
    description: 'Description de la tâche',
    project: 'Nom du projet',
    date: '9 mars',
    comments: 2,
    status: 'todo',
  },
  {
    id: 5,
    title: 'Nom de la tâche',
    description: 'Description de la tâche',
    project: 'Nom du projet',
    date: '9 mars',
    comments: 2,
    status: 'todo',
  },
  {
    id: 6,
    title: 'Nom de la tâche',
    description: 'Description de la tâche',
    project: 'Nom du projet',
    date: '9 mars',
    comments: 2,
    status: 'todo',
  },
];

const kanbanTasks: Task[] = [
  ...Array.from({ length: 4 }, (_, index) => ({
    id: 100 + index,
    title: 'Nom de la tâche',
    description: 'Description de la tâche',
    project: 'Nom du projet',
    date: '9 mars',
    comments: 2,
    status: 'todo' as const,
  })),

  ...Array.from({ length: 4 }, (_, index) => ({
    id: 200 + index,
    title: 'Nom de la tâche',
    description: 'Description de la tâche',
    project: 'Nom du projet',
    date: '9 mars',
    comments: 2,
    status: 'in-progress' as const,
  })),

  ...Array.from({ length: 4 }, (_, index) => ({
    id: 300 + index,
    title: 'Nom de la tâche',
    description: 'Description de la tâche',
    project: 'Nom du projet',
    date: '9 mars',
    comments: 2,
    status: 'done' as const,
  })),
];

export default function DashboardPage() {
  const [view, setView] = useState<DashboardView>('list');

  const todoTasks = kanbanTasks.filter((task) => task.status === 'todo');

  const inProgressTasks = kanbanTasks.filter(
    (task) => task.status === 'in-progress'
  );

  const doneTasks = kanbanTasks.filter((task) => task.status === 'done');

  return (
    <>
      <Header />

      <main className={styles.dashboard}>
        <section className={styles.dashboardHeader}>
          <div>
            <h1>Tableau de bord</h1>

            <p>
              Bonjour Alice Dupont, voici un aperçu de vos projets et tâches
            </p>
          </div>

          <button type="button" className={styles.createProjectButton}>
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
                />

                <span>⌕</span>
              </div>
            </div>

            <div className={styles.tasksList}>
              {listTasks.map((task) => (
                <TaskCard key={task.id} {...task} />
              ))}
            </div>
          </section>
        )}

        {view === 'kanban' && (
          <section className={styles.kanban}>
            <KanbanColumn title="À faire" tasks={todoTasks} />

            <KanbanColumn title="En cours" tasks={inProgressTasks} />

            <KanbanColumn title="Terminées" tasks={doneTasks} />
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}