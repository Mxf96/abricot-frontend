export type DashboardTaskStatus = 'todo' | 'in-progress' | 'done';

export type DashboardTask = {
  id: string;

  title: string;

  description: string;

  project: string;

  projectId: string;

  /*
   * Date formatée utilisée uniquement
   * pour l'affichage.
   *
   * Exemple :
   * "21 octobre"
   */
  date: string;

  /*
   * Date d'échéance originale provenant
   * de l'API.
   *
   * Elle est utilisée pour déterminer
   * si la tâche appartient au mois courant.
   */
  dueDate: string | null;

  comments: number;

  status: DashboardTaskStatus;
};