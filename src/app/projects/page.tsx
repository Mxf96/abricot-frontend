'use client';

import { useEffect, useState } from 'react';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProjectModal from '@/components/modals/ProjectModal';
import ProjectCard from '@/components/projects/ProjectCard';

import { useAuth } from '@/context/AuthContext';

import {
  ApiProject,
  getProjects,
  getProjectTasks,
} from '@/services/projectService';

import styles from '@/styles/components/projects/Projects.module.scss';

type ProjectCardData = {
  id: string;
  name: string;
  description: string;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  members: {
    id: string;
    initials: string;
    role: 'owner' | 'member';
  }[];
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

async function transformProject(project: ApiProject): Promise<ProjectCardData> {
  const tasksResponse = await getProjectTasks(project.id);

  const tasks = tasksResponse.data.tasks;

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.status === 'DONE').length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const members: ProjectCardData['members'] = [
    {
      id: project.owner.id,
      initials: getInitials(project.owner.name, project.owner.email),
      role: 'owner',
    },

    ...project.members.map((member) => ({
      id: member.user.id,
      initials: getInitials(member.user.name, member.user.email),
      role: 'member' as const,
    })),
  ];

  return {
    id: project.id,
    name: project.name,
    description: project.description ?? 'Aucune description',
    progress,
    completedTasks,
    totalTasks,
    members,
  };
}

export default function ProjectsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const [projectsRefreshKey, setProjectsRefreshKey] = useState(0);

  const [projects, setProjects] = useState<ProjectCardData[]>([]);

  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  const [projectsError, setProjectsError] = useState('');

  useEffect(() => {
    if (isAuthLoading || !user) {
      return;
    }

    let isCancelled = false;

    const loadProjects = async () => {
      setProjectsError('');
      setIsProjectsLoading(true);

      try {
        const response = await getProjects();

        const transformedProjects = await Promise.all(
          response.data.projects.map((project) => transformProject(project))
        );

        if (!isCancelled) {
          setProjects(transformedProjects);
        }
      } catch (error) {
        if (!isCancelled) {
          if (error instanceof Error) {
            setProjectsError(error.message);
          } else {
            setProjectsError('Une erreur est survenue.');
          }
        }
      } finally {
        if (!isCancelled) {
          setIsProjectsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isCancelled = true;
    };
  }, [isAuthLoading, user?.id, projectsRefreshKey]);

  return (
    <ProtectedRoute>
      <Header />

      <main id="main-content" className={styles.projectsPage}>
        <section className={styles.projectsHeader}>
          <div>
            <h1>Mes projets</h1>
            <p>Gérez vos projets</p>
          </div>

          <button
            type="button"
            className={styles.createProjectButton}
            onClick={() => setIsCreateProjectOpen(true)}
          >
            + Créer un projet
          </button>
        </section>

        {isProjectsLoading && <p>Chargement des projets...</p>}

        {!isProjectsLoading && projectsError && (
          <p role="alert">{projectsError}</p>
        )}

        <div className={styles.projectsBody}>
          {!isProjectsLoading && !projectsError && projects.length === 0 && (
            <p>Aucun projet pour le moment.</p>
          )}
        </div>

        {!isProjectsLoading && !projectsError && projects.length > 0 && (
          <section className={styles.projectsGrid}>
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </section>
        )}
      </main>

      <ProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        mode="create"
        onSuccess={() => setProjectsRefreshKey((current) => current + 1)}
      />

      <Footer />
    </ProtectedRoute>
  );
}