import styles from './header.module.css'

export const Header = () => (
  <header className={styles.header}>
    <b className={styles.titleIcon}>🦩</b>
    <section className={styles.titleSection}>
      <h1 className={styles.title}>Fill in your TypeScript error</h1>
      <span className={styles.subtitle}>to make it look prettier</span>
    </section>
  </header>
)
