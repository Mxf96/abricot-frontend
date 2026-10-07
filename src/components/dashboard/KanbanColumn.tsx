import TaskCard from './TaskCard';

import styles from '../../styles/components/dashboard/Dashboard.module.scss';

type Task = {
  id: number;
  title: string;
  description: string;
  project: string;
  date: string;
  comments: number;
  status: 'todo' | 'in-progress' | 'done';
};

type KanbanColumnProps = {
  title: string;
  tasks: Task[];
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
          <TaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            project={task.project}
            date={task.date}
            comments={task.comments}
            status={task.status}
            variant="kanban"
          />
        ))}
      </div>
    </div>
  );
}