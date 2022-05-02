import type { NextPage } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { RegisterOptions, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import type { ResponseData } from '~/types/response'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { ERROR_EXAMPLE } from '~/constants/errors-examples'

import styles from './home.module.css'

type FormData = {
  error: string
}
type FormRegisterOptions = {
  [key in keyof FormData]: RegisterOptions<FormData>
}

const formOptions: FormRegisterOptions = {
  error: {
    required: 'Enter an error message',
  },
}

const Home: NextPage = () => {
  const [{ template, wasInvalidErrorMessage, errorCount }, setData] =
    React.useState<Partial<ResponseData>>({})
  const {
    register,
    handleSubmit,
    formState: { errors, submitCount, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      error: ERROR_EXAMPLE,
    },
  })

  const onSubmit: SubmitHandler<FormData> = React.useCallback(
    async ({ error }) => {
      try {
        const response = await fetch('/api/parse-ts-error', {
          method: 'POST',
          body: error,
        })
        const responseData: ResponseData = await response.json()

        return setData(responseData)
      } catch (error) {
        console.error(error)
      }
    },
    [],
  )

  React.useEffect(() => {
    if (errors.error) {
      toast.error(errors.error.message, {
        theme: 'dark',
      })
    }
  }, [errors, submitCount])

  return (
    <>
      <Head>
        <title>Better TS Errors</title>
        <meta
          name="description"
          content="A simple parser for visualizing a simplified version of TS errors."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
          >
            <textarea
              className={styles.textarea}
              rows={10}
              placeholder="Error message"
              required
              {...register('error', formOptions.error)}
            ></textarea>
            <button className={styles.button} disabled={isSubmitting}>
              Parse this out
            </button>
          </form>
          {template && (
            <section className={styles.section}>
              {wasInvalidErrorMessage ? (
                <div className={styles.empty}>
                  <h2 className={styles.typeScriptErrorsTitle}>
                    No errors found 😔
                  </h2>
                </div>
              ) : (
                <>
                  <hr className={styles.divider} />
                  <h2 className={styles.typeScriptErrorsTitle}>
                    TypeScript Errors ({errorCount})
                  </h2>
                  <div
                    className={styles.markdown}
                    dangerouslySetInnerHTML={{
                      __html: template as string,
                    }}
                  />
                </>
              )}
            </section>
          )}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
