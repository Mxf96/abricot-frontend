import Link from 'next/link';

import styles from '@/styles/components/projects/Projects.module.scss';

type Member = {
  initials: string;
  role: 'owner' | 'member';
};

type ProjectCardProps = {
  id: number;
  name: string;
  description: string;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  members: Member[];
};

export default function ProjectCard({
  id,
  name,
  description,
  progress,
  completedTasks,
  totalTasks,
  members,
}: ProjectCardProps) {
  const owner = members.find((member) => member.role === 'owner');

  const contributors = members.filter((member) => member.role === 'member');

  return (
    <Link
      href={`/projects/${id}`}
      className={styles.projectCardLink}
      aria-label={`Voir le projet ${name}`}
    >
      <article className={styles.projectCard}>
        <div className={styles.projectMain}>
          <h2>{name}</h2>

          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span>Progression</span>

            <strong>{progress}%</strong>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressValue}
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className={styles.tasksCount}>
            {completedTasks}/{totalTasks} tâches terminées
          </p>
        </div>

        <div className={styles.teamSection}>
          <div className={styles.teamTitle}>
            <span className={styles.teamIcon}>♣</span>

            <span>Équipe ({members.length})</span>
          </div>

          <div className={styles.members}>
            {owner && (
              <>
                <span className={`${styles.avatar} ${styles.ownerAvatar}`}>
                  {owner.initials}
                </span>

                <span className={styles.ownerBadge}>Propriétaire</span>
              </>
            )}

            <div className={styles.contributors}>
              {contributors.map((member) => (
                <span key={member.initials} className={styles.avatar}>
                  {member.initials}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}