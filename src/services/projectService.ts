const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                              PROJECT PAYLOADS                              */
/* -------------------------------------------------------------------------- */

export type CreateProjectPayload = {
  name: string;
  description?: string;
  contributors?: string[];
};

export type UpdateProjectPayload = {
  name?: string;
  description?: string;
};

export type CreatedProject = Omit<ApiProject, 'userRole'>;

/* -------------------------------------------------------------------------- */
/*                            CONTRIBUTOR PAYLOADS                            */
/* -------------------------------------------------------------------------- */

export type ContributorRole = 'ADMIN' | 'CONTRIBUTOR';

export type AddContributorPayload = {
  email: string;
  role?: ContributorRole;
};

/* -------------------------------------------------------------------------- */
/*                                TASK PAYLOADS                               */
/* -------------------------------------------------------------------------- */

export type CreateTaskPayload = {
  title: string;
  description?: string;

  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  dueDate?: string;
  assigneeIds?: string[];
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string;

  status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  dueDate?: string;
  assigneeIds?: string[];
};

/* -------------------------------------------------------------------------- */
/*                              RESPONSE TYPES                                */
/* -------------------------------------------------------------------------- */

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

type CreateProjectResponse = {
  success: boolean;
  message: string;

  data: {
    project: CreatedProject;
  };
};

type UpdateProjectResponse = {
  success: boolean;
  message: string;

  data: {
    project: CreatedProject;
  };
};

type CreateTaskResponse = {
  success: boolean;
  message: string;

  data: {
    task: ApiProjectTask;
  };
};

type UpdateTaskResponse = {
  success: boolean;
  message: string;

  data: {
    task: ApiProjectTask;
  };
};

type ContributorActionResponse = {
  success: boolean;
  message: string;
};

type ApiValidationError = {
  field: string;
  message: string;
};

type ApiErrorResponse = {
  success: false;
  message: string;
  error?: string;

  data?: {
    errors?: ApiValidationError[];
  };
};

/* -------------------------------------------------------------------------- */
/*                              PROJECT CREATE                                */
/* -------------------------------------------------------------------------- */

export async function createProject(
  token: string,
  payload: CreateProjectPayload
): Promise<CreateProjectResponse> {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',

      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(payload),
  });

  const data: CreateProjectResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    const validationMessage = errorData.data?.errors?.[0]?.message;

    throw new Error(
      validationMessage ||
        errorData.message ||
        'Erreur lors de la création du projet'
    );
  }

  return data as CreateProjectResponse;
}

/* -------------------------------------------------------------------------- */
/*                              PROJECT UPDATE                                */
/* -------------------------------------------------------------------------- */

export async function updateProject(
  token: string,
  projectId: string,
  payload: UpdateProjectPayload
): Promise<UpdateProjectResponse> {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json',

      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(payload),
  });

  const data: UpdateProjectResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    const validationMessage = errorData.data?.errors?.[0]?.message;

    throw new Error(
      validationMessage ||
        errorData.message ||
        'Erreur lors de la modification du projet'
    );
  }

  return data as UpdateProjectResponse;
}

/* -------------------------------------------------------------------------- */
/*                              PROJECT DELETE                                */
/* -------------------------------------------------------------------------- */

type DeleteProjectResponse = {
  success: boolean;
  message: string;
};

export async function deleteProject(
  token: string,
  projectId: string
): Promise<DeleteProjectResponse> {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'DELETE',

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: DeleteProjectResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    throw new Error(
      errorData.message || 'Erreur lors de la suppression du projet'
    );
  }

  return data as DeleteProjectResponse;
}

/* -------------------------------------------------------------------------- */
/*                           PROJECT CONTRIBUTORS                             */
/* -------------------------------------------------------------------------- */

export async function addContributor(
  token: string,
  projectId: string,
  payload: AddContributorPayload
): Promise<ContributorActionResponse> {
  const response = await fetch(
    `${API_URL}/projects/${projectId}/contributors`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(payload),
    }
  );

  const data: ContributorActionResponse | ApiErrorResponse =
    await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    const validationMessage = errorData.data?.errors?.[0]?.message;

    throw new Error(
      validationMessage ||
        errorData.message ||
        "Erreur lors de l'ajout du contributeur"
    );
  }

  return data as ContributorActionResponse;
}

export async function removeContributor(
  token: string,
  projectId: string,
  userId: string
): Promise<ContributorActionResponse> {
  const response = await fetch(
    `${API_URL}/projects/${projectId}/contributors/${userId}`,
    {
      method: 'DELETE',

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data: ContributorActionResponse | ApiErrorResponse =
    await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    const validationMessage = errorData.data?.errors?.[0]?.message;

    throw new Error(
      validationMessage ||
        errorData.message ||
        'Erreur lors de la suppression du contributeur'
    );
  }

  return data as ContributorActionResponse;
}

/* -------------------------------------------------------------------------- */
/*                                TASK CREATE                                 */
/* -------------------------------------------------------------------------- */

export async function createTask(
  token: string,
  projectId: string,
  payload: CreateTaskPayload
): Promise<CreateTaskResponse> {
  const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',

      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(payload),
  });

  const data: CreateTaskResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    const validationMessage = errorData.data?.errors?.[0]?.message;

    throw new Error(
      validationMessage ||
        errorData.message ||
        'Erreur lors de la création de la tâche'
    );
  }

  return data as CreateTaskResponse;
}

/* -------------------------------------------------------------------------- */
/*                                TASK UPDATE                                 */
/* -------------------------------------------------------------------------- */

export async function updateTask(
  token: string,
  projectId: string,
  taskId: string,
  payload: UpdateTaskPayload
): Promise<UpdateTaskResponse> {
  const response = await fetch(
    `${API_URL}/projects/${projectId}/tasks/${taskId}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(payload),
    }
  );

  const data: UpdateTaskResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    const validationMessage = errorData.data?.errors?.[0]?.message;

    throw new Error(
      validationMessage ||
        errorData.message ||
        'Erreur lors de la modification de la tâche'
    );
  }

  return data as UpdateTaskResponse;
}

/* -------------------------------------------------------------------------- */
/*                                TASK DELETE                                 */
/* -------------------------------------------------------------------------- */

type DeleteTaskResponse = {
  success: boolean;
  message: string;
};

export async function deleteTask(
  token: string,
  projectId: string,
  taskId: string
): Promise<DeleteTaskResponse> {
  const response = await fetch(
    `${API_URL}/projects/${projectId}/tasks/${taskId}`,
    {
      method: 'DELETE',

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data: DeleteTaskResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    throw new Error(
      errorData.message || 'Erreur lors de la suppression de la tâche'
    );
  }

  return data as DeleteTaskResponse;
}

/* -------------------------------------------------------------------------- */
/*                              PROJECTS GET                                  */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                               PROJECT GET                                  */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                              PROJECT TASKS GET                             */
/* -------------------------------------------------------------------------- */

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