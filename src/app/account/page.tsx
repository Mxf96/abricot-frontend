import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

import styles from '@/styles/components/account/Account.module.scss';

export default function AccountPage() {
  return (
    <>
      <Header />

      <main className={styles.accountPage}>
        <section className={styles.accountCard}>
          <div className={styles.accountHeader}>
            <h1>Mon compte</h1>

            <p>Amélie Dupont</p>
          </div>

          <form className={styles.accountForm}>
            <div className={styles.field}>
              <label htmlFor="lastName">Nom</label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Dupont"
                autoComplete="family-name"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="firstName">Prénom</label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Amélie"
                autoComplete="given-name"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="a.dupont@mail.com"
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Mot de passe</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nouveau mot de passe"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Modifier les informations
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}