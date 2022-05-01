import styles from './footer.module.css'

export const Footer = () => (
  <footer className={styles.footer}>
    <small>
      Based on{' '}
      <a
        target="_blank"
        href="https://github.com/mattpocock/ts-error-translator"
        rel="noopener noreferrer"
        className={styles.link}
      >
        ts-error-translator
      </a>{' '}
      by{' '}
      <a
        target="_blank"
        href="https://twitter.com/mpocock1"
        rel="noopener noreferrer"
        className={styles.link}
      >
        Matt Pocock
      </a>
    </small>
  </footer>
)
