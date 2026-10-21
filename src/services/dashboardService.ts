const API_URL = '/api/backend';

export type ApiTaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

export type ApiTaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type AssignedTask = {
  id: string;
  title: string;
  description: string | null;
  status: ApiTaskStatus;
  priority: ApiTaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;

  project: {
    id: string;
    name: string;
    description: string | null;
  };

  comments: {
    id: string;
  }[];
};

type AssignedTasksResponse = {
  success: boolean;
  message: string;
  data: {
    tasks: AssignedTask[];
  };
};

type ApiErrorResponse = {
  success: false;
  message: string;
  error?: string;
};

export async function getAssignedTasks(): Promise<AssignedTasksResponse> {
  const response = await fetch(`${API_URL}/dashboard/assigned-tasks`, {
    method: 'GET',
    cache: 'no-store',
  });

  const data: AssignedTasksResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Erreur lors de la récupération des tâches assignées'
    );
  }

  return data as AssignedTasksResponse;
}