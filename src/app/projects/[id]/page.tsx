import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProjectTaskCard from '@/components/projects/ProjectTaskCard';

import styles from '@/styles/components/projects/SingleProject.module.scss';

const tasks = [
  {
    id: 1,
    title: 'Authentification JWT',
    description: "Implémenter le système d'authentification avec tokens JWT",
    date: '9 mars',
    status: 'todo' as const,
    comments: 1,
  },
  {
    id: 2,
    title: 'Authentification JWT',
    description: "Implémenter le système d'authentification avec tokens JWT",
    date: '9 mars',
    status: 'in-progress' as const,
    comments: 1,
  },
  {
    id: 3,
    title: 'Authentification JWT',
    description: "Implémenter le système d'authentification avec tokens JWT",
    date: '9 mars',
    status: 'done' as const,
    comments: 1,
  },
  {
    id: 4,
    title: 'Authentification JWT',
    description: "Implémenter le système d'authentification avec tokens JWT",
    date: '9 mars',
    status: 'todo' as const,
    comments: 1,
  },
];

export default function SingleProjectPage() {
  return (
    <>
      <Header />

      <main className={styles.projectPage}>
        {/* En-tête du projet */}
        <section className={styles.projectHeader}>
          <div className={styles.projectInformations}>
            <Link
              href="/projects"
              className={styles.backButton}
              aria-label="Retour aux projets"
            >
              ←
            </Link>

            <div>
              <div className={styles.projectTitle}>
                <h1>Nom du projet</h1>

                <button type="button" className={styles.editButton}>
                  Modifier
                </button>
              </div>

              <p>
                Développement de la nouvelle version de l&apos;API REST avec
                authentification JWT
              </p>
            </div>
          </div>

          <div className={styles.projectActions}>
            <button type="button" className={styles.createTaskButton}>
              Créer une tâche
            </button>

            <button type="button" className={styles.aiButton}>
              <span>✦</span>
              IA
            </button>
          </div>
        </section>

        {/* Contributeurs */}
        <section className={styles.contributorsBar}>
          <div className={styles.contributorsTitle}>
            <span>Contributeurs</span>
            <span className={styles.contributorsCount}>3 personnes</span>
          </div>

          <div className={styles.contributors}>
            <span className={`${styles.avatar} ${styles.ownerAvatar}`}>AD</span>

            <span className={styles.ownerBadge}>Propriétaire</span>

            <span className={styles.avatar}>BD</span>

            <span className={styles.memberBadge}>Bertrand Dupont</span>

            <span className={styles.avatar}>AD</span>

            <span className={styles.memberBadge}>Anne Dupont</span>
          </div>
        </section>

        {/* Tâches */}
        <section className={styles.tasksSection}>
          <div className={styles.tasksHeader}>
            <div>
              <h2>Tâches</h2>
              <p>Par ordre de priorité</p>
            </div>

            <div className={styles.tasksTools}>
              <div className={styles.viewSelector}>
                <button
                  type="button"
                  className={`${styles.viewButton} ${styles.activeView}`}
                >
                  ✓<span>Liste</span>
                </button>

                <button type="button" className={styles.viewButton}>
                  ▣<span>Calendrier</span>
                </button>
              </div>

              <select
                className={styles.statusSelect}
                defaultValue=""
                aria-label="Filtrer par statut"
              >
                <option value="" disabled>
                  Statut
                </option>

                <option value="todo">À faire</option>
                <option value="in-progress">En cours</option>
                <option value="done">Terminée</option>
              </select>

              <div className={styles.search}>
                <input
                  type="search"
                  placeholder="Rechercher une tâche"
                  aria-label="Rechercher une tâche"
                />

                <span>⌕</span>
              </div>
            </div>
          </div>

          <div className={styles.tasksList}>
            {tasks.map((task) => (
              <ProjectTaskCard key={task.id} {...task} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
