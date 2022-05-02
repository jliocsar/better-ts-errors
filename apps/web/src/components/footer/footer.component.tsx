import styles from './footer.module.css'

export const Footer = () => (
  <footer className={styles.footer}>
    <small>
      Inspired by{' '}
      <a
        target="_blank"
        href="https://github.com/mattpocock/ts-error-translator"
        rel="noopener noreferrer"
        className={styles.link}
      >
        ts-error-translator
      </a>{' '}
    </small>
    <small>
      Made with <span className={styles.heart}>❤</span> by{' '}
      <a
        target="_blank"
        href="https://github.com/jliocsar"
        rel="noopener noreferrer"
        className={styles.link}
      >
        jliocsar
      </a>
    </small>
  </footer>
)
