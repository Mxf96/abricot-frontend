const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ProjectUser = {
  id: string;
  email: string;
  name: string | null;
};

export type ProjectMember = {
  id: string;
  role: 'ADMIN' | 'CONTRIBUTOR';
  userId: string;
  projectId: string;
  joinedAt: string;
  user: ProjectUser;
};

export type ApiProject = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: ProjectUser;
  members: ProjectMember[];
  _count: {
    tasks: number;
  };
  userRole: 'ADMIN' | 'CONTRIBUTOR' | null;
};

export type ApiTaskAssignee = {
  id: string;
  assignedAt: string;
  user: ProjectUser;
};

export type ApiTaskComment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: ProjectUser;
};

export type ApiProjectTask = {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignees: ApiTaskAssignee[];
  comments: ApiTaskComment[];
};

export type ApiProjectDetails = ApiProject & {
  tasks: ApiProjectTask[];
};

type ProjectsResponse = {
  success: boolean;
  message: string;
  data: {
    projects: ApiProject[];
  };
};

type ProjectResponse = {
  success: boolean;
  message: string;
  data: {
    project: ApiProjectDetails;
  };
};

type ProjectTasksResponse = {
  success: boolean;
  message: string;
  data: {
    tasks: ApiProjectTask[];
  };
};

type ApiErrorResponse = {
  success: false;
  message: string;
  error?: string;
};

export async function getProjects(token: string): Promise<ProjectsResponse> {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data: ProjectsResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Erreur lors de la récupération des projets'
    );
  }

  return data as ProjectsResponse;
}

export async function getProject(
  token: string,
  projectId: string
): Promise<ProjectResponse> {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data: ProjectResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erreur lors de la récupération du projet');
  }

  return data as ProjectResponse;
}

export async function getProjectTasks(
  token: string,
  projectId: string
): Promise<ProjectTasksResponse> {
  const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data: ProjectTasksResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Erreur lors de la récupération des tâches du projet'
    );
  }

  return data as ProjectTasksResponse;
}