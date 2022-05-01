import type { NextPage } from 'next'
import Head from 'next/head'
import * as React from 'react'

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [errorTemplate, setErrorTemplate] = React.useState('')
  // 2 lazy 2 debounce this
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const onSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    async event => {
      event.preventDefault()
      setIsSubmitting(true)

      try {
        const form = event.currentTarget
        const formData = new FormData(form)
        const error = formData.get('error')

        const response = await fetch('/api/parse-ts-error', {
          method: 'POST',
          body: error,
        })
        const { content } = await response.json()

        return setErrorTemplate(content)
      } catch (error) {
        console.error(error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [],
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Fill in your TypeScript error</h1>
        <form className={styles.form} onSubmit={onSubmit}>
          <textarea
            className={styles.textarea}
            name="error"
            rows={10}
            placeholder="Error message"
            required
          ></textarea>
          <button className={styles.button} disabled={isSubmitting}>
            Parse this out
          </button>
        </form>
        {errorTemplate && (
          <section className={styles.section}>
            <hr className={styles.divider} />
            <div
              className={styles.markdown}
              dangerouslySetInnerHTML={{
                __html: errorTemplate,
              }}
            />
          </section>
        )}
      </main>
    </div>
  )
}

export default Home
