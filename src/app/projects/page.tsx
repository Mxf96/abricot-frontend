import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProjectCard from '@/components/projects/ProjectCard';

import styles from '@/styles/components/projects/Projects.module.scss';

const projects = Array.from({ length: 9 }, (_, index) => ({
  id: index + 1,
  name: 'Nom du projet',
  description:
    "Développement de la nouvelle version de l'API REST avec authentification JWT",
  progress: 0,
  completedTasks: 0,
  totalTasks: 2,
  members: [
    {
      initials: 'AD',
      role: 'owner' as const,
    },
    {
      initials: 'BC',
      role: 'member' as const,
    },
    {
      initials: 'CV',
      role: 'member' as const,
    },
  ],
}));

export default function ProjectsPage() {
  return (
    <>
      <Header />

      <main className={styles.projectsPage}>
        <section className={styles.projectsHeader}>
          <div>
            <h1>Mes projets</h1>
            <p>Gérez vos projets</p>
          </div>

          <button type="button" className={styles.createProjectButton}>
            + Créer un projet
          </button>
        </section>

        <section className={styles.projectsGrid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}