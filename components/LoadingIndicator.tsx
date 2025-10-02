import React from "react"
import Lottie from "lottie-react"
import loadingAnimation from "public/animations/loading.json"

type LoadingIndicatorProps = {
  message?: string
  size?: number
  className?: string
  textClassName?: string
  orientation?: "vertical" | "horizontal"
  loop?: boolean
}

export default function LoadingIndicator({
  message = "Loading...",
  size = 140,
  className = "",
  textClassName = "text-purple-800 font-semibold text-lg",
  orientation = "vertical",
  loop = true,
}: LoadingIndicatorProps) {
  const containerClasses =
    orientation === "horizontal"
      ? "flex flex-row items-center justify-center gap-3"
      : "flex flex-col items-center justify-center gap-3"

  return (
    <div className={`${containerClasses} ${className}`.trim()} aria-busy="true" aria-live="polite">
      <div style={{ width: size, height: size }}>
        <Lottie animationData={loadingAnimation} loop={loop} />
      </div>
      {message ? <span className={textClassName}>{message}</span> : null}
    </div>
  )
}
