import * as React from 'react'

import styles from './tooltip.module.css'

type TooltipProps = {
  children: React.ReactNode
  delay?: number
  className?: string
}

export const Tooltip = ({
  delay = 10000,
  className,
  children,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(true)

  const tooltipClassName = className
    ? `${className} ${styles.container}`
    : styles.container

  const handleOnMouseOver = React.useCallback(() => {
    setIsVisible(false)
  }, [])

  React.useEffect(() => {
    if (isVisible) {
      setTimeout(() => setIsVisible(false), delay)
    }
  }, [isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <div
      role="tooltip"
      className={tooltipClassName}
      onMouseOver={handleOnMouseOver}
    >
      <p className={styles.content}>{children}</p>
    </div>
  )
}
