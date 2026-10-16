export type DashboardTaskStatus = 'todo' | 'in-progress' | 'done';

export type DashboardTask = {
  id: string;
  title: string;
  description: string;
  project: string;
  projectId: string;
  date: string;
  comments: number;
  status: DashboardTaskStatus;
};