import TaskCard from './TaskCard';

import type { DashboardTask } from '@/types/dashboard';

import styles from '../../styles/components/dashboard/Dashboard.module.scss';

type KanbanColumnProps = {
  title: string;
  tasks: DashboardTask[];
};

export default function KanbanColumn({ title, tasks }: KanbanColumnProps) {
  return (
    <div className={styles.kanbanColumn}>
      <div className={styles.kanbanColumnHeader}>
        <h2>{title}</h2>

        <span className={styles.kanbanCount}>{tasks.length}</span>
      </div>

      <div className={styles.kanbanTasks}>
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} variant="kanban" />
        ))}
      </div>
    </div>
  );
}