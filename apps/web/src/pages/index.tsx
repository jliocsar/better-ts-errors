import type { NextPage } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { toast } from 'react-toastify'
import { RegisterOptions, SubmitHandler, useForm } from 'react-hook-form'
import { Options as HotkeysOptions, useHotkeys } from 'react-hotkeys-hook'

import type { ResponseData } from '~/types/response'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { ERROR_EXAMPLE } from '~/constants/errors-examples'
import { Tooltip } from '~/components/tooltip'

import styles from './home.module.css'

type FormData = {
  error: string
}
type FormRegisterOptions = {
  [key in keyof FormData]: RegisterOptions<FormData>
}

const hotkeysOptions: HotkeysOptions = {
  enableOnTags: ['TEXTAREA'],
}
const formOptions: FormRegisterOptions = {
  error: {
    required: 'Enter an error message',
  },
}

const Home: NextPage = () => {
  const submitRef = React.useRef<HTMLButtonElement>(null)
  const [hasUsedHotkeys, setHasUsedHotkeys] = React.useState(false)

  const [{ template, wasInvalidErrorMessage, errorCount }, setData] =
    React.useState<Partial<ResponseData>>({})
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, submitCount, isSubmitting, isSubmitted },
  } = useForm<FormData>({
    mode: 'onChange',
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

  const handleCtrlEnterPress = React.useCallback(() => {
    setHasUsedHotkeys(true)
    submitRef.current?.click()
  }, [])

  React.useEffect(() => {
    if (errors.error) {
      toast.error(errors.error.message, {
        theme: 'dark',
        className: styles.toast,
      })
    }
  }, [errors, submitCount])

  React.useEffect(() => {
    setFocus('error')
  }, [setFocus])

  useHotkeys('ctrl+enter', handleCtrlEnterPress, hotkeysOptions)

  return (
    <>
      <Head>
        <title>Better TS Errors</title>
        <meta
          name="description"
          content="A parser and formatter for visualizing a simplified version of TS errors."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          {isSubmitted && !hasUsedHotkeys && (
            <Tooltip className={styles.tooltip}>
              You can also use <kbd className={styles.keybind}>CTRL+Enter</kbd>
              <br />
              to submit the form 😄
            </Tooltip>
          )}
          <form
            autoComplete="off"
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <textarea
              className={styles.textarea}
              rows={10}
              placeholder="Error message"
              required
              {...register('error', formOptions.error)}
            ></textarea>
            <button
              className={styles.button}
              disabled={isSubmitting}
              ref={submitRef}
            >
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
